(function () {
    "use strict";

    App.namespace('App.components.modal.ExportOptionsModalView');

    App.components.modal.ExportOptionsModalView = Backbone.View.extend({

        template: App.templateManager.get("components/modal/modal-export-options"),

        events: {
            "click .btn-download": "onDownload"
        },

        initialize: function () {
            this.onDownloadCallback = this.options.onDownload || (function() {});
        },

        onDownload: function () {
            var includeAttributes = this.$('.include-attributes').is(':checked');
            var decimalSeparator = this.$('input[name="decimalSeparator"]:checked').val();
            this.onDownloadCallback({
                includeAttributes: includeAttributes,
                decimalSeparator: decimalSeparator
            });
        },

        render: function () {
            this.$el.html(this.template());
        },
    });

}());
