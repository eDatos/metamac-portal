(function () {
    "use strict";

    var Constants = App.Constants;

    App.namespace("App.VisualElement.LineChart");

    App.VisualElement.LineChart = function (options) {
        this.initialize(options);
        this._type = 'line';

        var self = this;
        var titleBottom = Constants.charts.lines.dataZoom.horizontal.height + Constants.charts.gap;
        var legendBottom = titleBottom + (this._chartOptions.title.show ? Constants.charts.gap + Constants.charts.title.fontSize : 0);
        this._extendChartOptions({
            tooltip: {
                position: function (point, params, domEl, rect) {
                    self.coordsTooltipPointsTo = [
                        rect.x + (rect.width / 2) + self.$chartContainer[0].getBoundingClientRect().x,
                        rect.y + (rect.height / 2) + self.$chartContainer[0].getBoundingClientRect().y
                    ];
                    return 'top';
                },
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
                        if (self.chart) {
                            var dataZoom = self.chart.getOption().dataZoom[0];
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
            if (this.exportChart) {
                this.exportChart.dispose();
                this.exportChart = null;
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

            this.$chartContainer = $('<div>');
            this.$chartContainer.height(this.$el.height() - this.$title.outerHeight(true));
            this.$el.append(this.$chartContainer);

            this.$exportChartContainer = $("#export-chart");
            if (this.$exportChartContainer.length === 0) {
                this.$exportChartContainer = $('<div id="export-chart"></div>');
                $("body").append(this.$exportChartContainer);
            }

            this.chart = this._initializeChart(this.$chartContainer[0]);
            this.exportChart = echarts.init(this.$exportChartContainer[0], null, { renderer: 'svg', height: this.$chartContainer.height(), width: this.$chartContainer.width() });
            App.util.ChartsUtils._triggerTooltipOnClosestItem(this.chart);

            this._extendChartOptions(this.getData());
            this.chart.setOption(this._chartOptions, true);
            this._setTooltipObserver();
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

        getExportChartSvg: function () {
            var exportChartOptions = {};
            App.util.ObjectUtils.deepExtend(exportChartOptions, this._chartOptions);
            var gridHeight = this.$chartContainer.height() - this._chartOptions.grid.bottom - this._chartOptions.grid.top;
            App.util.ObjectUtils.deepExtend(exportChartOptions, {
                dataZoom: undefined,
                title: undefined,
                legend: {
                    type: 'plain',
                    top: this._chartOptions.grid.top + Constants.charts.bigGap + gridHeight + Constants.charts.gap,
                    width: '95%',
                    padding: Constants.charts.bigGap,
                    itemGap: Constants.charts.bigGap,
                },
                grid: {
                    left: this._chartOptions.grid.left + Constants.charts.bigGap,
                    right: Constants.charts.grid.horizontalMargin + Constants.charts.bigGap,
                    top: this._chartOptions.grid.top + Constants.charts.bigGap,
                    height: gridHeight
                }
            });

            this.exportChart.setOption(exportChartOptions, true);
            this.exportChart.resize({
                width: this.$chartContainer.width(),
                height: this.$exportChartContainer[0].firstChild.firstChild.getBBox().height + Constants.charts.bigGap
            });

            return decodeURIComponent(this.exportChart.getDataURL()).match(/<svg(.|\s)*<[/]svg>/g)[0];
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
                    symbolSize: 5,
                    symbol: 'circle',
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
