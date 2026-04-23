(function () {
    "use strict";

    var UserUtils = App.modules.user.UserUtils;

    App.namespace('App.components.modal.SaveModalView');

    App.components.modal.SaveModalView = Backbone.View.extend({

        template: App.templateManager.get("components/modal/modal-save"),
        templateResult: App.templateManager.get("components/modal/modal-message"),

        tagName: 'form',
        className: 'modal-save',
        attributes: { novalidate: '' },

        events: {
            "submit": "onSubmit"
        },

        initialize: function () {
            this.filterDimensions = this.options.filterDimensions;
            this.user = this.options.user;
            this.permalinkId = this.options.permalinkId;
        },

        onSubmit: function(e) {
            e.preventDefault();
            var filter = new App.modules.dataset.model.FilterModel({
                resourceName: this.getResourceTitle(),
                name: this.$("#name").val() || null,
                notes: this.$("#notes").val(),
                permalink: this.permalinkId,
                externalOperationCode: this.getExternalOperationCode(),
                userId: this.user.id
            });
            var self = this;
            UserUtils.saveFilter(filter).then(function () {
                self.renderResult(true);
            }).catch(function () {
                self.renderResult(false);
            });
        },

        render: function () {
            this.$el.html(this.template({
                defaultCustomQueryName: this.getResourceTitle()
            }));
        },

        renderResult: function (succeeded) {
            this.$el.html(this.templateResult({
                messageContent: I18n.t(succeeded ? "filter.save.modal.success" : "filter.save.modal.failure")
            }));
        },

        getResourceTitle: function () {
            return this.filterDimensions.metadata.getTitle() || App.datasource.helper.ApiIndicatorResponseToApiResponse.getTranslatedString(this.filterDimensions.metadata.metadataResponse.name);
        },

        getExternalOperationCode: function () {
            var metadata = this.filterDimensions.metadata;
            var identifier = metadata.datasourceIdentifier.getIdentifier();
            switch (identifier.type) {
                case "dataset":
                case "query":
                case "multidataset":
                    return metadata.metadata.statisticalOperation.id;
                case "indicatorInstance":
                    return identifier.indicatorSystem;
                case "indicator":
                default:
                    return null;
            }
        }
    });

}());
