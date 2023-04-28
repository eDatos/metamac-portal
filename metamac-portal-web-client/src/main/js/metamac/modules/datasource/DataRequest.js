(function () {
    "use strict";

    App.namespace("App.datasource.DataRequest");

    App.datasource.DataRequest = function (datasourceIdentifier) {
        this.initialize(datasourceIdentifier);
    };

    App.datasource.DataRequest.prototype = {

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
                callback(null, "done")
            }).error(function (response) {
                self.response = response;
                var errorsJson = JSON.parse(response.responseText);
                var error = I18n.t(errorsJson.code);
                callback(error, null);
            });
        },

        _url: function() {
            return this.helper.getBaseUrl() + this.helper.buildUrlIdentifierPart(this.datasourceIdentifier.getIdentifier()) + this.helper.getParametersForDataUrl();
        },

        getDataResponse: function(metadata, filterDimensions) {
            console.log('entra en getDataResponse')
            return new App.datasource.model.DataResponse(this.response, metadata, this.helper, filterDimensions);
        }

    };

}());