(function () {
    "use strict";

    App.namespace("App.datasource.MetadataRequest");

    App.datasource.MetadataRequest = function (datasourceIdentifier) {
        this.initialize(datasourceIdentifier);
    };

    App.datasource.MetadataRequest.prototype = {

        initialize : function (datasourceIdentifier) {
            this.datasourceIdentifier = datasourceIdentifier;
            this.helper = App.datasource.helper.DatasourceHelperFactory.getHelper(this.datasourceIdentifier.getIdentifier().type);
        },

        fetch: function (callback) {
            var self = this;
            $.ajax({
                url: self._url()
            }).success(function (response) {
                self.response = response;
                var result = self.checkAllDimensionHaveRepresentations(self);
                callback(result.error, result.success);
            }). error(function(response) {
                self.response = response;
                var errorsJson = JSON.parse(response.responseText);
                var error = I18n.t(errorsJson.code);
                callback(error, null);
            });
        },
        
        checkAllDimensionHaveRepresentations: function(self) {
            var allHaveRepresentation = true;
            var dimensionWithoutRepresentation = '';
            if (self.response.dimension)  {
                const dimensions = Object.values(self.response.dimension);
                for (let dimension of dimensions) {
                    if (!dimension.representation) {
                        allHaveRepresentation = false;
                        dimensionWithoutRepresentation = dimension;
                    }
                }
            }
            if (allHaveRepresentation) {
                return {success : 'done', error: null};
            } else {
                var error = I18n.t('exception.resources.indicators.no_representations', {error: dimensionWithoutRepresentation});
                return {success : null , error : error};
            }
        },

        _url: function() {
            return this.helper.getBaseUrl() + this.helper.buildUrlIdentifierPart(this.datasourceIdentifier.getIdentifier()) + this.helper.getParametersForMetadataUrl();
        },

        getMetadataResponse: function(unitMeasureProperties) {
            return new App.datasource.model.MetadataResponse({ datasourceIdentifier: this.datasourceIdentifier, datasourceHelper: this.helper, response: this.response, unitMeasureProperties: unitMeasureProperties});
        }

    };

}());