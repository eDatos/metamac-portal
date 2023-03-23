(function () {
    "use strict";

    App.namespace("App.datasource.helper.DatasetHelper");

    App.datasource.helper.DatasetHelper = function () {
    };

    App.datasource.helper.DatasetHelper.prototype = {

        getBaseUrl: function () {
            return App.endpoints["statistical-resources"];
        },

        buildUrlIdentifierPart: function (identifier) {
            return '/datasets/' + identifier.agency + '/' + identifier.identifier + '/' + identifier.version;
        },

        typedMetadataResponseToMetadataResponse: function (response) {
            return response;
        },

        getParametersForMetadataUrl: function () {
            return ".json?_type=json&fields=-data,+dimension.description";
        },

        getParametersForDataUrl: function() {
            return '.json?_type=json&fields=-metadata';
        },

        typedApiResponseToApiResponse: function(response) {
            return response;
        },

        typedResponseToObservations: function(response) {
            return response.data.observations.split(" | ");
        }

    };

}());