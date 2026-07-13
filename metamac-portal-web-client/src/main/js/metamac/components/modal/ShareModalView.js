(function () {
    "use strict";

    App.namespace('App.components.modal.ShareModalView');

    App.components.modal.ShareModalView = Backbone.View.extend({

        template: App.templateManager.get("components/modal/modal-share"),
        className: 'modal-share',

        initialize: function () {
            this.filterDimensions = this.options.filterDimensions;
            this.permalinkId = this.options.permalinkId;
        },

        getSharedVisualizerParams: function () {
            return [
                'permalink',
                '=',
                this.permalinkId
            ].join('');
        },

        getSharedUrl: function () {
            return [
                this.filterDimensions.metadata.getSharedVisualizerUrl(),
                '?',
                this.getSharedVisualizerParams()
            ].join('');
        },

        render: function () {
            // INFO sharing won't work on localhost URLs on some networks
            var title = this.filterDimensions.metadata.getTitle();
            var description = this.filterDimensions.metadata.getDescription();
            var url = this.getSharedUrl();

            var context = {
                url: url,
                title: title,
                description: description,
                twitterVia: App.config.socialTwitterVia,
                shareMeInDiigo: this.buildDiigoShareUrl(url, title, description),
                shareMeInMeneame: this.buildMeneameShareUrl(url)
            };
            this.$el.html(this.template(context));

            // A setTimeout is needed here to work. Looks like
            setTimeout(function() { Shareon.init(); });
        },

        buildDiigoShareUrl: function(url, title, desc) {
            // Thanks to: https://www.addtoany.com/services/diigo_button
            return 'https://www.diigo.com/post?url=' + encodeURIComponent(url) + '&title=' + encodeURIComponent(title) + '&desc=' + encodeURIComponent(desc);
        },

        buildMeneameShareUrl: function(url) {
            // Thanks to: https://www.addtoany.com/services/meneame_button
            return 'https://old.meneame.net/submit?url=' + encodeURIComponent(url);
        }

    });

}());
