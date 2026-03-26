(function () {
    "use strict";

    var Constants = App.Constants;

    App.namespace("App.VisualElement.Chart");

    App.VisualElement.Chart = function () {
    };

    App.VisualElement.Chart.prototype = {

        _initializeChartVisualElement: function (options) {
            this.data = options.data;
            this.dataSource = options.dataSource;
            this.filterDimensions = options.filterDimensions;
            this._initializeChartOptions();
        },

        _initializeChart: function ($el) {
            this.$chartContainer = $('<div class="chart-container"></div>');
            $el.append(this.$chartContainer);
            this.chart = echarts.init(this.$chartContainer[0], null, { renderer: 'canvas' });

            this.$exportChartContainer = $("#export-chart");
            if (this.$exportChartContainer.length === 0) {
                this.$exportChartContainer = $('<div id="export-chart"></div>');
                $("body").append(this.$exportChartContainer);
            }
            this.exportChart = echarts.init(this.$exportChartContainer[0], null, { renderer: 'svg', height: this.$chartContainer.height(), width: this.$chartContainer.width() });

            this._extendChartOptions({ tooltip: { appendTo: this.$chartContainer[0] }});
        },

        _initializeChartOptions: function () {
            var self = this;
            self.tooltipPosition = "top";
            this._chartOptions = {
                textStyle: {
                    fontFamily: "Helvetica, Arial, sans-serif"
                },
                animation: false,
                backgroundColor: Constants.colors.istacWhite,
                grid: {
                    left: Constants.charts.grid.horizontalMargin,
                    right: Constants.charts.grid.horizontalMargin,
                    top: Constants.charts.grid.topMargin,
                    containLabel: true
                },
                legend: {
                    show: true,
                    selectedMode: false,
                    type: 'scroll',
                    animationDurationUpdate: 100,
                    width: '90%',
                    backgroundColor: Constants.colors.istacWhite,
                    left: 'center',
                    top: null,
                    borderWidth: 1,
                    borderColor: Constants.colors.istacGreyMedium,
                    pageIconColor: Constants.colors.istacBlueMedium,
                    pageIconInactiveColor: Constants.colors.istacGreyMedium,
                    pageIconSize: Constants.charts.legend.fontSize,
                    animation: true,
                    orient: 'horizontal',
                    pageTextStyle: {
                        color: Constants.colors.istacBlack,
                        fontSize: Constants.charts.legend.fontSize,
                        fontWeight: 'bold'
                    },
                    itemHeight: Constants.charts.legend.itemHeight,
                    padding: Constants.charts.legend.padding,
                    textStyle: {
                        fontSize: Constants.charts.legend.fontSize,
                        color: Constants.colors.istacBlack
                    }
                },
                xAxis: {
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        fontSize: Constants.charts.axis.fontSize,
                        color: Constants.colors.istacGreyDark,
                        formatter: this.axisLabelFormatter,
                        hideOverlap: true
                    }
                },
                yAxis: {
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        fontSize: Constants.charts.axis.fontSize,
                        color: Constants.colors.istacGreyDark,
                        formatter: this.axisLabelFormatter,
                        hideOverlap: true
                    }
                },
                title: {
                    right: Constants.charts.title.marginRight,
                    padding: 0,
                    textStyle: {
                        fontSize: Constants.charts.title.fontSize,
                        color: Constants.colors.istacBlack,
                        fontWeight: 'normal'
                    }
                },
                tooltip: {
                    formatter: _.bind(this.getTooltipFormatterFunction, this),
                    className: Constants.charts.tooltip.className,
                    trigger: "item",
                    confine: true,
                    padding: Constants.charts.tooltip.padding,
                    textStyle: {
                        fontSize: Constants.charts.tooltip.fontSize,
                        color: Constants.colors.istacBlack
                    },
                    position: function (point, params, domEl, rect) {
                        self.coordsTooltipPointsTo = [
                            rect.x + (rect.width / 2) + self._getChartDomEl().getBoundingClientRect().x,
                            rect.y + (rect.height / 2) + self._getChartDomEl().getBoundingClientRect().y
                        ];
                        return self.tooltipPosition;
                    }
                },
                color: Constants.charts.colors
            };
        },

        getTooltipFormatterFunction: function (tooltipFormatterParams) {
            var seriesName = tooltipFormatterParams.seriesName ? (tooltipFormatterParams.seriesName + ', ') : '';
            var axisCategoryName = this._chartOptions[this._dataAxis || 'xAxis'].data[tooltipFormatterParams.dataIndex];
            var tooltipContent = '<strong>' + seriesName + axisCategoryName + '</strong>:<br/>' + tooltipFormatterParams.name;
            return this._getWrappedTooltipContent(tooltipContent);
        },

        _getWrappedTooltipContent: function (content) {
            var tooltipPadding = Constants.charts.tooltip.padding;
            var tooltipBorderWidth = Constants.charts.tooltip.borderWidth;
            var tooltipMaxWidth = Math.min(Constants.charts.tooltip.maxWidth, this.$chartContainer.width() - ((tooltipPadding + tooltipBorderWidth) * 2));
            return '<div class="chart-tooltip-container" style="padding: ' + tooltipPadding + 'px;max-width: ' + tooltipMaxWidth + 'px">' + content + '</div>';
        },

        _getDataUnit: function (permutation) {
            var attributes = this.data.getDataById(permutation).attributes;
            return App.DimensionsUtils.getUnitMultiplierAndUnitMeasureLabel(
                this.dataSource.formatMeasureUnit(permutation, attributes.dimensionsAttributes),
                this.dataSource.formatUnitMultiplier(permutation, attributes.dimensionsAttributes)
            );
        },

        axisLabelFormatter: function (value) {
            return (typeof value === 'number') ? App.util.NumberFormatter.strNumberToLocalizedString(value.toString()) : value;
        },

        destroy: function () {
            this._onChartDestroy();

            if (this.chart) {
                this.chart.dispose();
                this.chart = null;
            }
            if (this.exportChart) {
                this.exportChart.dispose();
                this.exportChart = null;
            }
        },

        _onChartDestroy: function () {
        },

        _updateSize: function () {
            if (this.$chartContainer.height() !== this.chart.getHeight()) {
                this._onHeightUpdated();
            }
            if (this.$chartContainer.width() !== this.chart.getWidth()) {
                this._onWidthUpdated();
            }
            this.chart.resize({
                width: this.$chartContainer.width(),
                height: this.$chartContainer.height()
            });
        },

        _onHeightUpdated: function () {
        },

        _onWidthUpdated: function () {
        },
        
        _getXAxisLabelWidth: function (gridHeight) {
            return Math.min(Constants.charts.axis.maxWidth, (gridHeight)/4);
        },

        _getYAxisLabelWidth: function (gridWidth) {
            return Math.min(Constants.charts.axis.maxWidth, (gridWidth)/4);
        },

        _getChart: function () {
            return this.chart;
        },

        _getChartDomEl: function () {
            return this.$chartContainer ? this.$chartContainer[0] : undefined;
        },

        _getLegendHeight: function () {
            return Constants.charts.legend.itemHeight + Constants.charts.legend.padding * 2;
        },

        _extendChartOptions: function (options) {
            App.util.ObjectUtils.deepExtend(this._chartOptions, options);
        },

        _setTooltipObserver: function () {
            this.tooltipEl = document.querySelector('.chart-tooltip');
            var self = this;
            this.tooltipObserver = new MutationObserver(function () {
                var tooltipLeft = self.tooltipEl.getBoundingClientRect().left;
                var tooltipRight = self.tooltipEl.getBoundingClientRect().right;
                var tooltipTop = self.tooltipEl.getBoundingClientRect().top;
                var tooltipBottom = self.tooltipEl.getBoundingClientRect().bottom;
                var chartLeft = self._getChartDomEl().getBoundingClientRect().x;
                var chartRight = chartLeft + self._getChartDomEl().getBoundingClientRect().width;
                var safeDistanceToCorner = 8;

                var arrowLeft;
                if ((self.coordsTooltipPointsTo[0] - safeDistanceToCorner) < chartLeft) {
                    arrowLeft = safeDistanceToCorner;
                } else if ((self.coordsTooltipPointsTo[0] + safeDistanceToCorner) > chartRight) {
                    arrowLeft = tooltipRight - tooltipLeft - safeDistanceToCorner;
                } else {
                    arrowLeft = Math.min(tooltipRight, Math.max(self.coordsTooltipPointsTo[0], tooltipLeft)) - tooltipLeft;
                }
                arrowLeft = arrowLeft - 5 - (arrowLeft === (tooltipRight - tooltipLeft)) + (arrowLeft === 0);

                var arrowTop = Math.min(tooltipBottom, Math.max(self.coordsTooltipPointsTo[1], tooltipTop)) - tooltipTop;
                arrowTop = arrowTop - 5 - (arrowTop === (tooltipBottom - tooltipTop)) + (arrowTop === 0);

                var tooltipContainer = self.tooltipEl.getElementsByClassName("chart-tooltip-container")[0];
                tooltipContainer.style.setProperty('--left', Math.round(arrowLeft) + 'px');
                tooltipContainer.style.setProperty('--top', Math.round(arrowTop) + 'px');
            });
            this.tooltipObserver.observe(this.tooltipEl, {childList: true, attributes: true, attributeFilter: ['style']});
        },

        getExportChartSvg: function () {
            var exportChartOptions = {};
            App.util.ObjectUtils.deepExtend(exportChartOptions, this._chartOptions);
            var gridHeight = this.$chartContainer.height() - this._chartOptions.grid.bottom - this._chartOptions.grid.top;
            var gridTop = this._chartOptions.grid.top + Constants.charts.bigGap;
            var titleTop = gridTop + gridHeight + Constants.charts.bigGap;
            App.util.ObjectUtils.deepExtend(exportChartOptions, {
                dataZoom: undefined,
                title: {
                    show: true,
                    top: titleTop
                },
                animation: false,
                tooltip: {
                    show: false,
                    className: Constants.charts.tooltip.exportClassName
                },
                legend: {
                    type: 'plain',
                    top: titleTop + Constants.charts.bigGap,
                    width: '95%',
                    padding: Constants.charts.bigGap,
                    itemGap: Constants.charts.bigGap,
                    textStyle: {
                        fontSize: Constants.charts.legend.exportFontSize
                    }
                },
                grid: {
                    left: this._chartOptions.grid.left + Constants.charts.bigGap,
                    right: Constants.charts.grid.horizontalMargin + Constants.charts.bigGap,
                    top: gridTop,
                    height: gridHeight
                }
            });
            App.util.ObjectUtils.deepExtend(exportChartOptions, this._getExtraExportOptions());

            /*
             * The width must be changed before the height because height is set to the minimum necessary (getBBox) and
             * that depends on the width and the options.
             */
            this.exportChart.resize({
                width: this.$chartContainer.width()
            });
            this.exportChart.setOption(exportChartOptions, true);
            this.exportChart.resize({
                height: this._getExportChartHeight()
            });

            return this.exportChart.renderToSVGString();
        },

        _getExportChartHeight: function () {
            return this.$exportChartContainer[0].querySelector("svg > g").getBBox().height + (Constants.charts.bigGap * 2);
        },

        _getExtraExportOptions: function () {
        },

        _preselectBiggestHierarchyGeographicValue: function () {
            var fixedGeographicDimensions = this.filterDimensions.getAllFixedDimensionsCopyByType("GEOGRAPHIC_DIMENSION");
            _(fixedGeographicDimensions).each(function (geographicDimension) {
                var selectedRepresentations = geographicDimension.get('representations').getSelectedRepresentations();
                var biggestHierarchyGeographicValue = _(selectedRepresentations).min(function (representation) {
                    return representation.get("level");
                });
                if (biggestHierarchyGeographicValue != Infinity) {
                    biggestHierarchyGeographicValue.set({ drawable: true });
                }
            });
        },

        _preselectMostPopulatedTemporalGranularityRepresentations: function () {
            var fixedTimeDimensions = this.filterDimensions.getAllNonFixedDimensionsCopyByType("TIME_DIMENSION");
            _(fixedTimeDimensions).each(function (timeDimension) {
                timeDimension.get('representations').updateSelectedTemporalGranularityWithMostRepeatedValue();
                timeDimension.get('representations').updateDrawablesBySelectedGranularity();
            });
        },

        getDataAxisDimension: function () {
            return this.filterDimensions.dimensionsAtZone('left').at(0);
        },

        getSeriesDimension: function () {
            var seriesDimension = this.filterDimensions.dimensionsAtZone('top').at(0);
            if (!seriesDimension) {
                seriesDimension = this.filterDimensions.dimensionsAtZone('fixed').at(0);
            }
            if (!seriesDimension) {
                seriesDimension = this.filterDimensions.dimensionsAtZone('axisy').at(0);
            }
            return seriesDimension;
        },

        update: function () {
        },
    };
}());
