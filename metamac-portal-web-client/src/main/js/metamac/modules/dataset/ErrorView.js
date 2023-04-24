(function () {
    "use strict";

    App.namespace("App.modules.dataset.ErrorView");

    App.modules.dataset.ErrorView = Backbone.View.extend({

        initialize: function (options) {
            this.errorsJson = JSON.parse(options.errors);
        },
        
        render: function () {
            this.$el.html('<div style="backgroundColor: Constants.colors.istacWhite"> <h1>' + this.errorsJson.code + '</h1>'+
            '<h2>' + this.errorsJson.message + '</h2>' +
            '</div>');
            return this;
        },

    });


}());