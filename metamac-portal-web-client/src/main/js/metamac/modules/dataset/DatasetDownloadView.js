(function () {
    "use strict";

    App.namespace('App.modules.dataset.DatasetDownloadView');

    var svgExporter = new App.svg.Exporter();

    App.modules.dataset.DatasetDownloadView = Backbone.View.extend({

        template: App.templateManager.get("dataset/dataset-download"),

        className: "dataset-download",

        events: {
            "click a": "clickDownloadButton"
        },

        initialize: function () {
            this.filterDimensions = this.options.filterDimensions;
            this.visualizationType = this.options.visualizationType;
        },

        render: function () {
            var datasetSelection = this.getDatasetSelection();

            var context = {
                selection: JSON.stringify(datasetSelection),
                emptySelection: JSON.stringify(this.getEmptyDatasetSelection()),
                url: {
                    tsv: this._buildExportEndpoint('tsv'),
                    excel: this._buildExportEndpoint('excel'),
                    px: this._buildExportEndpoint('px')
                },
                buttonConfig: this._getButtonConfiguration()
            };

            if (this._exportableImage()) {
                var self = this;
                svgExporter.addStyleAsync(svgExporter.sanitizeSvgElement($('svg'))).done(function (svg) {
                    var svgContext = {
                        svg: svg,
                        url: {
                            png: App.endpoints["export"] + "/image" + self._getImageExportApiParams('png'),
                            pdf: App.endpoints["export"] + "/image" + self._getImageExportApiParams('pdf'),
                            svg: App.endpoints["export"] + "/image" + self._getImageExportApiParams('svg')
                        }
                    };
                    _.extend(context, svgContext);
                    self.$el.html(self.template(context));
                    self._setupTsvExportAttributes();
                });
            } else {
                this.$el.html(this.template(context));
                this._setupTsvExportAttributes();
            }
        },

        _exportableImage: function () {
            return $('svg').exists();
        },

        _getButtonConfiguration: function () {
            var visualizationSupertype = '';
            switch (this.visualizationType) {
                case '': // On selection mode
                case 'info':
                case 'table':
                    visualizationSupertype = 'data';
                    break;
                case 'map':
                case 'mapbubble':
                    visualizationSupertype = 'map';
                    break;
                default:
                    visualizationSupertype = 'graph';
                    break;
            }

            var haveDataFormats = visualizationSupertype == 'data';
            var haveMapFormats = visualizationSupertype == 'map' && false; // TODO: METAMAC-2033
            var haveImageFormats = _.contains(['graph', 'map'], visualizationSupertype) && this._exportableImage();
            var allDimensionsWithSelections = this.filterDimensions.getDimensionsWithoutSelections().length == 0;

            return {
                dataFormats: haveDataFormats,
                allDimensionsWithSelections: allDimensionsWithSelections,
                mapFormats: haveMapFormats,
                imageFormats: haveImageFormats,
                iconPreffix: visualizationSupertype
            };
        },

        _getImageExportApiParams: function (type) {
            var identifier = this.filterDimensions.metadata.identifier();
            var filename = "chart" + "-" + identifier.agency + "-" + identifier.identifier + "-" + identifier.version; // IDEA Add visualization type to the name

            var mime = svgExporter.mimeTypeFromType(type);
            var params = '?';
            params += 'filename=' + encodeURIComponent(filename);
            params += '&type=' + encodeURIComponent(mime);
            params += '&width=' + $('svg').width();
            params += '&scale=2';

            return params;
        },

        getDatasetSelection: function () {
            var result = {
                dimensions: {
                    dimension: []
                }
            };
            var selection = this.filterDimensions.exportJSONSelection();

            var self = this;
            _.each(selection, function (dimension, dimensionId) {
                result.dimensions.dimension.push({
                    dimensionId: dimensionId,
                    labelVisualisationMode: dimension.visibleLabelType,
                    position: dimension.position,
                    dimensionValues: {
                        dimensionValue: self.getSelectedDimensionCategoriesIds(dimension.categories)
                    }
                })
            });
            
            // Remember to propagate changes made here to org.siemac.metamac.rest.export.v1_0.domain.DatasetSelection
            return { datasetSelection: result };
        },

        getSelectedDimensionCategoriesIds: function (categories) {
            var selectedCategoriesIds = []; 
            _.each(categories, function(category) {
                if (category.selected) {
                    selectedCategoriesIds.push(category.id);
                }
            });
            return selectedCategoriesIds;
        },

        // Empty selection returns all
        getEmptyDatasetSelection: function () {
            return { datasetSelection: null };
        },

        clickDownloadButton: function (e) {
            e.preventDefault();
            var $currentTarget = $(e.currentTarget);

            if (this._isChromeFrameWidget()) {
                this._openPopupDownloadForm($currentTarget.parent("form"));
            } else {
                $currentTarget.parent("form").submit();
            }
        },

        _openPopupDownloadForm: function (form) {
            var form = form.clone();
            form.append('<input type="submit" value="' + 'Descargar' + '">');
            var formHTML = form[0].outerHTML;

            var popupProperties = "";
            popupProperties += 'width=' + 200 + ',';
            popupProperties += 'height=' + 100 + ',';
            popupProperties += 'left=' + 100 + ',';
            popupProperties += 'top=' + 100;

            var popup = window.open('', '', popupProperties);
            popup.document.write(formHTML);
            popup.focus();
        },

        _isChromeFrameWidget: function () {
            return App.config["chromeFrameObject"];
            // I haven´t found a way to properly detect the difference between a embedded chromeFrame object and chromeFrame triggered from parent, so passed as variable when embedded object
            //return App.config["widget"] && !!window.externalHost;
        },

        _setupTsvExportAttributes: function() {
            var self = this;
            this.$el.find('.download-tsv').closest('form').submit(function(e) {
                e.preventDefault();    
                self._showExportTsvAttributesConfig(this);
            });
        },

        _showExportTsvAttributesConfig: function (form) {
            var self = this;
            var modalContentView = new App.components.modal.ConfirmationModalView({
                question: I18n.t("filter.download.attributes.modal.question"),
                onConfirm: function() { 
                    form.action = self._buildExportEndpoint('tsv');
                    form.submit(); 
                    self.modal.close();
                },
                onReject: function() { 
                    form.action = self._buildExportEndpoint('tsv', {fields: '-attributes'});                  
                    form.submit(); 
                    self.modal.close();
                }
            });
            var title = I18n.t("filter.download.attributes.modal.title");
            this.modal = new App.components.modal.ModalView({ title: title, contentView: modalContentView });
            this.modal.show();
        },

        _buildExportEndpoint: function(type, attributes) {
            var exportEndpoint = new URL(App.endpoints["export"] + "/" + type + this.filterDimensions.metadata.urlIdentifierPart());
            _.each(attributes, function(value,key) { 
                exportEndpoint.searchParams.append(key, value);
            });
            return exportEndpoint;
        }
    });

}());