(function () {
    "use strict";

    App.namespace("App.datasource.helper.DatasourceHelperFactory");

    var HELPERS = {
        "dataset": new App.datasource.helper.DatasetHelper(),
        "query": new App.datasource.helper.QueryHelper(),
        "indicator": new App.datasource.helper.IndicatorHelper(),
        "indicatorInstance": new App.datasource.helper.IndicatorSystemHelper(),
        "multidataset": new App.datasource.helper.MultidatasetHelper()
    };

    App.datasource.helper.DatasourceHelperFactory = {
        
        getHelper: function (type) {
            var result = HELPERS[type];
            if (!result) {
                throw Error("type " + type + " not supported");
            }
            return result;
        }

    };

}());