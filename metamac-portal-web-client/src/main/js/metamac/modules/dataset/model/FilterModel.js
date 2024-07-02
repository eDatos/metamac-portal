(function () {
    "use strict";

    App.namespace('App.modules.dataset.model');

    App.modules.dataset.model.FilterModel = Backbone.Model.extend({

        initialize: function (attributes) {
            this.resourceName = attributes.resourceName;
            this.name = attributes.name;
            this.notes = attributes.notes;
            this.permalink = attributes.permalink;
            this.externalOperationCode = attributes.externalOperationCode;
            this.userId = attributes.userId;
        },

        toString: function () {
            return JSON.stringify({
                id: null,
                name: this.name,
                resourceName: this.resourceName,
                externalUser: { id: this.userId },
                permalink: this.permalink,
                externalOperationCode: this.externalOperationCode,
                notes: this.notes
            })
        }
    });

}());
