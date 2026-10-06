(function () {
    "use strict";

    App.namespace('App.components.modal.ConfirmationModalView');

    App.components.modal.ConfirmationModalView = Backbone.View.extend({

        template: App.templateManager.get("components/modal/modal-confirmation"),
        className: 'modal-confirmation',

        events: {
            "click .button-confirm": "confirm",
            "click .button-reject": "reject"
        },

        initialize: function () {
            this.question = this.options.question;
            this.onConfirm = this.options.onConfirm || (function() {});
            this.onReject = this.options.onReject || (function() {});
        },

        confirm: function(e) {
            e.stopPropagation();
            this.onConfirm(this);
        },

        reject: function(e) {
            e.stopPropagation();
            this.onReject(this);
        },

        disableButtons: function () {
            this.$(".button-confirm, .button-reject").prop("disabled", true);
        },

        render: function () {
            var context = {
                question: this.question
            };
            this.$el.html(this.template(context));
        },
    });

}());
