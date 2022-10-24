(function () {
    "use strict";

    App.namespace("App.DimensionsUtils");

    App.DimensionsUtils = {

        /*
        La petición tiene el siguiente aspecto:
          ?representation=MOTIVOS_ESTANCIA[000|001|002]:ISLAS_DESTINO_PRINCIPAL[005|006]
        */

        getDimensionsParameterForRequest: function (dimensions) {
            var parameterValue = this.getDimensionsParameterValueForRequest(dimensions);
            return !!parameterValue ? ("representation" + "=" + parameterValue) : "";
        },

        getDimensionsParameterValueForRequest: function (dimensions) {
            return _.map(dimensions,
                function (dimension) {
                    return dimension.id + "[" + dimension.representations.join("|") + "]";
                }).join(":");
        },

        isIndicatorRequest: function () {
            return App.queryParams.type === "indicator" || App.queryParams.type === "indicatorInstance";
        }
    };
}());
