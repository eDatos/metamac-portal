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
                formatter: this.getTooltipFormatterFunction()
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
            yAxis: {}
        };
    };

    App.VisualElement.TooltipLineChart.prototype = {

        _setPermutation: function(permutation) {
            this.permutation = permutation;
        },

        getTooltipFormatterFunction: function () {
            var self = this;
            return function (tooltipFormatterParams) {
                return tooltipFormatterParams.name + '<br/>' + self._chartOptions.xAxis.data[tooltipFormatterParams.dataIndex];
            }
        },

        destroy: function () {
            if (this.chart) {
                this.chart.dispose();
                this.chart = null;
            }
        },

        render: function () {
            this.$el.css({ height: HEIGHT, width: WIDTH });

            this.chart = echarts.init(this.$el[0], null, { renderer: 'svg' });
            App.util.ChartsUtils._triggerTooltipOnClosestItem(this.chart);

            var data = this._getData();
            App.util.ObjectUtils.deepExtend(this._chartOptions, data);
            this.chart.setOption(this._chartOptions, true);
            this._checkVisibility(data);
        },

        update: function(permutation, measureUnit) {
            this._setPermutation(permutation);
            this.measureUnit = measureUnit;

            var data = this._getData();
            App.util.ObjectUtils.deepExtend(this._chartOptions, data);
            this.chart.setOption(this._chartOptions, true);
            this._checkVisibility(data);
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
                largeThreshold: 1200,
                lineStyle: {
                    width: 1.5
                },
                data: []
            };
            var xAxis = {
                data: []
            };

            var self = this;
            var temporalGranularityForPermutation = this._findTemporalGranularityForPermutation();
            var timeDimensionCategories = this.timeDimension.get('representations').where({ temporalGranularity: temporalGranularityForPermutation });
            timeDimensionCategories = _.sortBy(timeDimensionCategories, function (representation) {
                return representation.normCode;
            }).reverse();
            _.each(timeDimensionCategories, function (timeCategory) {
                var currentPermutation = {};
                currentPermutation[self.timeDimension.id] = timeCategory.id;
                currentPermutation = _.extend({}, self.permutation, currentPermutation);

                series.data.push({
                    value: self.data.getNumberData({ ids: currentPermutation }),
                    name: self.data.getStringData({ ids: currentPermutation })+ " " + self.measureUnit,
                    itemStyle: {
                        opacity: self.permutation[self.timeDimension.id] === timeCategory.id
                    },
                    emphasis: {
                        itemStyle: {
                            color: Constants.colors.istacGreyDark,
                            opacity: 1
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
