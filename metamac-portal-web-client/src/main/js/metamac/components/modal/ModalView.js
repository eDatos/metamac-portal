(function () {
    "use strict";

    App.namespace('App.components.modal.ModalView');

    App.components.modal.ModalView = Backbone.Marionette.Layout.extend({

        template: "components/modal/modal",

        initialize: function () {
            this.title = this.options.title;
            this.contentView = this.options.contentView;
            this.titleIconName = this.options.titleIconName;
        },

        regions: {
            content: ".modal-content"
        },

        events: {
            "click .modal-backdrop": "onClickBackdrop",
            "click .modal-close": "onClickClose"
        },

        serializeData: function () {
            var context = {
                title: this.title,
                titleIconName: this.titleIconName
            };
            return context;
        },

        onRender: function () {
            this.content.show(this.contentView);
            this.contentView.$el.addClass('modal-specific-content');
            this.$('.modal-content').perfectScrollbar();
        },

        show: function () {
            this.render();
            if ($(".full-screen").append(this.$el).length == 0) {
                $(".metamac-container").append(this.$el);
            }
        },

        onBeforeClose: function () {
            this.$('.modal-content').perfectScrollbar('destroy');
        },

        onClickBackdrop: function () {
            this.close();
        },

        onClickClose: function () {
            this.close();
        }
    });

}());
