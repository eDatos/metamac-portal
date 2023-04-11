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
            this.optionsModel = this.options.optionsModel;
            this.visualizationType = this.optionsModel.get('type');
            this.filterDimensions = this.options.filterDimensions;
            this.estimatedNumberOfCells = this.options.estimatedNumberOfCells;
            this.numberOfObservations = this.options.numberOfObservations;
            this.datasetSelection = JSON.stringify(this.getDatasetSelection());
            this.svg = null;
            if (this._exportableImage()) {
                var self = this;
                svgExporter.addStyleAsync(svgExporter.sanitizeSvgElement($(SVG_SELECTOR))).done(function (svg) {
                    self.svg = svg;
                });
            }
            this.urls = {
                excel: this._buildExportEndpoint('excel'),
                px: this._buildExportEndpoint('px'),
                jsonstat: this._getJsonStatUrl(),
                png: App.endpoints["export"] + "/image" + this._getImageExportApiParams('png'),
                pdf: App.endpoints["export"] + "/image" + this._getImageExportApiParams('pdf'),
                svg: App.endpoints["export"] + "/image" + this._getImageExportApiParams('svg')
            };

            this._bindEvents();
        },

        _bindEvents: function () {
            this.listenTo(this.optionsModel, "change:isDownloading", this.render);

            this.delegateEvents();
        },

        render: function () {
            var context = {
                buttonConfig: this._getButtonConfiguration(),
                hasJsonstatUrl: !!this.urls.jsonstat
            };

            this.$el.html(this.template(context));
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
            var disableAnyFormat = this.optionsModel.get('isDownloading');
            var disableAllExcel = this.disableExcelDownload(this.estimatedNumberOfCells.all, this.numberOfObservations.all.total, this.numberOfObservations.all.tableSize);
            var disableSelectionExcel = this.disableExcelDownload(this.estimatedNumberOfCells.selection, this.numberOfObservations.selection.total, this.numberOfObservations.selection.tableSize);

            return {
                dataFormats: haveDataFormats,
                allDimensionsWithSelections: allDimensionsWithSelections,
                mapFormats: haveMapFormats,
                imageFormats: haveImageFormats,
                iconPreffix: visualizationSupertype,
                disableFormat: {
                    all: {
                        excel: disableAnyFormat || disableAllExcel,
                        tsv: disableAnyFormat,
                        csv: disableAnyFormat,
                        jsonstat: disableAnyFormat,
                        infoMessage: disableAllExcel ? I18n.t("filter.download.excel.disabled") : null
                    },
                    selection: {
                        excel: disableAnyFormat || disableSelectionExcel,
                        tsv: disableAnyFormat,
                        csv: disableAnyFormat,
                        png: disableAnyFormat,
                        pdf: disableAnyFormat,
                        svg: disableAnyFormat,
                        infoMessage: disableSelectionExcel ? I18n.t("filter.download.excel.disabled") : null
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
            if ($currentTarget.hasClass('disabled')) {
                return;
            }

            var jsonBody = $currentTarget.hasClass('selection') ? this.datasetSelection : JSON.stringify(this.getEmptyDatasetSelection());
            if ($currentTarget.hasClass('download-xlsx')) {
                this.downloadFile('POST', this.urls.excel, { jsonBody: jsonBody }, ".xslx");
            } else if ($currentTarget.hasClass('download-tsv')) {
                var self = this;
                this._showExportTsvAttributesConfig(function (url, fileExtension) {
                    self.downloadFile('POST', url, { jsonBody: jsonBody }, fileExtension);
                });
            } else if ($currentTarget.hasClass('download-csv')) {
                this.downloadFile('POST', this.urls.px, { jsonBody: jsonBody }, ".px");
            } else if ($currentTarget.hasClass('download-png')) {
                this.downloadFile('POST', this.urls.png, { svg: this.svg }, ".png");
            } else if ($currentTarget.hasClass('download-pdf')) {
                this.downloadFile('POST', this.urls.pdf, { svg: this.svg }, ".pdf");
            } else if ($currentTarget.hasClass('download-svg')) {
                this.downloadFile('POST', this.urls.svg, { svg: this.svg }, ".svg");
            } else if ($currentTarget.hasClass('download-jsonstat')) {
                this.downloadFile('GET', this.urls.jsonstat, null, ".jsonstat");
            }
        },

        downloadFile: function (requestMethod, url, requestParams, fileExtension) {
            this.optionsModel.set('isDownloading', true);

            var xhr = new XMLHttpRequest();
            xhr.open(requestMethod, url, true);
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhr.responseType = 'arraybuffer';

            var self = this;
            xhr.onload = function () {
                if (this.status === 200) {
                    var blob = new Blob([this.response], { type: xhr.getResponseHeader('Content-Type') });
                    var filename = self._getFilenameFromContentDisposition(xhr);
                    if (!filename) {
                        filename = self._getFilenameFromIdentifier(fileExtension);
                    }
                    self._downloadFileInBrowserFromBlob(blob, filename);
                }
                self.optionsModel.set('isDownloading', false);
            };
            xhr.send(new URLSearchParams(requestParams));
        },

        _getFilenameFromContentDisposition: function (xhr) {
            var disposition = xhr.getResponseHeader('Content-Disposition'); // TODO requiere aplicar cambios aquí: https://chat.arte.dev/group/edatos-soporte/thread/ZxbzPGN7WmdLHqKxw
            if (disposition && disposition.indexOf('attachment') !== -1) {
                var filenameRegex = /filename[^\w;=\n]*=((['"]).*?\2|[^;\n]*)/;
                var filenameMatches = filenameRegex.exec(disposition);
                if (filenameMatches != null && filenameMatches[1]) { return filenameMatches[1].replace(/['"]/g, ''); }
            }
            return "";
        },

        _getFilenameFromIdentifier: function (fileExtension) {
            var identifier = this.filterDimensions.metadata.identifier();
            return [identifier.type, identifier.agency, identifier.identifier, identifier.version].join("-").replace(".", "_") + fileExtension;
        },

        _downloadFileInBrowserFromBlob: function (blob, filename) {
            var downloadUrl = window.URL.createObjectURL(blob);

            var a = document.createElement("a");
            if (typeof a.download === 'undefined') {
                window.location = downloadUrl;
            } else {
                a.href = downloadUrl;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
            }

            setTimeout(function () {
                window.URL.revokeObjectURL(downloadUrl);
            }, 150);
        },

        _showExportTsvAttributesConfig: function (callback) {
            var self = this;
            var modalContentView = new App.components.modal.ConfirmationModalView({
                question: I18n.t("filter.download.attributes.modal.question"),
                onConfirm: function() {
                    callback(self._buildExportEndpoint('tsv'), ".zip");
                    self.modal.close();
                },
                onReject: function() {
                    callback(self._buildExportEndpoint('tsv', { fields: '-attributes' }, ".tsv"));
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
        }
    });

}());