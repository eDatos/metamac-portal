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
                infoMessage: I18n.t("filter.apiDownload.modal.info") ,
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

            this.$el.html(this.template(context));
        },

        _buildEndpoint: function(type) {
            var endPoint = this.filterDimensions.metadata.getApiUrl().href + "." + type;
            
            return endPoint;
        }
    });

}());