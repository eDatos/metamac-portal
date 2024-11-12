(function () {
    "use strict";

    App.namespace('App.modules.dataset.DatasetApiDownloadView');

    App.modules.dataset.DatasetApiDownloadView = Backbone.View.extend({

        template: App.templateManager.get("dataset/dataset-api-download"),

        className: "dataset-api-download",

        initialize: function () {
            this.filterDimensions = this.options.filterDimensions;
            this.optionsModel = this.options.optionsModel;
            this.onClickInfoLink = this.options.onClickInfoLink;
            this.identifierType = this.options.identifierType;
            this.visualizationType = this.optionsModel.get('type');
        },
        events: {
            "click .button-link": "clickInfoLink",
        },

        render: function () {
            var context = {
                url: [
                    {
                        format: 'csv',
                        href: App.Helpers.formatUrl(this._buildEndpoint('csv')),
                        show: this.identifierType === App.Constants.visualization.type.DATASET
                    },
                    {
                        format: 'tsv',
                        href: App.Helpers.formatUrl(this._buildEndpoint('tsv')),
                        show: this.identifierType === App.Constants.visualization.type.DATASET
                    },
                    {
                        format: 'xlsx',
                        href: App.Helpers.formatUrl(this._buildEndpoint('xlsx')),
                        show: this.identifierType === App.Constants.visualization.type.DATASET
                    },
                    {
                        format: 'xml',
                        href: App.Helpers.formatUrl(this._buildEndpoint('xml')),
                        show: this.identifierType === App.Constants.visualization.type.DATASET || this.identifierType === App.Constants.visualization.type.QUERY
                    },
                    {
                        format: 'json',
                        href: App.Helpers.formatUrl(this._buildEndpoint('json')),
                        show: this.identifierType === App.Constants.visualization.type.DATASET || this.identifierType === App.Constants.visualization.type.QUERY
                    },
                    {
                        format: 'jsonstat',
                        href: App.Helpers.formatUrl(this._buildEndpoint('jsonstat')),
                        show: true
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
            
            return '<button class="button-link">"'+ textLink + '"</button>';
        },

        clickInfoLink: function () {
            if (!this.visualizationType) {
                var params = _.clone(this.filterDimensions.metadata.identifier());
                params.visualizationType = 'info';
                App.datasetController.showDatasetVisualization(params);
            } else if (this.visualizationType !== "info") {
                this.optionsModel.set('type', 'info');
            }
            this.onClickInfoLink();
        },
    });

}());
