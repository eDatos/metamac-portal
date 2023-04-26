(function () {
    "use strict";

    App.namespace("App.modules.dataset.ErrorView");

    App.modules.dataset.ErrorView = Backbone.View.extend({
        template: App.templateManager.get('dataset/dataset-error'),

        initialize: function (options) {
            this.errorsJson = JSON.parse(options.errors);
            this.emptyError = I18n.t(this.errorsJson.code);
        },
        
        render: function () {
            var context = {
                emptyError: this.emptyError 
            }
            this.$el.html(this.template(context));
            return this;
        },

    });


}());