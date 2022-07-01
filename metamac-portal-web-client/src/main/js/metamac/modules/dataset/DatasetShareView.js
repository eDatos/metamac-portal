(function () {
    "use strict";

    var DatasetPermalink = App.modules.dataset.DatasetPermalink;

    App.namespace('App.modules.dataset.DatasetShareView');

    App.modules.dataset.DatasetShareView = Backbone.View.extend({

        template: App.templateManager.get("dataset/dataset-share"),

        initialize: function () {
            this.filterDimensions = this.options.filterDimensions;
            this.permalink = this.options.permalink;
        },

        render: function () {
            var self = this;
            if (this.permalink) {
                self.renderShare(this.permalink.id);
            } else if (this.needsPermalink()) {
                var savePermalinkRequest = this.savePermalink();
                savePermalinkRequest.then(function (response) {
                    self.renderShare(response.id);
                });
            } else {
                self.renderShare(this.getExistingPermalinkId());
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

        getSharedVisualizerParams: function (permalinkId) {
            return [
                'permalink',
                '=',
                permalinkId
            ].join('')
        },

        getSharedUrl: function (permalinkId) {
            return [
                this.filterDimensions.metadata.getSharedVisualizerUrl(),
                '?',
                this.getSharedVisualizerParams(permalinkId)
            ].join('');
        },

        renderShare: function (permalinkId) {
            var context = {
                url: this.getSharedUrl(permalinkId),
                title: this.filterDimensions.metadata.getTitle(),
                description: this.filterDimensions.metadata.getDescription()
            };
            this.$el.html(this.template(context));

            var config = {
                data_track_addressbar: true
            };

            var share = {
                url: context.url,
                title: context.title,
                description: context.description,
                passthrough: {
                    twitter: {
                        via: 'istac_es',
                        text: context.title
                    }
                }
            };

            addthis.toolbox(".addthis_toolbox", config, share);
        }

    });

}());