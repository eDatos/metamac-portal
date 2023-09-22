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
        },

        getDimensionLabel: function (dimension) {
            return App.InternationalizationUtils.localizeLabel(dimension.pluralName && !_.isEmpty(dimension.pluralName.text) ?  dimension.pluralName.text : dimension.name.text);
        },

        getUnitMultiplierAndUnitMeasureLabel: function(unitMeasure, unitMultiplier) {
            var label = "";
            if (unitMeasure || unitMultiplier) {
                label = "(";
                if (!unitMeasure && unitMultiplier) {
                    label += unitMultiplier.value;
                } else if (unitMeasure) {
                    // Normally, units urn will be "urn:sdmx:org.sdmx.infomodel.codelist.Code=SDMX:CL_UNIT_MULT(1.0).0" so for now is enough.
                    if (unitMultiplier && !unitMultiplier.urn.endsWith(".0")) {
                        var unitMultiplierText = unitMultiplier.value;
                        var translation = App.i18n.startsWithVowelOrH(unitMeasure) ? 
                            'entity.category.measure.unitMeasureStartsWithVowel' : 'entity.category.measure.unitMeasure';
                        label += I18n.t(translation, { unit: unitMeasure, multiplier: unitMultiplierText });
                    } else {
                        label += unitMeasure;
                    }
                }
                label += ")";
            }
            return label;
        },

    };
}());
