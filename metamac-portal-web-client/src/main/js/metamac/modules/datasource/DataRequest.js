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
                callback(response.responseText, response.responseText);
            });
        },

        _url: function() {
            return this.helper.getBaseUrl() + this.helper.buildUrlIdentifierPart(this.datasourceIdentifier.getIdentifier()) + this.helper.getParametersForDataUrl();
        },

        getDataResponse: function(metadata, filterDimensions) {
            return new App.datasource.model.DataResponse(this.response, metadata, this.helper, filterDimensions);
        }

    };

}());