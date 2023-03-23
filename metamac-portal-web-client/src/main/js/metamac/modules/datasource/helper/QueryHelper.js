(function () {
    "use strict";

    App.namespace("App.datasource.helper.QueryHelper");

    App.datasource.helper.QueryHelper = function () {
    };

    App.datasource.helper.QueryHelper.prototype = {

        getBaseUrl: function () {
            return App.endpoints["statistical-resources"];
        },

        buildUrlIdentifierPart: function (identifier) {
            return '/queries/' + identifier.agency + '/' + identifier.identifier;
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