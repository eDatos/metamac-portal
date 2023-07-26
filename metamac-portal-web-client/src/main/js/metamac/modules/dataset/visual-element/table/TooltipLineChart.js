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
        this._setPermutation(options.permutation);

        this._chartOptions = {
            chart: {
                animation: false,
                renderTo: '',
                type: 'line',
                borderWidth: 0,
                backgroundColor: Constants.colors.istacWhite,
                marginRight: 0
            },
            tooltip: {
                formatter: this.tooltipFormatter
            },
            yAxis: {
                title: {
                    text: ""
                },
                plotLines: [
                    {
                        value: 0,
                        width: 1,
                        color: Constants.colors.istacGreyDark
                    }
                ],
                minPadding: 0,
                maxPadding: 0
            },
            plotOptions: {
                line: {
                    lineWidth: 1.5,
                    marker: {
                        enabled: false
                    }
                },
                series: {
                    animation: false,
                    turboThreshold: 1200,
                    marker: {
                        states: {
                            hover: {
                                fillColor: Constants.colors.istacGreyDark
                            }
                        }
                    }
                }
            },
            title: {
                text: undefined
            },
            subtitle: {
                text: '',
                style: {
                    color: App.Constants.colors.hiddenText
                }
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            xAxis: {
                visible: false
            }
        };
    };

    App.VisualElement.TooltipLineChart.prototype = {

        _setPermutation: function(permutation) {
            this.permutation = permutation;
            this.measureUnit = this.data.metadata.measureUnitForSelection(permutation);
            this.unitMultiplier = this.data.metadata.unitMultiplierForSelection(permutation);
        },

        tooltipFormatter: function () {
            return this.point.name + '<br/>' + this.x;
        },

        destroy: function () {
            if (this.detailChart) {
                this.detailChart.destroy();
                this.detailChart = null;
            }
        },

        render: function () {
            this.$el.css({ height: HEIGHT, width: WIDTH });
            this._chartOptions.chart.renderTo = this.$el[0];
            
            var data = this._getData();
            this._chartOptions.series = [data.serie];
            this._chartOptions.xAxis.categories = data.xAxis;

            this.detailChart = new Highcharts.Chart(this._chartOptions);
            this._checkVisibility(data);
        },

        update: function(permutation) {
            this._setPermutation(permutation);

            this.detailChart.series[0].remove(false);
            var data = this._getData();
            this.detailChart.addSeries(data.serie, true, false);
            this.detailChart.xAxis[0].setCategories(data.xAxis);
            this._checkVisibility(data);
        },

        _emptyData: function(data) {
            return !Array.isArray(data.serie.data) || data.serie.data.every(function(value) { return value.y == null; });
        },

        _checkVisibility: function(data) {
            if (this._emptyData(data)) {
                this.$el.hide()
            }
            else {
                this.$el.show()
            };
        },

        _getData: function () {
            var temporalGranularityForPermutation = this._findTemporalGranularityForPermutation();
            var timeDimensionCategories = this.timeDimension.get('representations').where({ temporalGranularity: temporalGranularityForPermutation });
            timeDimensionCategories = _.sortBy(timeDimensionCategories, function (representation) {
                return representation.normCode;
            }).reverse();

            var fixedPermutation = this.permutation;
            
            var serie = {};
            serie.data = [];
            var xAxis = [];

            var self = this;
            _.each(timeDimensionCategories, function (timeCategory) {
                var currentPermutation = {};
                currentPermutation[self.timeDimension.id] = timeCategory.id;
                currentPermutation = _.extend({}, fixedPermutation, currentPermutation);

                var y = self.data.getNumberData({ ids: currentPermutation });
                var name = self.data.getStringData({ ids: currentPermutation });
                name = name + " " + App.DimensionsUtils.getUnitMultiplierAndUnitMeasureLabel(self.measureUnit, self.unitMultiplier);
                
                var point = { y: y, name: name };

                if (self.permutation[self.timeDimension.id] === timeCategory.id) {
                    point.marker = { enabled: true, radius: 5 };
                }

                serie.data.push(point);

                xAxis.push(timeCategory.get("visibleLabel"));
            });

            return {
                serie: serie,
                xAxis: xAxis
            };
        },

        _findTemporalGranularityForPermutation: function () {
            var selectedTimeCategory = this.timeDimension.get('representations').findWhere({ id: this.permutation[this.timeDimension.id]});
            return selectedTimeCategory.get("temporalGranularity");
        }

    };

}());
