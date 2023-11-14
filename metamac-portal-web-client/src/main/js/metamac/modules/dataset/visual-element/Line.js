(function () {
    "use strict";

    var Constants = App.Constants;

    App.namespace("App.VisualElement.LineChart");

    App.VisualElement.LineChart = function (options) {
        this.initialize(options);
        this._type = 'line';

        var self = this;
        var titleBottom = Constants.charts.lines.dataZoom.height + Constants.charts.gap;
        var legendBottom = titleBottom + (this._chartOptions.title.show ? Constants.charts.gap + Constants.charts.title.fontSize : 0);
        this._extendChartOptions({
            tooltip: {
                position: 'top',
                trigger: "item",
                triggerOn: "none"
            },
            xAxis: {
                axisLine: {
                    width: Constants.charts.dataAxisWidth,
                    color: Constants.colors.istacGreyDark
                },
                axisLabel: {
                    interval: function (categoryIndex) {
                        if (self.chart) {
                            var dataZoom = self.chart.getOption().dataZoom[0];
                            var interval = Math.ceil((dataZoom.endValue - dataZoom.startValue + 1) / Constants.charts.lines.xAxisTicks);
                            return ((categoryIndex - dataZoom.startValue) % interval) === 0;
                        } else {
                            return true;
                        }
                    }
                }
            },
            dataZoom: {
                type: 'slider',
                left: 'center',
                height: Constants.charts.lines.dataZoom.height,
                bottom: 0,
                end: (this.data.metadata.getTimeDimensions().length > 0) ? Constants.charts.lines.dataZoom.end : Constants.charts.lines.dataZoom.partialEnd
            },
            title: {
                bottom: titleBottom
            },
            legend: {
                bottom: legendBottom
            }
        });
    };

    App.VisualElement.LineChart.prototype = new App.VisualElement.Base();

    _.extend(App.VisualElement.LineChart.prototype, {

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
            this.listenTo(this.filterDimensions, "change:drawable change:zone change:visibleLabelType reverse", _.debounce(this.update, 100));

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

            this.filterDimensions.zones.get('top').set('maxSize', 1); // lines      
            this.filterDimensions.zones.get('left').set('fixedSize', 1); // AxisX
            this.filterDimensions.zones.get('axisy').set('maxSize', 1);
        },

        _applyVisualizationRestrictions: function () {
            if (this._mustApplyVisualizationRestrictions()) {
                this._moveAllDimensionsToZone('top');
                this._moveAllSingleValueDimensionsToZone('fixed');
                                
                this._forceMeasureDimensionInZone('axisy');
                this._forceTimeDimensionInZone('left');
                this._forceGeographicDimensionInZone('fixed');

                this._applyVisualizationPreselections();
            }

            this._updateMustApplyVisualizationRestrictions();
        },

        _applyVisualizationPreselections: function () {
            this._preselectBiggestHierarchyGeographicValue();
            this._preselectMostPopulatedTemporalGranularityRepresentations();
        },

        render: function () {
            this.$el.empty();
            this.$title = $('<h3></h3>');
            this.updateTitle();
            this.$el.append(this.$title);

            this.$chartContainer = $('<div id="line-chart-container">');
            this.$chartContainer.height(this.$el.height() - this.$title.outerHeight(true));
            this.$el.append(this.$chartContainer);

            this.chart = echarts.init(this.$chartContainer[0]);
            this._setChartMouseEvent();

            this._extendChartOptions(this.getData());
            this.chart.setOption(this._chartOptions, true);
        },

        _setChartMouseEvent: function () {
            this.chart.getZr().on("mousemove", (p) => {
                var mouseCartesianCoords = this.chart.convertFromPixel('grid', [p.offsetX, p.offsetY]);
                var dataIndex = mouseCartesianCoords[0];
                var y = mouseCartesianCoords[1];
                if (y >= 0 && dataIndex >= 0 && dataIndex < this._chartOptions.xAxis.data.length) {
                    var seriesIndex = this._getClosestSerieToCoordinates(dataIndex, y);
                    this.chart.dispatchAction({type: 'showTip', seriesIndex: seriesIndex, dataIndex: dataIndex});
                    this.chart.dispatchAction({type: 'highlight', seriesIndex: seriesIndex});
                } else {
                    this.chart.dispatchAction({type: 'hideTip'});
                    this.chart.dispatchAction({type: 'highlight'});
                }
            });

            this.chart.on("globalout", () => {
                this.chart.dispatchAction({type: 'hideTip'});
                this.chart.dispatchAction({type: 'highlight'});
            });
        },

        _getClosestSerieToCoordinates: function (x, y) {
            var series = this.chart.getOption().series;
            return series.reduce(function (closestSerie, serie, serieIndex) {
                if (closestSerie === null) {
                    return serieIndex;
                }
                var currentSerieIsCloser = Math.abs(serie.data[x].value - y) < Math.abs(series[closestSerie].data[x].value - y);
                return currentSerieIsCloser ? serieIndex : closestSerie
            }, null);
        },

        _updateSize: function () {
            var newHeight = this.$el.height() - this.$title.outerHeight(true);
            this.$chartContainer.height(newHeight);
            this.chart.resize({
                width: this.$chartContainer.width(),
                height: this.$chartContainer.height()
            });
        },

        update: function () {
            if (!this.assertAllDimensionsHaveSelections()) {
                return;
            }

            if (!this.chart) {
                this.load();
            } else {
                this.updateTitle();

                this._extendChartOptions(this.getData());
                this.chart.setOption(this._chartOptions, true);
            }
        },

        getData: function () {
            var dataAxisDimension = this.getDataAxisDimension();
            var linesDimension = this.getSeriesDimension();
            var dataAxisDimensionCategories = this._getDataAxisDimensionCategories(dataAxisDimension);
            var linesDimensionSelectedCategories = this._getLinesDimensionCategories(linesDimension);

            var showLegend = !linesDimension.get('singleValue');
            return {
                legend: {
                    show: showLegend
                },
                grid: {
                    bottom: this._chartOptions.legend.bottom + (showLegend ? this._getLegendHeight() + Constants.charts.gap : 0)
                },
                series: this._getSeries(linesDimensionSelectedCategories, linesDimension, dataAxisDimensionCategories, dataAxisDimension),
                xAxis: {
                    data: _.invoke(dataAxisDimensionCategories, 'get', 'visibleLabel')
                }
            };
        },

        _getDataAxisDimensionCategories: function (dataAxisDimension) {
            var selectedTemporalGranularity = dataAxisDimension.get("representations").getSelectedTemporalGranularity();
            var dataAxisDimensionCategories = dataAxisDimension.get('representations').where({
                temporalGranularity: selectedTemporalGranularity
            });
            dataAxisDimensionCategories = _.sortBy(dataAxisDimensionCategories, function (representation) {
                return representation.normCode;
            }).reverse();
            return dataAxisDimensionCategories;
        },

        _getLinesDimensionCategories: function (linesDimension) {
            return this.getDrawableRepresentations(linesDimension);
        },
        
        _getSeries(linesDimensionSelectedCategories, linesDimension, dataAxisDimensionCategories, dataAxisDimension) {
            var series = [];

            var self = this;
            var fixedPermutation = this.getFixedPermutation();
            _.each(linesDimensionSelectedCategories, function (linesCategory) {
                // `undefined` is returned in case colors object is empty, so default values are used instead
                var lineColor = self.data.colors[linesCategory.get('urn')];
                var serie = {
                    type: "line",
                    lineStyle: {
                        width: 1.5,
                        color: lineColor
                    },
                    itemStyle: {
                        color: lineColor
                    },
                    symbolSize: 3,
                    largeThreshold: 1200,
                    animation: false,
                    name: linesDimension.get('singleValue') ? "" : linesCategory.get('visibleLabel'),
                    emphasis: {
                        focus: "series"
                    },
                    data: []
                };

                _.each(dataAxisDimensionCategories, function (dataAxisCategory) {
                    var currentPermutation = {};
                    currentPermutation[dataAxisDimension.id] = dataAxisCategory.id;
                    currentPermutation[linesDimension.id] = linesCategory.id;
                    _.extend(currentPermutation, fixedPermutation);

                    serie.data.push({
                        value: dataAxisCategory.get("drawable") ? self.data.getNumberData({ ids: currentPermutation }) : null,
                        name: self.data.getStringData({ ids: currentPermutation })
                    });
                });

                series.push(serie);
            });

            return series;
        }

    });

}());
