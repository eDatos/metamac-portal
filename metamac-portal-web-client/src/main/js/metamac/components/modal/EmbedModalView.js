(function () {
    "use strict";

    App.namespace('App.components.modal.EmbedModalView');

    App.components.modal.EmbedModalView = Backbone.View.extend({

        template: App.templateManager.get("components/modal/modal-embed"),
        className: 'modal-embed',

        initialize: function () {
            this.filterDimensions = this.options.filterDimensions;
            this.permalinkId = this.options.permalinkId;
            this.title = this.options.title;
        },

        getWidgetUrl: function () {
            return App.endpoints["statistical-visualizer"] + '/js/widget.js';
        },

        getSharedVisualizerParams: function () {
            return [
                'permalink',
                '=',
                this.permalinkId
            ].join('');
        },

        render: function () {
            var context = {
                widgetUrl: this.getWidgetUrl(),
                params: this.getSharedVisualizerParams(),
                sharedVisualizerUrl: this.filterDimensions.metadata.getSharedVisualizerUrl(),
                locale: I18n.locale,
                defaultId: 'dataset-widget',
                defaultWidth: 500,
                defaultHeight: 400,
                title: this.title || this.filterDimensions.metadata.getTitle(),
                description: this.filterDimensions.metadata.getDescription()
            };
            this.$el.html(this.template(context));
        }

    });

}());
