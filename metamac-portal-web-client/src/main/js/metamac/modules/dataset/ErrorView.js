(function () {
    "use strict";

    App.namespace("App.modules.dataset.ErrorView");

    App.modules.dataset.ErrorView = Backbone.View.extend({
        template: App.templateManager.get('dataset/dataset-error'),

        initialize: function (options) {
            this.error = options.error;
        },
        
        render: function () {
            var context = {
                errorText: this.error 
            }
            this.$el.html(this.template(context));
            return this;
        },

    });


}());