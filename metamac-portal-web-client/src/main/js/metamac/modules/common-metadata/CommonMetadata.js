(function () {
    "use strict";

    App.namespace("App.CommonMetadata");

    App.CommonMetadata = {

        UNIT_MEASURE_CODE: "edatos.srm.dsd.unit_measure.id",
        UNIT_MEASURE_MULTIPLIER: "edatos.srm.dsd.unit_measure_multiplier.id",

        getProperty: function(property) {
            return new Promise(function(resolve, reject) {
                $.ajax({
                    url: App.endpoints["common-metadata"] + '/properties/' + property,
                    method: "GET",
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8",
                }).done(function(response) {
                    resolve(response.value);
                }).fail(function(jqXHR) {
                    reject(jqXHR)
                });
            });
        },

        getUnitMeasureProperties: function() {
            return new Promise(function(resolve, reject) {
                App.CommonMetadata.getProperty(App.CommonMetadata.UNIT_MEASURE_CODE).then(function(responseUnitCode) {
                    App.CommonMetadata.getProperty(App.CommonMetadata.UNIT_MEASURE_MULTIPLIER).then(function(responseUnitMultiplier) {
                        resolve( { unitCode: responseUnitCode, unitMultiplier: responseUnitMultiplier } );
                    });
                });
            });
        },

    };

}());

