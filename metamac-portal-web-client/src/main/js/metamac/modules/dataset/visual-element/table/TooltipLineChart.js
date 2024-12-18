(function () {
    "use strict";

    var Constants = App.Constants;
    var WIDTH = 400; // El mismo que en tooltip.less .tooltip-inner
    var HEIGHT = WIDTH * 9 / 21;

    App.namespace("App.VisualElement.TooltipLineChart");

    App.VisualElement.TooltipLineChart = function (options) {
        this.$el = options.el;
        this.data = options.data;
        this.timeDimension = options.timeDimension;
        this.measureUnit = options.measureUnit;
        this._setPermutation(options.permutation);

        this._chartOptions = {
            grid: {
                left: Constants.charts.grid.horizontalMargin,
                right: Constants.charts.grid.horizontalMargin,
                bottom: Constants.charts.grid.topMargin,
                top: Constants.charts.grid.topMargin,
                containLabel: true
            },
            tooltip: {
                position: 'top',
                trigger: "item",
                triggerOn: "none",
                appendTo: this.$el[0],
                textStyle: {
                    fontSize: Constants.charts.tooltipLines.tooltip.fontSize,
                    color: Constants.colors.istacBlack
                },
                formatter: _.bind(this.getTooltipFormatterFunction, this)
            },
            animation: false,
            xAxis: {
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        width: Constants.charts.dataAxisWidth,
                        color: Constants.colors.istacGreyMedium
                    }
                }
            },
            yAxis: {
                axisLabel: {
                    formatter: this.axisLabelFormatter
                }
            }
        };
    };

    App.VisualElement.TooltipLineChart.prototype = {

        _setPermutation: function(permutation) {
            this.permutation = permutation;
        },

        getTooltipFormatterFunction: function (tooltipFormatterParams) {
            return tooltipFormatterParams.name + '<br/>' + this._chartOptions.xAxis.data[tooltipFormatterParams.dataIndex];
        },

        axisLabelFormatter: function (value) {
            return (typeof value === 'number') ? App.util.NumberFormatter.strNumberToLocalizedString(value.toString()) : value;
        },

        destroy: function () {
            if (this.chart) {
                this.chart.dispose();
                this.chart = null;
            }
        },

        render: function () {
            this.$el.css({ height: HEIGHT, width: WIDTH });

            this.chart = echarts.init(this.$el[0], null, { renderer: 'canvas' });

            var data = this._getData();
            App.util.ObjectUtils.deepExtend(this._chartOptions, data);
            this._updateChartOptions();
            this._checkVisibility(data);
        },

        update: function(permutation, measureUnit) {
            this._setPermutation(permutation);
            this.measureUnit = measureUnit;

            var data = this._getData();
            App.util.ObjectUtils.deepExtend(this._chartOptions, data);
            this._updateChartOptions();
            this._checkVisibility(data);
        },

        _updateChartOptions: function() {
            this.chart.setOption(this._chartOptions, true);
            App.util.ChartsUtils._setTooltipTriggerOnClosestItem(this.chart);
        },

        _emptyData: function(data) {
            return !Array.isArray(data.series.data) || data.series.data.every(function(serieData) { return serieData.value == null; });
        },

        _checkVisibility: function(data) {
            if (this._emptyData(data)) {
                this.$el.hide()
            }
            else {
                this.$el.show()
            }
        },

        _getData: function () {
            var series = {
                type: 'line',
                animation: false,
                symbol: 'circle',
                symbolSize: 8,
                silent: true,
                itemStyle: {
                    opacity: 0
                },
                lineStyle: {
                    width: 1.5
                },
                emphasis: {
                    disabled: true
                },
                select: {
                    disabled: false,
                    itemStyle: {
                        opacity: 1
                    }
                },
                selectedMode: 'single',
                showAllSymbol: true, // https://github.com/apache/echarts/issues/19608#issuecomment-1937838187 , tooltip and emphasis have problems without this and itemStyle.opacity
                data: []
            };
            var xAxis = {
                data: []
            };

            var self = this;
            var temporalGranularityForPermutation = this._findTemporalGranularityForPermutation();
            var timeDimensionCategories = this.timeDimension.getRepresentationsByTemporalGranularity(temporalGranularityForPermutation);
            timeDimensionCategories = _.sortBy(timeDimensionCategories, function (representation) {
                return representation.normCode;
            }).reverse();
            _.each(timeDimensionCategories, function (timeCategory, i) {
                var currentPermutation = {};
                currentPermutation[self.timeDimension.id] = timeCategory.id;
                currentPermutation = _.extend({}, self.permutation, currentPermutation);

                series.data.push({
                    value: self.data.getNumberData({ ids: currentPermutation }),
                    name: 'data-name-' + i, // https://github.com/apache/echarts/issues/15260#issuecomment-870518002
                    tooltip: {
                        formatter: _.bind(function (tooltipFormatterParams) {
                            tooltipFormatterParams.name = this.data.getStringData({ ids: currentPermutation })+ " " + this.measureUnit;
                            return this.getTooltipFormatterFunction(tooltipFormatterParams);
                        }, self)
                    },
                    itemStyle: {
                        opacity: self.permutation[self.timeDimension.id] === timeCategory.id
                    },
                    select: {
                        itemStyle: {
                            color: Constants.colors.istacGreyDark,
                            borderWidth: Constants.charts.lines.highlight.point.border.width,
                            borderColor: Constants.charts.lines.highlight.point.border.color
                        }
                    }
                });

                xAxis.data.push(timeCategory.get("visibleLabel"));
            });

            return {
                series: series,
                xAxis: xAxis
            };
        },

        _findTemporalGranularityForPermutation: function () {
            var selectedTimeCategory = this.timeDimension.get('representations').findWhere({ id: this.permutation[this.timeDimension.id]});
            return selectedTimeCategory.get("temporalGranularity");
        }

    };

}());
