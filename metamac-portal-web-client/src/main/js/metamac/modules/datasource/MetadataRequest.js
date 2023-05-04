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
                var allHaveRepresentation = true;
                var dimensionWithoutRepresentation = '';
                for (var dimension in self.response.dimension) {
                    if (!dimension.representation) {
                        allHaveRepresentation = false;
                        dimensionWithoutRepresentation = dimension;
                    }
                }
                if (allHaveRepresentation) {
                    callback(null, "done");
                } else {
                    var error = I18n.t('exception.resources.indicators.no_representations');
                    callback(error.replace("{0}", dimensionWithoutRepresentation), null);
                }
            }). error(function(response) {
                self.response = response;
                var errorsJson = JSON.parse(response.responseText);
                var error = I18n.t(errorsJson.code);
                callback(error, null);
            });
        },

        _url: function() {
            return this.helper.getBaseUrl() + this.helper.buildUrlIdentifierPart(this.datasourceIdentifier.getIdentifier()) + this.helper.getParametersForMetadataUrl();
        },

        getMetadataResponse: function() {
            return new App.datasource.model.MetadataResponse({ datasourceIdentifier: this.datasourceIdentifier, datasourceHelper: this.helper, response: this.response});
        }

    };

}());