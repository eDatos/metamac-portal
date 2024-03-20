(function () {
    "use strict";

    App.namespace('App.modules.dataset.DatasetApiDownloadView');

    App.modules.dataset.DatasetApiDownloadView = Backbone.View.extend({

        template: App.templateManager.get("dataset/dataset-api-download"),

        className: "dataset-api-download",

        initialize: function () {
            this.filterDimensions = this.options.filterDimensions;
        },

        render: function () {
            var context = {
                url: [
                    {
                        format: 'csv',
                        href: this._buildEndpoint('csv')
                    },
                    {
                        format: 'tsv',
                        href: this._buildEndpoint('tsv')
                    },
                    {
                        format: 'xlsx',
                        href: this._buildEndpoint('xlsx')
                    },
                    {
                        format: 'xml',
                        href: this._buildEndpoint('xml')
                    },
                    {
                        format: 'json',
                        href: this._buildEndpoint('json')
                    },
                    {
                        format: 'jsonstat',
                        href: this._buildEndpoint('jsonstat')
                    }
                ]
            };

            var infoMessage = I18n.t("filter.apiDownload.modal.info", { hrefTag: this._getHrefTag() });
            this.$el.html(this.template(context));
            $('.dataset-api-download-info', this.$el).append(infoMessage);
        },

        _buildEndpoint: function(type) {
            return this.filterDimensions.metadata.getApiUrl().href + "." + type;
            
        },

        _getHrefTag: function() {
            var textLink = I18n.t("entity.dataset.section.reuse");
            var href = this.filterDimensions.metadata.getVisualizerUrlForWidget() + '#visualization/info';
            return '<a href="' + href + '">"' + textLink + '"</a>';
        }
    });

}());