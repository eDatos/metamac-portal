(function () {
    "use strict";

    App.namespace("App.VisualElement.BarChart");

    App.VisualElement.BarChart = function (options) {
        this.initializeRectangularBars(options);
        this._dataAxis = 'yAxis';
    };

    App.VisualElement.BarChart.prototype = new App.VisualElement.RectangularBars();
}());
