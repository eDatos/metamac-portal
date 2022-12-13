(function () {
    "use strict";

    var Constants = App.Constants;

    App.namespace("App.VisualElement.ColumnChart");

    App.VisualElement.ColumnChart = function (options) {
        this.initialize(options);
        this._type = 'column';

        _.extend(this._chartOptions, {
            chart: {
                animation: false,
                renderTo: '',
                defaultSeriesType: 'column',
                backgroundColor: Constants.colors.istacWhite
            },
            title: {
                text: '',
                style: {
                    color: App.Constants.colors.hiddenText,
                    fontSize: App.Constants.font.title.size
                }
            },
            subtitle: {
                text: '',
                style: {
                    color: App.Constants.colors.hiddenText
                }
            },
            xAxis: {
                categories: [],
                labels: {
                    maxStaggerLines: 1
                }
            },
            yAxis: {
                title: {
                    text: ""
                }
            },
            tooltip: {
                formatter: this.tooltipFormatter
            },
            plotOptions: {
                series: {
                    animation: false
                },
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0,
                    events: {
                        legendItemClick: function () {
                            return false;
                        }
                    },
                    states: {
                        inactive: {
                            opacity: 1
                        }
                    }
                }
            },
            series: []
        });
    };

    App.VisualElement.ColumnChart.prototype = new App.VisualElement.RectangularBars();
}());
