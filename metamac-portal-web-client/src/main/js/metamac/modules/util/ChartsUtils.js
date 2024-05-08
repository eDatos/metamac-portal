(function () {
    "use strict";

    App.namespace("App.util.ChartsUtils");

    App.util.ChartsUtils = {};

    App.util.ChartsUtils._triggerTooltipOnClosestItem = function (chart) {
        var previousSeriesIndex;
        var previousDataIndex;
        chart.getZr().on("mousemove", (p) => {
            var mouseCartesianCoords = chart.convertFromPixel('grid', [p.offsetX, p.offsetY]);
            var dataIndex = mouseCartesianCoords[0];
            var y = mouseCartesianCoords[1];
            if (y >= 0 && dataIndex >= 0 && dataIndex < chart.getOption().xAxis[0].data.length) {
                var seriesIndex = this._getClosestSerieToCoordinatesOfLinesChart(chart, dataIndex, y);
                chart.dispatchAction({type: 'showTip', seriesIndex: seriesIndex, dataIndex: dataIndex});
                chart.dispatchAction({type: 'highlight', seriesIndex: seriesIndex, dataIndex: dataIndex});
                chart.dispatchAction({type: 'downplay', seriesIndex: previousSeriesIndex, dataIndex: previousDataIndex});
                previousSeriesIndex = seriesIndex;
                previousDataIndex = dataIndex;
            } else {
                chart.dispatchAction({type: 'hideTip'});
                chart.dispatchAction({type: 'downplay', seriesIndex: previousSeriesIndex, dataIndex: previousDataIndex});
            }
        });

        chart.on("globalout", () => {
            chart.dispatchAction({type: 'hideTip'});
            chart.dispatchAction({type: 'downplay', seriesIndex: previousSeriesIndex, dataIndex: previousDataIndex});
        });
    };

    App.util.ChartsUtils._getClosestSerieToCoordinatesOfLinesChart = function (chart, x, y) {
        var series = chart.getOption().series;
        return series.reduce(function (closestSerie, serie, serieIndex) {
            if (closestSerie === null) {
                return serieIndex;
            }
            var currentSerieIsCloser = Math.abs(serie.data[x].value - y) < Math.abs(series[closestSerie].data[x].value - y);
            return currentSerieIsCloser ? serieIndex : closestSerie
        }, null);
    };
}());
