(function () {
    "use strict";

    App.namespace('App.modules.dataset.DatasetDownloadView');

    var svgExporter = new App.svg.Exporter();
    var SVG_SELECTOR = '.dataset-visualization-visual-element svg';

    App.modules.dataset.DatasetDownloadView = Backbone.View.extend({

        template: App.templateManager.get("dataset/dataset-download"),

        className: "dataset-download",

        events: {
            "click a": "clickDownloadButton"
        },

        initialize: function () {
            this.filterDimensions = this.options.filterDimensions;
            this.visualizationType = this.options.visualizationType;
            this.estimatedNumberOfCells = this.options.estimatedNumberOfCells;
            this.numberOfObservations = this.options.numberOfObservations;
        },

        render: function () {
            var datasetSelection = this.getDatasetSelection();
            const selection = this._getSelection(datasetSelection)
            const jsonStatUrl = this._getJsonStatUrl();

            var context = {
                selection: JSON.stringify(datasetSelection),
                emptySelection: JSON.stringify(this.getEmptyDatasetSelection()),
                url: {
                    tsv: this._buildExportEndpoint('tsv'),
                    excel: this._buildExportEndpoint('excel'),
                    px: this._buildExportEndpoint('px'),
                    jsonstat: {
                        href: jsonStatUrl.toString(),
                        searchParams: [...jsonStatUrl.searchParams.entries()],
                        selection
                    }
                },
                buttonConfig: this._getButtonConfiguration()
            };

            if (this._exportableImage()) {
                var self = this;
                svgExporter.addStyleAsync(svgExporter.sanitizeSvgElement($(SVG_SELECTOR))).done(function (svg) {
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

        _getVisualizationType: function () {
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
            return visualizationSupertype;
        },

        _hasExportableImage: function (visualizationSupertype) {
            return _.contains(['graph', 'map'], visualizationSupertype) && $(SVG_SELECTOR).exists();
        },

        _exportableImage: function () {
            var visualizationSupertype = this._getVisualizationType();
            return this._hasExportableImage(visualizationSupertype);
        },

        _getButtonConfiguration: function () {
            var visualizationSupertype = this._getVisualizationType();
            var haveDataFormats = visualizationSupertype == 'data';
            var haveMapFormats = visualizationSupertype == 'map' && false; // TODO: METAMAC-2033
            var haveImageFormats = this._hasExportableImage(visualizationSupertype);
            var allDimensionsWithSelections = this.filterDimensions.getDimensionsWithoutSelections().length == 0;

            return {
                dataFormats: haveDataFormats,
                allDimensionsWithSelections: allDimensionsWithSelections,
                mapFormats: haveMapFormats,
                imageFormats: haveImageFormats,
                iconPreffix: visualizationSupertype,
                disableFormat: {
                    all: {
                        excel: this.disableExcelDownload(this.estimatedNumberOfCells.all, this.numberOfObservations.all.total, this.numberOfObservations.all.tableSize)
                    },
                    selection: {
                        excel: this.disableExcelDownload(this.estimatedNumberOfCells.selection, this.numberOfObservations.selection.total, this.numberOfObservations.selection.tableSize)
                    }
                },
            };
        },

        // This is based on org.siemac.metamac.portal.core.exporters.ExcelExporter.enableHighPerformanceModeIfNeeded()
        // We need to take into account both download all, and download selection
        // In the export api, it only read the response from the external apis to guess the estimatedNumberOfCells. That's because
        // that response is already filtered (or not) by the selection
        // The quid is that highPerformanceMode breaks because it reorders the data to be only rows and that breaks the export
        // See more at EDATOS-4008
        disableExcelDownload: function(estimatedNumberOfCells, totalNumberOfObservations, tableSize) {
            var rows = tableSize.rows;
            var columns = tableSize.columns;

            // org.apache.poi.ss.SpreadsheetVersion.getLastRowIndex()
            var MAX_EXCEL_ROWS = 2**20; // ~ 1 million
            var MAX_EXCEL_COLUMNS = 2**14; // ~ 16K
            
            if (rows > MAX_EXCEL_ROWS) { return true; }
            if (columns > MAX_EXCEL_COLUMNS) { return true; }
            
            var highPerformanceMode = estimatedNumberOfCells > App.config.cellThreshold;
            if (highPerformanceMode && totalNumberOfObservations > MAX_EXCEL_ROWS) { return true; }

            return false;
        },

        _getImageExportApiParams: function (type) {
            var identifier = this.filterDimensions.metadata.identifier();
            var filename = "chart" + "-" + identifier.agency + "-" + identifier.identifier + "-" + identifier.version; // IDEA Add visualization type to the name

            var mime = svgExporter.mimeTypeFromType(type);
            var params = '?';
            params += 'filename=' + encodeURIComponent(filename);
            params += '&type=' + encodeURIComponent(mime);
            params += '&width=' + $(SVG_SELECTOR).width();
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
            if (!$currentTarget.hasClass('disabled')) {
                $currentTarget.parent("form").submit();
            }
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
                    form.action = self._buildExportEndpoint('tsv', { fields: '-attributes' });                  
                    form.submit(); 
                    self.modal.close();
                }
            });
            var title = I18n.t("filter.download.attributes.modal.title");
            this.modal = new App.components.modal.ModalView({ title: title, contentView: modalContentView });
            this.modal.show();
        },

        _buildExportEndpoint: function(type, additionalParams) {
            var exportEndpoint = new URL(App.endpoints["export"] + "/" + type + this.filterDimensions.metadata.urlIdentifierPart());
            additionalParams = _.extend({}, additionalParams, { lang: I18n.locale });
            _.each(additionalParams, function(value,key) { 
                exportEndpoint.searchParams.append(key, value);
            });
            return exportEndpoint;
        },

        _getSelection: function (datasetSelection) {
            const representations = [];
            for (const dimension of datasetSelection.datasetSelection.dimensions.dimension) {
                representations.push(dimension.dimensionId + "[" + dimension.dimensionValues.dimensionValue.join("|") + "]")
            }
            return ["representation", representations.join(":")];
        },

        _getJsonStatUrl() {
            var link = this.filterDimensions.metadata.datasourceIdentifier.identifier.selfLink;

            var jsonStatUrl;
            if (link.hasOwnProperty("href")) {
                jsonStatUrl = new URL(link.href + ".jsonstat");
            } else if (typeof link === 'string') {
                jsonStatUrl = new URL(link + ".jsonstat");
            } else {
                return null;
            }

            var locale = I18n.locale;
            jsonStatUrl.searchParams.append('lang', locale);

            return jsonStatUrl;
        },
    });

}());