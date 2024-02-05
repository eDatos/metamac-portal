(function () {
    "use strict";

    App.namespace("App.datasource.helper.MultidatasetHelper");

    App.datasource.helper.MultidatasetHelper = function () {
    };

    App.datasource.helper.MultidatasetHelper.prototype = {

        getBaseUrl: function () {
            return App.endpoints["statistical-resources"];
        },

        buildUrlIdentifierPart: function (identifier) {
            return '/multidatasets/' + identifier.agency + '/' + identifier.identifier;
        },

        typedMetadataResponseToMetadataResponse: function (response) {
            return response;
        },

        getParametersForMetadataUrl: function () {
            return ".json?_type=json&fields=-data";
        },

        getParametersForDataUrl: function() {
            return '.json?_type=json&fields=-metadata';
        },

        typedApiResponseToApiResponse: function(response) {
            return response;
        },

        typedResponseToObservations: function(response) {
            return null;
        }

    };

}());