(function () {
    "use strict";

    App.namespace("App.modules.dataset.ErrorView");

    App.modules.dataset.ErrorView = Backbone.View.extend({
        template: App.templateManager.get('dataset/dataset-error'),

        initialize: function (options) {
            this.errorsJson = JSON.parse(options.errors);
            if (this.errorsJson.code === 'exception.resources.dataset.empty_data') {
                this.emptyError = this.errorsJson.code;
            } else {
                this.generalError = this.errorsJson.code;
            }
        },
        
        render: function () {
            var context = {
                emptyError: this.emptyError,
                generalError: this.generalError
            }
            this.$el.html(this.template(context));
            return this;
        },

    });


}());