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
            /*var infoUrl= this.filterDimensions.metadata.getVisualizerUrlForWidget() + '#visualization/info';*/
            var message =  I18n.t("filter.apiDownload.modal.info");
            var final = message.replace(I18n.t("entity.dataset.section.reuse"), '<a href="#">rrr</a>');
            console.log('mesaage', final);

            var context = {
                infoMessage: final,
                /*infoUrl: this.filterDimensions.metadata.getVisualizerUrlForWidget() + '#visualization/info',*/
                /*this.filterDimensions.metadata.buildInfoVisulizerUrl(this.filterDimensions.metadata.datasourceIdentifier.identifier),*/
                infoUrl: {
                    href: this.filterDimensions.metadata.getVisualizerUrlForWidget() + '#visualization/info',
                    name:  I18n.t("filter.apiDownload.modal.info")
                },
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
           
            console.log('1',context.infoUrl.href, context.infoMessage);
            this.$el.html(this.template(context));
        },

        _buildEndpoint: function(type) {
            console.log('this.filterDimensions.metadata', this.filterDimensions.metadata);
            var endPoint = this.filterDimensions.metadata.getApiUrl().href + "." + type;
            
            return endPoint;
        }
    });

}());