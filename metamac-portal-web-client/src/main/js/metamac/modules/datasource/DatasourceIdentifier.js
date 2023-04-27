(function () {
    "use strict";

    App.namespace("App.datasource.DatasourceIdentifier");

    App.datasource.DatasourceIdentifier = function (identifier) {
        this.initialize(identifier);
    };

    App.datasource.DatasourceIdentifier.prototype = {
        
        idAttributes: ["type", "agency", "identifier", "version", "indicatorSystem", "permalinkId", "multidatasetId", "widgetTitle"],
        
        initialize: function (identifier) {
            this.identifier = _.pick(identifier, this.idAttributes) || {};
        },

        getIdentifier: function () {
            return this.identifier;
        },

        equals: function (other) {
            if (_.isUndefined(other)) {
                return false;
            }

            var self = this;
            return _.every(this.idAttributes, function (idAttribute) {
                return self.identifier[idAttribute] === other.identifier[idAttribute];
            });
        }

    };

    App.datasource.DatasourceIdentifier.initializeWithUrn = function (urn) {
        var splittedUrn = urn.split("=");
        var resourcePrefix = splittedUrn[0];
        var statisticalResource = splittedUrn[1];

        var statisticalResourceRegex = /(\w+):([a-z_0-9]+)\(([0-9\.]+)\)/i;
        var statisticalResourceMatchs = statisticalResourceRegex.exec(statisticalResource);

        return new App.datasource.DatasourceIdentifier({
            type: _.last(resourcePrefix.split(".")).toLowerCase(),
            agency: statisticalResourceMatchs[1],
            identifier: statisticalResourceMatchs[2],
            version: statisticalResourceMatchs[3]
        });
    };

}());