(function () {
    "use strict";

    App.namespace("App.util.ChartsUtils");

    App.util.ChartsUtils = {};

    var onMouseMove;

    // This method is an alternative to display the tooltip at the point closest to the mouse until the issue is resolved:
    // https://github.com/apache/echarts/issues/16675
    App.util.ChartsUtils._setTooltipTriggerOnClosestItem = function (chart) {
        var previousSeriesIndex;
        var previousDataIndex;
        var chartOptions = chart.getOption();
        if (onMouseMove) {
            chart.getZr().off("mousemove", onMouseMove);
        }
        onMouseMove = (p) => {
            var mouseCartesianCoords = chart.convertFromPixel('grid', [p.offsetX, p.offsetY]);
            var dataIndex = mouseCartesianCoords[0];
            var y = mouseCartesianCoords[1];
            if (dataIndex >= 0 && dataIndex < chartOptions.xAxis[0].data.length) {
                var seriesIndex = this._getClosestSerieToCoordinatesOfLinesChart(chart, dataIndex, y, chartOptions);
                if (seriesIndex !== previousSeriesIndex || dataIndex !== previousDataIndex) {
                    if (seriesIndex !== previousSeriesIndex) {
                        chart.dispatchAction({type: 'unselect', seriesIndex: previousSeriesIndex, dataIndex: previousDataIndex});
                    }
                    chart.dispatchAction({type: 'select', seriesIndex: seriesIndex, dataIndex: dataIndex});
                    chart.dispatchAction({type: 'showTip', seriesIndex: seriesIndex, dataIndex: dataIndex});
                    previousSeriesIndex = seriesIndex;
                    previousDataIndex = dataIndex;
                }
            } else {
                chart.dispatchAction({type: 'hideTip'});
                chart.dispatchAction({type: 'unselect', seriesIndex: previousSeriesIndex, dataIndex: previousDataIndex});
                previousSeriesIndex = null;
                previousDataIndex = null;
            }
        };
        chart.getZr().on("mousemove", onMouseMove);

        chart.on("globalout", () => {
            chart.dispatchAction({type: 'hideTip'});
            chart.dispatchAction({type: 'unselect', seriesIndex: previousSeriesIndex, dataIndex: previousDataIndex});
            previousSeriesIndex = null;
            previousDataIndex = null;
        });
    };

    App.util.ChartsUtils._getClosestSerieToCoordinatesOfLinesChart = function (chart, x, y, chartOptions) {
        var series = chartOptions.series;
        return series.reduce(function (closestSerie, serie, serieIndex) {
            if (closestSerie === null) {
                return serieIndex;
            }
            var currentSerieIsCloser = Math.abs(serie.data[x].value - y) < Math.abs(series[closestSerie].data[x].value - y);
            return currentSerieIsCloser ? serieIndex : closestSerie;
        }, null);
    };
}());
