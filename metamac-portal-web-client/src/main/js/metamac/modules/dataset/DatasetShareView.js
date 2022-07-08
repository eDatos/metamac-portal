(function () {
    "use strict";

    App.namespace('App.modules.dataset.DatasetShareView');

    App.modules.dataset.DatasetShareView = Backbone.View.extend({

        template: App.templateManager.get("dataset/dataset-share"),

        initialize: function () {
            this.filterDimensions = this.options.filterDimensions;
            this.permalinkId = this.options.permalinkId;
        },

        getSharedVisualizerParams: function () {
            return [
                'permalink',
                '=',
                this.permalinkId
            ].join('')
        },

        getSharedUrl: function () {
            return [
                this.filterDimensions.metadata.getSharedVisualizerUrl(),
                '?',
                this.getSharedVisualizerParams()
            ].join('');
        },

        render: function () {
            var context = {
                url: this.getSharedUrl(),
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