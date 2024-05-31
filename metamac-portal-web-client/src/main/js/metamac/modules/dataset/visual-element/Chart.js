(function () {
    "use strict";

    var Constants = App.Constants;

    App.namespace("App.VisualElement.Chart");

    App.VisualElement.Chart = function (options) {
        this._initializeChartVisualElement(options);
    };

    App.VisualElement.Chart.prototype = new App.VisualElement.Base();

    _.extend(App.VisualElement.Chart.prototype, {

        _initializeChartVisualElement: function (options) {
            this.initialize(options);
            this._initializeChartOptions();
        },

        _initializeChart: function () {
            this.$chartContainer = $('<div></div>');
            this.$chartContainer.height(this.$el.height() - this.$title.outerHeight(true));
            this.$el.append(this.$chartContainer);
            this.chart = echarts.init(this.$chartContainer[0], null, { renderer: 'svg' });

            this.$exportChartContainer = $("#export-chart");
            if (this.$exportChartContainer.length === 0) {
                this.$exportChartContainer = $('<div id="export-chart"></div>');
                $("body").append(this.$exportChartContainer);
            }
            this.exportChart = echarts.init(this.$exportChartContainer[0], null, { renderer: 'svg', height: this.$chartContainer.height(), width: this.$chartContainer.width() });
        },

        _initializeChartOptions: function () {
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
                    text: this.getRightsHolderText(),
                    right: 10,
                    padding: 0,
                    show: this.showRightsHolderText(),
                    textStyle: {
                        fontSize: Constants.charts.title.fontSize,
                        color: Constants.colors.istacGreyDark
                    }
                },
                tooltip: {
                    formatter: _.bind(this.getTooltipFormatterFunction, this),
                    className: Constants.charts.tooltip.className,
                    trigger: "item",
                    appendToBody: true,
                    confine: true,
                    padding: Constants.charts.tooltip.padding,
                    textStyle: {
                        fontSize: Constants.charts.tooltip.fontSize,
                        color: Constants.colors.istacBlack
                    }
                }
            };
        },

        getTooltipFormatterFunction: function (tooltipFormatterParams) {
            var seriesName = tooltipFormatterParams.seriesName ? (tooltipFormatterParams.seriesName + ', ') : '';
            var axisCategoryName = this._chartOptions[this._dataAxis || 'xAxis'].data[tooltipFormatterParams.dataIndex];
            return '<div class="chart-tooltip-container" style="max-width: ' + this.$chartContainer.width() + 'px"><strong>' + seriesName + axisCategoryName + '</strong>:<br/>' + tooltipFormatterParams.name + '</div>';
        },

        axisLabelFormatter: function (value) {
            return (typeof value === 'number') ? App.util.NumberFormatter.strNumberToLocalizedString(value.toString()) : value;
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

        _updateSize: function () {
            var newHeight = this.$el.height() - this.$title.outerHeight(true);
            this.$chartContainer.height(newHeight);
            if (newHeight !== this.chart.getHeight()) {
                this._onHeightUpdated();
            }
            this.chart.resize({
                width: this.$chartContainer.width(),
                height: this.$chartContainer.height()
            });
        },

        _onHeightUpdated: function () {
        },
        
        _getXAxisLabelWidth: function (gridHeight) {
            return Math.min(Constants.charts.axis.maxWidth, (gridHeight)/4);
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

                var arrowLeft = Math.min(tooltipRight, Math.max(self.coordsTooltipPointsTo[0], tooltipLeft)) - tooltipLeft;
                var arrowTop = Math.min(tooltipBottom, Math.max(self.coordsTooltipPointsTo[1], tooltipTop)) - tooltipTop;

                var tooltipContainer = self.tooltipEl.getElementsByClassName("chart-tooltip-container")[0];
                tooltipContainer.style.setProperty('--left', (arrowLeft - 3) + 'px');
                tooltipContainer.style.setProperty('--top', (arrowTop - 5) + 'px');
            });
            this.tooltipObserver.observe(this.tooltipEl, {childList: true, attributes: true, attributeFilter: ['style']});
        },

        getExportChartSvg: function () {
            var exportChartOptions = {};
            App.util.ObjectUtils.deepExtend(exportChartOptions, this._chartOptions);
            var gridHeight = this.$chartContainer.height() - this._chartOptions.grid.bottom - this._chartOptions.grid.top;
            App.util.ObjectUtils.deepExtend(exportChartOptions, {
                dataZoom: undefined,
                title: {
                    show: true
                },
                animation: false,
                tooltip: {
                    show: false
                },
                legend: {
                    type: 'plain',
                    top: this._chartOptions.grid.top + Constants.charts.bigGap + gridHeight + Constants.charts.gap,
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
                    top: this._chartOptions.grid.top + Constants.charts.bigGap,
                    height: gridHeight
                }
            });

            /*
             * The width must be changed before the height because height is set to the minimum necessary (getBBox) and
             * that depends on the width and the options.
             */
            this.exportChart.resize({
                width: this.$chartContainer.width()
            });
            this.exportChart.setOption(exportChartOptions, true);
            this.exportChart.resize({
                height: this.$exportChartContainer[0].querySelector("svg > g").getBBox().height + (Constants.charts.bigGap * 2)
            });

            return decodeURIComponent(this.exportChart.getDataURL()).match(/<svg(.|\s)*<[/]svg>/g)[0];
        },

        _forceMeasureDimensionInZone: function (zone) {
            this._forceDimensionTypeInZone("MEASURE_DIMENSION", zone);
        },

        _forceTimeDimensionInZone: function (zone) {
            this._forceDimensionTypeInZone("TIME_DIMENSION", zone);
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

        loadColors: function () {
            if (this.graphColorsEnabled()) {
                var self = this;

                self.showLoading();
                self.api = new App.dataset.StructuralResourcesApi(self.data);
                self.api.getCodelists(function (codelists) {
                    var filteredCodelistsWithVariableElements = [];
                    for (var codelist of codelists) {
                        var filteredCodelist = codelist.code.filter((item) => item.hasOwnProperty("variableElement"))
                        if (filteredCodelist.length > 0) {
                            filteredCodelistsWithVariableElements.push(filteredCodelist);
                        }
                    }

                    if (filteredCodelistsWithVariableElements.length > 0) {
                        var variableUrls = _.map(filteredCodelistsWithVariableElements, function (codelist) {
                            return codelist[0].variableElement.selfLink.href.replace(/\/[^\/]*$/, ".json?fields=+renderingColor");
                        });
                        self.api.getVariableElements(variableUrls, function (variableElements) {
                            var flattenedCodelists = _.flatten(filteredCodelistsWithVariableElements);
                            var flattenedVariableElements = _.flatten(_.map(variableElements, function (variab) {
                                return variab.variableElement;
                            }));

                            for (var code of flattenedCodelists) {
                                self.data.colors[code.urn] = flattenedVariableElements.find(elem => elem.urn === code.variableElement.urn).renderingColor;
                            }

                            self.update();
                            self.hideLoading();
                        });
                    } else {
                        self.hideLoading();
                    }
                });
            }
        },

        colorsLoaded: function() {
            return this.data && this.data.colors && !_.isEmpty(this.data.colors);
        },

        graphColorsEnabled: function () {
            return this.data && App.config["enableGraphColors"];
        }
    });

}());
