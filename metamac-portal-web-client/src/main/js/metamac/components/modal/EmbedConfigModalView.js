(function () {
    "use strict";

    App.namespace('App.components.modal.EmbedConfigModalView');

    App.components.modal.EmbedConfigModalView = App.components.modal.PermalinkConfigModalView.extend({

        render: function () {
            App.components.modal.EmbedConfigModalView.__super__.render.apply(this, []);

            var titleInputView = new this.TitleView({ title: this.filterDimensions.metadata.getTitle() });
            this.$('#permalink-config-additional-fields').append(titleInputView.el);
        },

        getExtraDataForSubmit: function () {
            return {
                title: this.$("#dataset-embed-title-input")[0].value
            }
        },

        TitleView: Backbone.View.extend({

            template: '<fieldset><label id="dataset-embed-title-label"/><input id="dataset-embed-title-input" type="text"></fieldset>',
            
            initialize: function () {
                this.title = this.options.title;
                this.render();
            },
            
            render: function () {
                this.$el.html(this.template);
                this.$("#dataset-embed-title-input")[0].value = this.title;
                this.$("#dataset-embed-title-label")[0].innerText = I18n.t("modal.embedConfig.label.title");
            }
        })
    })
}());