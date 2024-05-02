(function () {
    "use strict";

    App.namespace("App.VisualElement.ColumnChart");

    App.VisualElement.ColumnChart = function (options) {
        this._dataAxis = 'xAxis';
        this.initializeRectangularBars(options);
    };

    App.VisualElement.ColumnChart.prototype = new App.VisualElement.RectangularBars();
}());
