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
                        href: this._buildEndpoint('csv'),
                        show: this.identifierType === App.Constants.visualization.type.DATASET
                    },
                    {
                        format: 'tsv',
                        href: this._buildEndpoint('tsv'),
                        show: this.identifierType === App.Constants.visualization.type.DATASET
                    },
                    {
                        format: 'xlsx',
                        href: this._buildEndpoint('xlsx'),
                        show: this.identifierType === App.Constants.visualization.type.DATASET
                    },
                    {
                        format: 'xml',
                        href: this._buildEndpoint('xml'),
                        show: this.identifierType === App.Constants.visualization.type.DATASET || this.identifierType === App.Constants.visualization.type.QUERY
                    },
                    {
                        format: 'json',
                        href: this._buildEndpoint('json'),
                        show: this.identifierType === App.Constants.visualization.type.DATASET || this.identifierType === App.Constants.visualization.type.QUERY
                    },
                    {
                        format: 'jsonstat',
                        href: this._buildEndpoint('jsonstat'),
                        show: true
                    }
                ]
            };

            var infoMessage = I18n.t("filter.apiDownload.modal.info", { hrefTag: this._getHrefTag() });
            this.$el.html(this.template(context));
            $('.dataset-api-download-info', this.$el).append(infoMessage);
            this.formatUrl();
        },

        formatUrl: function() {
            var urls = $('.url', this.$el);
            $.each(urls, function( k, url ) {
                var doubleSlash = url.innerHTML.split('//');
                // Format the strings on either side of double slashes separately
                var formatted = doubleSlash.map(str =>
                  // Insert a word break opportunity after a colon
                  str.replace(/(?<after>:)/giu, '$1<wbr>')
                    // Before a single slash, tilde, period, comma, hyphen, underline, question mark, number sign, or percent symbol
                    .replace(/(?<before>[/~.,\-_?#%])/giu, '<wbr>$1')
                    // Before and after an equals sign or ampersand
                    .replace(/(?<beforeAndAfter>[=&])/giu, '<wbr>$1<wbr>')
                  // Reconnect the strings with word break opportunities after double slashes
                  ).join('//<wbr>');
                return (url.innerHTML = `${formatted}<br>`);
            });
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
