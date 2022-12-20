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

}());