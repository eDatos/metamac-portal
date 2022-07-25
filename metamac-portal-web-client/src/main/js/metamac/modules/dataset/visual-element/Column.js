(function () {
    "use strict";

    var Constants = App.Constants;

    App.namespace("App.VisualElement.ColumnChart");

    App.VisualElement.ColumnChart = function (options) {
        this.initialize(options);
        this._type = 'column';

        _.extend(this._chartOptions, {
            chart: {
                animation: false,
                renderTo: '',
                defaultSeriesType: 'column',
                backgroundColor: Constants.colors.istacWhite
            },
            title: {
                text: '',
                style: {
                    color: App.Constants.colors.hiddenText,
                    fontSize: App.Constants.font.title.size
                }
            },
            subtitle: {
                text: '',
                style: {
                    color: App.Constants.colors.hiddenText
                }
            },
            xAxis: {
                categories: [],
                labels: {
                    maxStaggerLines: 1
                }
            },
            yAxis: {
                title: {
                    text: ""
                }
            },
            tooltip: {
                formatter: this.tooltipFormatter
            },
            plotOptions: {
                series: {
                    animation: false
                },
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0,
                    events: {
                        legendItemClick: function () {
                            return false;
                        }
                    },
                    states: {
                        inactive: {
                            opacity: 1
                        }
                    }
                }
            },
            series: []
        });
    };

    App.VisualElement.ColumnChart.prototype = new App.VisualElement.Base();

    _.extend(App.VisualElement.ColumnChart.prototype, {

        load: function () {
            this._bindEvents();
            if (!this.assertAllDimensionsHaveSelections()) {
                return;
            }
            this.render();
        },

        destroy: function () {
            this._unbindEvents();

            if (this.chart && this.chart.renderTo) {
                this.chart.destroy();
                this.chart = null;
            }
        },

        _bindEvents: function () {
            var debounceUpdate = _.debounce(this.update, 20);
            this.listenTo(this.filterDimensions, "change:drawable change:zone change:visibleLabelType reverse", debounceUpdate);
            this.listenTo(this.filterDimensions, "change:valuesToIgnore", debounceUpdate);

            var resize = _.debounce(_.bind(this._updateSize, this), 200);
            this.$el.on("resize", function (e) {
                e.stopPropagation();
                resize();
            });
        },

        _unbindEvents: function () {
            this.stopListening();
            this.$el.off("resize");
        },

        updatingDimensionPositions: function () {
            this._applyVisualizationRestrictions();
            this.resetDimensionsLimits();

            this.filterDimensions.zones.get('left').set('fixedSize', 1); // AxisX
            this.filterDimensions.zones.get('axisy').set('maxSize', 1);
            this.filterDimensions.zones.get('top').set('maxSize', 1); // columns
        },

        _applyVisualizationRestrictions: function () {
            if (this._mustApplyVisualizationRestrictions()) {
                this._moveAllDimensionsToZone('left');

                this._forceMeasureDimensionInZone('axisy');
                this._forceGeographicDimensionInZone('fixed');
                this._forceTimeDimensionInZone('fixed');

                this._applyVisualizationPreselections();
            }

            this._updateMustApplyVisualizationRestrictions();
        },

        _applyVisualizationPreselections: function () {
            this._preselectBiggestHierarchyGeographicValue();
            this._preselectMostRecentTimeRepresentation();
        },

        render: function () {
            this.$el.html("");
            this.$title = $('<h3></h3>');
            this.updateTitle();
            this.$el.append(this.$title);

            this.$chartContainer = $('<div></div>');
            var newHeight = this.$el.height() - this.$title.height() - this.getRightsHolderHeight();
            this.$chartContainer.height(newHeight);

            this.$el.append(this.$chartContainer);

            var data = this.getData();
            this._chartOptions.series = data.series;
            this._chartOptions.xAxis.categories = data.xAxis;
            this._chartOptions.chart.renderTo = this.$chartContainer[0];

            this._chartOptions.credits.text = this.getRightsHolderText();
            if (!this.showRightsHolderText()) {
                this._chartOptions.credits.style = {
                    color: App.Constants.colors.hiddenText
                }
            }

            this.chart = new Highcharts.Chart(this._chartOptions);

            this.$el.on("resize", function () { });
        },

        resizeFullScreen: function () { },

        tooltipFormatter: function () {
            return '<strong>' + this.series.name + ', ' + this.x + '</strong>:<br/>' + this.point.name;
        },

        getData: function () {
            var self = this;

            var result = {};
            var fixedPermutation = this.getFixedPermutation();

            var horizontalDimension = this.filterDimensions.dimensionsAtZone('left').at(0);
            var columnsDimension = this.filterDimensions.dimensionsAtZone('top').at(0);
            if (!columnsDimension) {
                columnsDimension = this.filterDimensions.dimensionsAtZone('fixed').at(0);
            }
            if (!columnsDimension) {
                columnsDimension = this.filterDimensions.dimensionsAtZone('axisy').at(0);
            }
            var horizontalDimensionSelectedCategories = this.getDrawableRepresentations(horizontalDimension);
            if (horizontalDimension.get('type') == "TIME_DIMENSION") {
                horizontalDimensionSelectedCategories = _.sortBy(horizontalDimensionSelectedCategories, function (representation) {
                    return representation.normCode;
                }).reverse();
            }
            var columnsDimensionSelectedCategories = this.getDrawableRepresentations(columnsDimension);

            var listSeries = [];
            var horizontalAxisCategories = [];
            var columnAxisCategories = [];
            _.each(horizontalDimensionSelectedCategories, function (horizontalCategory, horizontalCategoryIndex) {

                var columnSeries = [];
                _.each(columnsDimensionSelectedCategories, function (columnCategory, columnCategoryIndex) {
                    var serie = {};
                    var currentPermutation = {};
                    currentPermutation[horizontalDimension.id] = horizontalCategory.id;
                    currentPermutation[columnsDimension.id] = columnCategory.id;
                    _.extend(currentPermutation, fixedPermutation);

                    var y = self.data.getNumberData({ ids: currentPermutation });
                    var name = self.data.getStringData({ ids: currentPermutation });
                    // Instead of saving the data as an array on the same serie, we create as many series as needed so we can sort them independtly
                    serie.data = [{ y: y, name: name, x: horizontalCategoryIndex }];
                    serie.name = columnCategory.get('visibleLabel');

                    // We keep track on the categories assigned to each serie, so later we can assign the proper x (order) and column color
                    serie.horizontalCategory = horizontalCategoryIndex;
                    serie.columnCategory = columnCategoryIndex;

                    // Instead of checking if we are working with nested columns or not, we simply store the last order.
                    // In the case of not nested columns, the x axis will be sorted properly
                    horizontalAxisCategories[horizontalCategoryIndex] = { horizontalCategoryIndex: horizontalCategoryIndex, order: y };

                    columnSeries.push(serie);
                });


                // We cheat Highcharts, stacking columns with the same columnCategory with themselves, so we get the proper width. We also sort them
                columnSeries = _.sortBy(columnSeries, function (serie) {
                    return -serie.data[0].y;
                }).map(function (serie, index) {
                    serie.stack = index;
                    serie.stacking = true;
                    return serie;
                });

                listSeries = [].concat(listSeries, columnSeries);
            });

            // Normalize horizontal axis order so the columns are contiguous
            horizontalAxisCategories = _.indexBy(_.sortBy(horizontalAxisCategories, function (horizontalAxisCategory) {
                return -horizontalAxisCategory.order;
            }).map(function (horizontalAxisCategory, index) {
                horizontalAxisCategory.order = index;
                return horizontalAxisCategory;
            }), 'horizontalCategoryIndex');

            // Build and order xaxis
            var xaxis = _.invoke(horizontalDimensionSelectedCategories, 'get', 'visibleLabel');
            xaxis = _.sortBy(xaxis, function (label, horizontalDimensionSelectedCategoryIndex) {
                return horizontalAxisCategories[horizontalDimensionSelectedCategoryIndex].order;
            });

            // We need to reprocess the series so we assign each column each proper sorted color and x value
            result.series = _.map(listSeries, function (serie, index) {
                // We decide the colors the first time we get the value, because that will be the same value they will use on the legend
                if (!columnAxisCategories[serie.columnCategory]) {
                    var totalColors = Highcharts.getOptions().colors.length;
                    columnAxisCategories[serie.columnCategory] = Highcharts.getOptions().colors[index % totalColors];
                } else { // Else, we don´t have to show the label on the legend
                    serie.showInLegend = false;
                    serie.dataLabels = {
                        enabled: false
                    };
                }
                serie.data[0].x = horizontalAxisCategories[serie.horizontalCategory].order;
                serie.data[0].color = columnAxisCategories[serie.columnCategory];
                return serie;
            });

            result.xAxis = xaxis;

            result = this.removeIgnoredValuesFromSeries(result);

            return result;
        },

        removeIgnoredValuesFromSeries: function (result) {
            var toRemove = [];

            if (this.filterDimensions.getValuesToIgnoreStatus().NULL) {
                toRemove.push(null);
            }
            if (this.filterDimensions.getValuesToIgnoreStatus().ZERO) {
                toRemove.push(0);
            }

            if (toRemove.length === 0) {
                return result;
            }

            var filteredSeries = [];
            var filteredXAxis = [];

            for (var [i, xAxis] of result.xAxis.entries()) {
                var serie = result.series.find(serie => serie.data[0].x === i);
                if (!toRemove.includes(serie.data[0].y)) {
                    serie.data[0].x = filteredXAxis.length;
                    filteredSeries.push(serie);
                    filteredXAxis.push(xAxis);
                }
            }

            return {
                series: filteredSeries.sort((a, b) => a.horizontalCategory > b.horizontalCategory ? 1 : -1),
                xAxis: filteredXAxis
            };
        },

        update: function () {
            if (!this.assertAllDimensionsHaveSelections()) {
                return;
            }

            if (!this.chart) {
                this.load();
                return;
            }

            this.updateTitle();
            var data = this.getData();

            this.replaceSeries(this.chart, data.series);
            this.chart.xAxis[0].setCategories(data.xAxis, false);
            this.chart.redraw(false);
        },

        _updateSize: function () {
            var newHeight = this.$el.height() - this.$title.height() - this.getRightsHolderHeight();
            this.$chartContainer.height(newHeight);
            this.chart.setSize(this.$chartContainer.width(), this.$chartContainer.height(), false);

            // Necesario para evitar error en el dibujado tras cambiar a stacked columns     
            this.chart.xAxis[0].update();
        }

    });

}());
