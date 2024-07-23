(function () {
    "use strict";

    App.namespace("App.VisualElement.BarChart");

    App.VisualElement.BarChart = function (options) {
        this._dataAxis = 'yAxis';
        this.initializeRectangularBars(options);
    };

    App.VisualElement.BarChart.prototype = new App.VisualElement.RectangularBars();
}());
