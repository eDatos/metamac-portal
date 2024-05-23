(function () {
    "use strict";

    var Constants = App.Constants;

    App.namespace("App.VisualElement.LineChart");

    App.VisualElement.LineChart = function (options) {
        this._initializeChartVisualElement(options);
        this._type = 'line';

        var self = this;
        var titleBottom = Constants.charts.lines.dataZoom.horizontal.height + Constants.charts.gap;
        var legendBottom = titleBottom + (this._chartOptions.title.show ? Constants.charts.gap + Constants.charts.title.fontSize : 0);
        this._extendChartOptions({
            tooltip: {
                triggerOn: "none",
                position: function (point, params, domEl, rect) {
                    self.coordsTooltipPointsTo = [
                        rect.x + (rect.width / 2) + self._getChartDomEl().getBoundingClientRect().x,
                        rect.y + (rect.height / 2) + self._getChartDomEl().getBoundingClientRect().y
                    ];
                    return 'top';
                }
            },
            xAxis: {
                axisLine: {
                    lineStyle: {
                        width: Constants.charts.dataAxisWidth,
                        color: Constants.colors.istacGreyMedium
                    }
                },
                axisLabel: {
                    interval: function (categoryIndex) {
                        if (self._getChart()) {
                            var dataZoom = self._getChart().getOption().dataZoom[0];
                            var interval = Math.ceil((dataZoom.endValue - dataZoom.startValue + 1) / Constants.charts.lines.xAxisTicks);
                            return ((categoryIndex - dataZoom.startValue) % interval) === 0;
                        } else {
                            return true;
                        }
                    },
                    align: 'right',
                    hideOverlap: true,
                    rotate: 70,
                    verticalAlign: "top",
                    width: '200',
                    overflow: 'truncate'
                }
            },
            dataZoom: this._getDataZooms(0),
            title: {
                bottom: titleBottom
            },
            legend: {
                bottom: legendBottom
            },
            grid: {
                right: Constants.charts.lines.dataZoom.vertical.width + Constants.charts.gap
            }
        });
    };

    App.VisualElement.LineChart.prototype = new App.VisualElement.Chart();

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

            this._initializeChart();
            App.util.ChartsUtils._triggerTooltipOnClosestItem(this._getChart());

            this._extendChartOptions(this.getData());
            this._getChart().setOption(this._chartOptions, true);
            this._setTooltipObserver();
        },

        update: function () {
            if (!this.assertAllDimensionsHaveSelections()) {
                return;
            }

            if (!this._getChart()) {
                this.load();
            } else {
                this.updateTitle();

                this._extendChartOptions(this.getData());
                this._getChart().setOption(this._chartOptions, true);
                this._setTooltipObserver();
            }
        },

        getData: function () {
            var dataAxisDimension = this.getDataAxisDimension();
            var linesDimension = this.getSeriesDimension();
            var dataAxisDimensionCategories = this._getDataAxisDimensionCategories(dataAxisDimension);
            var linesDimensionSelectedCategories = this._getLinesDimensionCategories(linesDimension);

            var showLegend = !linesDimension.get('singleValue');
            var gridBottom = this._chartOptions.legend.bottom + (showLegend ? this._getLegendHeight() + Constants.charts.gap : 0);
            return {
                legend: {
                    show: showLegend
                },
                grid: {
                    bottom: gridBottom
                },
                series: this._getSeries(linesDimensionSelectedCategories, linesDimension, dataAxisDimensionCategories, dataAxisDimension),
                xAxis: {
                    data: _.invoke(dataAxisDimensionCategories, 'get', 'visibleLabel')
                },
                dataZoom: this._getDataZooms(gridBottom)
            };
        },

        _getDataZooms: function(gridBottom) {
            return [
                {
                    type: 'slider',
                    xAxisIndex: [0],
                    showDetail: false,
                    left: 'center',
                    height: Constants.charts.lines.dataZoom.horizontal.height,
                    bottom: 0,
                    end: (this.data.metadata.getTimeDimensions().length > 0) ? Constants.charts.lines.dataZoom.horizontal.end : Constants.charts.lines.dataZoom.horizontal.partialEnd
                },
                {
                    type: 'slider',
                    yAxisIndex: [0],
                    showDetail: false,
                    right: 0,
                    width: Constants.charts.lines.dataZoom.vertical.width,
                    top: Constants.charts.lines.dataZoom.vertical.topMargin,
                    bottom: gridBottom + Constants.charts.lines.dataZoom.vertical.bottomMargin
                }
            ];
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
            _.each(linesDimensionSelectedCategories, function (linesCategory, i) {
                // `undefined` is returned in case colors object is empty, so default values are used instead
                var lineColor = self.data.colors[linesCategory.get('urn')];
                var serie = {
                    type: "line",
                    lineStyle: {
                        width: 1.5,
                        color: lineColor
                    },
                    silent: true,
                    itemStyle: {
                        color: lineColor,
                        opacity: 0
                    },
                    symbolSize: 5,
                    symbol: 'circle',
                    animation: false,
                    name: linesDimension.get('singleValue') ? "" : linesCategory.get('visibleLabel'),
                    emphasis: {
                        disabled: true // Disabled until this issue is fixed: https://github.com/apache/echarts/issues/19958
                    },
                    select: {
                        disabled: false,
                        itemStyle: {
                            color: lineColor,
                            opacity: 1
                        }
                    },
                    selectedMode: 'single',
                    showAllSymbol: true, // https://github.com/apache/echarts/issues/19608#issuecomment-1937838187 , tooltip and emphasis have problems without this and itemStyle.opacity
                    data: []
                };

                _.each(dataAxisDimensionCategories, function (dataAxisCategory, j) {
                    var currentPermutation = {};
                    currentPermutation[dataAxisDimension.id] = dataAxisCategory.id;
                    currentPermutation[linesDimension.id] = linesCategory.id;
                    _.extend(currentPermutation, fixedPermutation);

                    serie.data.push({
                        value: dataAxisCategory.get("drawable") ? self.data.getNumberData({ ids: currentPermutation }) : null,
                        name: 'data-name-' + i + '-' + j, // https://github.com/apache/echarts/issues/15260#issuecomment-870518002
                        tooltip: {
                            formatter: _.bind(function (tooltipFormatterParams) {
                                tooltipFormatterParams.name = this.data.getStringData({ ids: currentPermutation });
                                return this.getTooltipFormatterFunction(tooltipFormatterParams);
                            }, self)
                        }
                    });
                });

                series.push(serie);
            });

            return series;
        }

    });

}());
