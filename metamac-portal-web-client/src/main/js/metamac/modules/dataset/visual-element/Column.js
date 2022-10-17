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
            if (!this.colorsLoaded()) {
                this.loadColors();
            }
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
            this.listenTo(this.filterDimensions, "change:drawable change:zone change:visibleLabelType reverse change:sortBy", debounceUpdate);
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
                this._moveAllSingleValueDimensionsToZone('fixed');
                
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
            this._chartOptions.credits.position.y = 0;
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
            var seriesName = "";
            if (this.series.name != "") {
                seriesName = this.series.name + ', ';
            }
            return '<strong>' + seriesName + this.x + '</strong>:<br/>' + this.point.name;
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
            var horizontalDimensionIsTemporal = horizontalDimension.isTimeDimension();
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
                    // `undefined` is returned in case colors object is empty, so default values are used instead
                    serie.data = [{ y: y, name: name, x: horizontalCategoryIndex, color: self.data.colors[horizontalCategory.get('urn')] }];
                    serie.name = columnCategory.get('visibleLabel');

                    // We keep track on the categories assigned to each serie, so later we can assign the proper x (order) and column color
                    serie.horizontalCategory = horizontalCategoryIndex;
                    serie.columnCategory = columnCategoryIndex;
                    
                    // Used for sorting later
                    serie.id = columnCategory.get('id');

                    // We cheat Highcharts, stacking columns with the same columnCategory with themselves, so we get the proper width
                    serie.stack = columnCategory.get('id');
                    serie.stacking = true;

                    var order = null;
                    switch (horizontalDimension.get('sortBy')) {
                        case App.Constants.dimension.sortBy.OBSERVATION:
                            order = y;
                            break;
                        case App.Constants.dimension.sortBy.REPRESENTATION:
                            if (horizontalDimensionIsTemporal) {
                                order = horizontalCategoryIndex;
                            } else {
                                order = -horizontalCategoryIndex;
                            }
                            break;
                        default:
                            console.error("sortBy unsupported ", horizontalDimension.get('sortBy'));
                            order = y;
                            break;
                    }

                    // Instead of checking if we are working with nested columns or not, we simply store the last order.
                    // In the case of not nested columns, the x axis will be sorted properly
                    horizontalAxisCategories[horizontalCategoryIndex] = { horizontalCategoryIndex: horizontalCategoryIndex, order: order };                    

                    columnSeries.push(serie);
                });


                var columnSortBy = columnsDimension.get('sortBy');
                var columnDimensionIsTemporal = columnsDimension.get('type') == "TIME_DIMENSION";
                columnSeries = _.chain(columnSeries)
                    .map(function(serie) {
                        if (columnsDimension.get('singleValue')) {
                            serie.showInLegend = false;
                            serie.name = "";
                        }
                        return serie;
                    })
                    .sortBy(function (serie) {
                        switch (columnSortBy) {
                            case App.Constants.dimension.sortBy.OBSERVATION:
                                return -serie.data[0].y;
                            case App.Constants.dimension.sortBy.REPRESENTATION:
                                if (columnDimensionIsTemporal) {
                                    return serie.id;
                                } else {
                                    return -serie.id;
                                }
                            default:
                                console.error("sortBy unsupported ", columnSortBy);
                                return -serie.data[0].y;
                        }

                    })
                    .value();

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
                if (!serie.data[0].color) {
                    serie.data[0].color = columnAxisCategories[serie.columnCategory];
                }
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
                var series = result.series.filter(serie => serie.data[0].x === i);

                if (series.every(serie => toRemove.includes(serie.data[0].y))) {
                    // if all the values of the serie are to be removed
                    // then the entire category must be removed too from the graph
                    continue;
                }

                for (const serie of series) {
                    // update the category of the serie in case other before has been deleted
                    serie.data[0].x = filteredXAxis.length;
                }

                filteredSeries.push(...series);
                filteredXAxis.push(xAxis);
            }

            filteredSeries = filteredSeries.sort((a, b) => {
                return result.series.indexOf(a) - result.series.indexOf(b);
            });

            return {
                series: filteredSeries,
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
