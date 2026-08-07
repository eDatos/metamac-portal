(function () {
    "use strict";

    var Constants = App.Constants;

    App.namespace("App.VisualElement.RectangularBars");

    App.VisualElement.RectangularBars = function () {
        this._dataAxis = 'xAxis';
    };

    App.VisualElement.RectangularBars.prototype = new App.VisualElement.Base();
    _.extend(App.VisualElement.RectangularBars.prototype, new App.VisualElement.Chart());
    _.extend(App.VisualElement.RectangularBars.prototype, {

        initializeRectangularBars: function (options) {
            this.initialize(options);
            this._initializeChartVisualElement(options);
            this.tooltipPosition = (this._dataAxis === "xAxis") ? 'top' : 'right';

            var titleBottom = Constants.charts.gap;
            var legendBottom = titleBottom + (this.showRightsHolderText() ? Constants.charts.gap + this.getRightsHolderStyle().fontSize : 0);
            this._extendChartOptions({
                title: {
                    text: this.getRightsHolderText(),
                    show: this.showRightsHolderText(),
                    bottom: titleBottom
                },
                legend: {
                    bottom: legendBottom
                },
                xAxis: {
                    axisLabel: {
                        align: 'right',
                        interval: 0,
                        overflow: 'truncate'
                    }
                },
                yAxis: {
                    axisLabel: {
                        overflow: 'truncate'
                    }
                }
            });
            if (this._dataAxis === 'xAxis') {
                this._extendChartOptions({
                    xAxis: {
                        axisLabel: {
                            rotate: 70,
                            verticalAlign: "top"
                        }
                    }
                });
            }
        },

        load: function () {
            this._bindEvents();
            if (!this.assertAllDimensionsHaveSelections()) {
                return;
            }
            this.render();
        },

        _bindEvents: function () {
            var debounceUpdate = _.debounce(this.update, 20);
            this.listenTo(this.filterDimensions, "change:drawable change:zone change:visibleLabelType reverse change:sortBy", debounceUpdate);
            this.listenTo(this.filterDimensions, "change:valuesToIgnore", debounceUpdate);

            var resize = _.debounce(_.bind(this._updateSize, this), 200);
            var self = this;
            this._resizeObserver = new ResizeObserver(function () {
                resize();
            });
            this._resizeObserver.observe(this.$el[0]);
        },

        _unbindEvents: function () {
            this.stopListening();
            this._resizeObserver.disconnect();
        },

        _onChartDestroy: function () {
            this._unbindEvents();
        },

        updatingDimensionPositions: function () {
            App.VisualElement.Base.prototype.updatingDimensionPositions.apply(this, arguments);

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

            this._initializeChart(this.$el);
            var data = this.getData();
            this._extendChartOptions(data);
            this._updateChartOptions();
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
            var gridBottom = this._chartOptions.legend.bottom + (result.legend.show ? this._getLegendHeight() : 0) + Constants.charts.bigGap;
            result.grid = {
                bottom: gridBottom,
            }
            result.series = this._getSeries(columnsDimensionSelectedCategories, columnsDimension, dataAxisDimensionSelectedCategories, dataAxisDimension);
            result[this._dataAxis] = {
                data: _.invoke(dataAxisDimensionSelectedCategories, 'get', 'visibleLabel'),
                axisLine: {
                    lineStyle: {
                        width: Constants.charts.dataAxisWidth,
                        color: Constants.colors.gray40
                    }
                },
                axisLabel: {
                    width: (this._dataAxis === 'xAxis')
                        ? this._getXAxisLabelWidth(this._getChartDomEl().clientHeight - gridBottom - this._chartOptions.grid.top)
                        : this._getYAxisLabelWidth(this._getChartDomEl().clientWidth - this._chartOptions.grid.left - this._chartOptions.grid.right)
                }
            };

            this._removeIgnoredValuesFromSeries(result);
            this._sortSeriesAndDataAxis(result, dataAxisDimension, columnsDimension);

            return result;
        },

        _onHeightUpdated: function () {
            if (this._dataAxis === 'xAxis') {
                this._extendChartOptions({
                    xAxis: {
                        axisLabel: {
                            width: this._getXAxisLabelWidth(this._getChartDomEl().clientHeight - this._chartOptions.grid.bottom - this._chartOptions.grid.top)
                        }
                    }
                });
                this._updateChartOptions();
            }
        },

        _onWidthUpdated: function () {
            if (this._dataAxis === 'yAxis') {
                this._extendChartOptions({
                    yAxis: {
                        axisLabel: {
                            width: this._getYAxisLabelWidth(this._getChartDomEl().clientWidth - this._chartOptions.grid.left - this._chartOptions.grid.right)
                        }
                    }
                });
                this._updateChartOptions();
            }
        },

        _updateChartOptions: function() {
            this._getChart().setOption(this._chartOptions, true);
            this._setTooltipObserver();
        },

        _getSeries: function (columnsDimensionSelectedCategories, columnsDimension, dataAxisDimensionSelectedCategories, dataAxisDimension) {
            var self = this;

            var series = [];
            var fixedPermutation = this.getFixedPermutation();
            _.each(columnsDimensionSelectedCategories, function (columnCategory, i) {
                var serie = {};
                serie.id = columnCategory.get('id');
                serie.type = 'bar';
                serie.name = self._createUniqueNameForData(columnCategory.get('visibleLabel'), i);
                serie.data = [];
                serie.barMaxWidth = "35%";
                serie.barCategoryGap = "50%";
                serie.emphasis = {
                    itemStyle: {
                        color: "inherit",
                        opacity: 0.75
                    }
                };

                if (columnsDimensionSelectedCategories.length !== 1) {
                    serie.itemStyle = {
                        color: self.data.colors[columnCategory.get('urn')]
                    }
                }

                _.each(dataAxisDimensionSelectedCategories, function (dataAxisCategory) {
                    var currentPermutation = {};
                    currentPermutation[dataAxisDimension.id] = dataAxisCategory.id;
                    currentPermutation[columnsDimension.id] = columnCategory.id;
                    _.extend(currentPermutation, fixedPermutation);

                    serie.data.push({
                        value: self.data.getNumberData({ ids: currentPermutation }),
                        name: self.data.getStringData({ ids: currentPermutation }) + " " + self._getDataUnit(currentPermutation),
                        itemStyle: {
                            // `undefined` is returned in case colors object is empty, so default values are used instead
                            color: (columnsDimensionSelectedCategories.length === 1)  ? self.data.colors[dataAxisCategory.get('urn')] : undefined
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
                        return -lastSerieDataItem.value;
                    case App.Constants.dimension.sortBy.REPRESENTATION:
                        return dataAxisDimensionIsTemporal ? -index : index;
                    default:
                        console.error("sortBy unsupported ", dataAxisSortBy);
                        return -lastSerieDataItem.value;
                }
            }).map(function (lastSerieDataItem) {
                return lastSerieDataItem.originalOrder;
            });
            if (this._dataAxis === "yAxis") {
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

            if (!this._getChart()) {
                this.load();
                return;
            }

            this.updateTitle();
            var data = this.getData();

            this._extendChartOptions(data);
            this._updateChartOptions();
        }
    });

}());
