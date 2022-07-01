(function () {
    "use strict";

    var DatasetPermalink = App.modules.dataset.DatasetPermalink;

    App.namespace('App.modules.dataset.DatasetEmbedView');

    App.modules.dataset.DatasetEmbedView = Backbone.View.extend({

        template: App.templateManager.get("dataset/dataset-embed"),

        initialize: function () {
            this.filterDimensions = this.options.filterDimensions;
            this.permalink = this.options.permalink;
        },

        render: function () {
            var self = this;
            if (this.permalink) {
                self.renderEmbed(this.permalink.id);
            } else if (this.needsPermalink()) {
                var savePermalinkRequest = this.savePermalink();
                savePermalinkRequest.then(function (response) {
                    self.renderEmbed(response.id);
                });
            } else {
                self.renderEmbed(this.getExistingPermalinkId());
            }
        },

        needsPermalink: function () {
            return !(App.config.widget && this.getExistingPermalinkId());
        },

        getExistingPermalinkId: function () {
            return this.filterDimensions.metadata.identifier().permalinkId;
        },

        savePermalink: function () {
            var permalinkContent = DatasetPermalink.buildPermalinkContent(this.filterDimensions);
            return DatasetPermalink.savePermalink(permalinkContent, this.$el[0]);
        },

        getWidgetUrl: function () {
            return App.endpoints["statistical-visualizer"] + '/js/widget.js';
        },

        getSharedVisualizerParams: function (permalinkId) {
            return [
                'permalink',
                '=',
                permalinkId
            ].join('')
        },

        renderEmbed: function (permalinkId) {
            var context = {
                widgetUrl: this.getWidgetUrl(),
                params: this.getSharedVisualizerParams(permalinkId),
                sharedVisualizerUrl: this.filterDimensions.metadata.getSharedVisualizerUrl(),
                locale: I18n.locale,
                defaultId: 'dataset-widget',
                defaultWidth: 500,
                defaultHeight: 400,
                title: this.filterDimensions.metadata.getTitle(),
                description: this.filterDimensions.metadata.getDescription()
            };
            this.$el.html(this.template(context));
        }

    });

}());