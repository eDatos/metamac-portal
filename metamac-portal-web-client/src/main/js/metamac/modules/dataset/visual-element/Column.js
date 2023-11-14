(function () {
    "use strict";

    var Constants = App.Constants;

    App.namespace("App.VisualElement.ColumnChart");

    App.VisualElement.ColumnChart = function (options) {
        this.initializeRectangularBars(options);
        this._dataAxis = 'xAxis';
    };

    App.VisualElement.ColumnChart.prototype = new App.VisualElement.RectangularBars();
}());
