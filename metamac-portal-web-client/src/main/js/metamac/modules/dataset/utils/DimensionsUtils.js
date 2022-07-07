(function () {
    "use strict";

    App.namespace("App.DimensionsUtils");

    App.DimensionsUtils = {

        /*
          La respuesta tiene el siguiente aspecto para datasets:
          ?dim=MOTIVOS_ESTANCIA:000|001|002:ISLAS_DESTINO_PRINCIPAL:005|006

          Y el siguiente para indicadores:
          ?representation=MOTIVOS_ESTANCIA[000|001|002],ISLAS_DESTINO_PRINCIPAL[005|006]
        */

        getDimensionsParameterForRequest: function (dimensions) {
            return this.isIndicatorRequest() ? this.getDimensionsParameterForIndicatorRequest(dimensions) : this.getDimensionsParameterForDatasetRequest(dimensions);
        },

        getDimensionsParameterForDatasetRequest: function (dimensions) {
            return _.map(dimensions,
                function (dimension) {
                    return dimension.id + ":" + dimension.representations.join("|");
                }).join(":");
        },

        getDimensionsParameterForIndicatorRequest: function (dimensions) {
            return _.map(dimensions,
                function (dimension) {
                    return dimension.id + "[" + dimension.representations.join("|") + "]";
                }).join(",");
        },

        getDimensionsParameterNameForRequest: function () {
            return this.isIndicatorRequest() ? "representation" : "dim";
        },

        isIndicatorRequest: function () {
            return App.queryParams.type === "indicator" || App.queryParams.type === "indicatorInstance";
        }
    };
}());
