(function () {
    "use strict";

    var Constants = App.Constants;

    App.namespace("App.VisualElement.RectangularBars");

    App.VisualElement.RectangularBars = function (options) {
        this.initialize(options);
        this._dataAxis = 'xAxis';
    };

    App.VisualElement.RectangularBars.prototype = new App.VisualElement.Base();

    _.extend(App.VisualElement.RectangularBars.prototype, {

        initializeRectangularBars: function (options) {
            this.initialize(options);

            var titleBottom = Constants.charts.gap;
            var legendBottom = titleBottom + (this._chartOptions.title.show ? Constants.charts.gap + Constants.charts.title.fontSize : 0);
            this._extendChartOptions({
                tooltip: {
                    position: this._dataAxis === "xAxis" ? 'top' : 'right'
                },
                title: {
                    bottom: titleBottom
                },
                legend: {
                    bottom: legendBottom
                }
            });
        },

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

            if (this.chart) {
                this.chart.dispose();
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
            this.$chartContainer.height(this.$el.height() - this.$title.outerHeight(true));

            this.$el.append(this.$chartContainer);

            this.chart = echarts.init(this.$chartContainer[0]);

            var data = this.getData();
            this._extendChartOptions(data);
            this.chart.setOption(this._chartOptions, true);

            this.$el.on("resize", function () { });
        },

        resizeFullScreen: function () { },

        getData: function () {
            var dataAxisDimension = this.getDataAxisDimension();
            var columnsDimension = this.getSeriesDimension();
            var dataAxisDimensionSelectedCategories = this.getDrawableRepresentations(dataAxisDimension);
            var columnsDimensionSelectedCategories = this.getDrawableRepresentations(columnsDimension);

            var result = {};
            result.legend = {
                show: !columnsDimension.get('singleValue') && columnsDimensionSelectedCategories.length !== 1
            };
            result.grid = {
                bottom: this._chartOptions.legend.bottom + (result.legend.show ? this._getLegendHeight() + Constants.charts.gap : 0)
            }
            result.series = this._getSeries(columnsDimensionSelectedCategories, columnsDimension, dataAxisDimensionSelectedCategories, dataAxisDimension);
            result[this._dataAxis] = {
                data: _.invoke(dataAxisDimensionSelectedCategories, 'get', 'visibleLabel'),
                axisLine: {
                    lineStyle: {
                        width: Constants.charts.dataAxisWidth,
                        color: Constants.colors.istacGreyMedium
                    }
                }
            };

            this._removeIgnoredValuesFromSeries(result);
            this._sortSeriesAndDataAxis(result, dataAxisDimension, columnsDimension);

            return result;
        },
        
        _getSeries: function (columnsDimensionSelectedCategories, columnsDimension, dataAxisDimensionSelectedCategories, dataAxisDimension) {
            var self = this;

            var series = [];
            var fixedPermutation = this.getFixedPermutation();
            _.each(columnsDimensionSelectedCategories, function (columnCategory) {
                var serie = {};
                serie.id = columnCategory.get('id');
                serie.type = 'bar';
                serie.name = columnCategory.get('visibleLabel');
                serie.data = [];

                _.each(dataAxisDimensionSelectedCategories, function (dataAxisCategory, dataAxisCategoryIndex) {
                    var currentPermutation = {};
                    currentPermutation[dataAxisDimension.id] = dataAxisCategory.id;
                    currentPermutation[columnsDimension.id] = columnCategory.id;
                    _.extend(currentPermutation, fixedPermutation);

                    serie.data.push({
                        value: self.data.getNumberData({ ids: currentPermutation }),
                        name: self.data.getStringData({ ids: currentPermutation }),
                        itemStyle: {
                            // `undefined` is returned in case colors object is empty, so default values are used instead
                            color: (columnsDimensionSelectedCategories.length === 1)
                                ? self.data.colors[dataAxisCategory.get('urn')]
                                : self.data.colors[columnCategory.get('urn')]
                        }
                    });
                });

                series.push(serie);
            });
            
            return series;
        },

        _sortSeriesAndDataAxis: function (result, dataAxisDimension, columnsDimension) {
            // Instead of checking if we are working with nested columns or not, we simply store the last serie order.
            // In the case of not nested columns, the x axis will be sorted properly
            var dataAxisSortBy = dataAxisDimension.get('sortBy');
            var dataAxisDimensionIsTemporal = dataAxisDimension.isTimeDimension();
            var dataAxisOrderMap = _.sortBy(result.series[result.series.length - 1].data, function (lastSerieDataItem, index) {
                lastSerieDataItem.originalOrder = index;
                switch (dataAxisSortBy) {
                    case App.Constants.dimension.sortBy.OBSERVATION:
                        return lastSerieDataItem.value;
                    case App.Constants.dimension.sortBy.REPRESENTATION:
                        return dataAxisDimensionIsTemporal ? index : -index;
                    default:
                        console.error("sortBy unsupported ", dataAxisSortBy);
                        return lastSerieDataItem.value;
                }
            }).map(function (lastSerieDataItem) {
                return lastSerieDataItem.originalOrder;
            });
            if (this._dataAxis === "xAxis") {
                dataAxisOrderMap.reverse();
            }

            result[this._dataAxis].data = dataAxisOrderMap.map(i => result[this._dataAxis].data[i]);

            var columnSortBy = columnsDimension.get('sortBy');
            var columnDimensionIsTemporal = columnsDimension.get('type') === "TIME_DIMENSION";
            result.series = _.sortBy(result.series, function (serie) {
                switch (columnSortBy) {
                    case App.Constants.dimension.sortBy.OBSERVATION:
                        return -serie.data[0].value;
                    case App.Constants.dimension.sortBy.REPRESENTATION:
                        return columnDimensionIsTemporal ? serie.id : -serie.id;
                    default:
                        console.error("sortBy unsupported ", columnSortBy);
                        return -serie.data[0].value;
                }
            }).map(function (serie) {
                serie.data = dataAxisOrderMap.map(i => serie.data[i]);
                return serie;
            });
        },

        _removeIgnoredValuesFromSeries: function (result) {
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

            var axisIndex = 0;
            while (axisIndex < result[this._dataAxis].data.length) {
                if (result.series.every(serie => toRemove.includes(serie.data[axisIndex].value))) {
                    result[this._dataAxis].data.splice(axisIndex, 1);
                    result.series.forEach(function (serie) {
                        serie.data.splice(axisIndex, 1);
                    });
                } else {
                    axisIndex++;
                }
            }
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

            this._extendChartOptions(data);
            this.chart.setOption(this._chartOptions, true);
        },

        _updateSize: function () {
            var newHeight = this.$el.height() - this.$title.outerHeight(true);
            this.$chartContainer.height(newHeight);
            this.chart.resize({
                width: this.$chartContainer.width(),
                height: this.$chartContainer.height()
            });
        }

    });

}());
