(function () {
    "use strict";

    App.namespace('App.modules.dataset.DatasetDownloadView');

    var svgExporter = new App.svg.Exporter();
    var SVG_SELECTOR = '.dataset-visualization-visual-element svg';

    App.modules.dataset.DatasetDownloadView = Backbone.View.extend({

        template: App.templateManager.get("dataset/dataset-download"),

        className: "dataset-download",

        events: {
            "click a.download-xlsx": function(event) { this.clickDownloadButton(event, 'xlsx'); },
            "click a.download-tsv": function(event) { this.clickDownloadButton(event, 'tsv'); },
            "click a.download-csv": function(event) { this.clickDownloadButton(event, 'px'); },
            "click a.download-png": function(event) { this.clickDownloadButton(event, 'png'); },
            "click a.download-pdf": function(event) { this.clickDownloadButton(event, 'pdf'); },
            "click a.download-svg": function(event) { this.clickDownloadButton(event, 'svg'); },
            "click a.download-jsonstat": function(event) { this.clickDownloadButton(event, 'jsonstat'); },
        },

        initialize: function () {
            this.optionsModel = this.options.optionsModel;
            var self = this;
            this.pageshowListener = function () {
                self.optionsModel.set('isDownloading', false);
            };
            window.addEventListener("pageshow", this.pageshowListener);

            this.visualizationType = this.optionsModel.get('type');
            this.filterDimensions = this.options.filterDimensions;
            this.estimatedNumberOfCells = this.options.estimatedNumberOfCells;
            this.numberOfObservations = this.options.numberOfObservations;

            var datasetSelectionObject = this.getDatasetSelection();
            this.datasetSelection = JSON.stringify(datasetSelectionObject);
            this.jsonstatSelection = this._getSelection(datasetSelectionObject);

            this.svg = null;
            this.urls = {
                xlsx: this._buildExportEndpoint('excel'),
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
            const selection = this._getSelection(this.getDatasetSelection());
            var jsonStatUrl = this._getJsonStatUrl();

            var context = {
                buttonConfig: this._getButtonConfiguration(),
                hasJsonstatUrl: !!this.urls.jsonstat,
                url: {
                    jsonstat: {
                        href: jsonStatUrl.toString(),
                        searchParams: [...jsonStatUrl.searchParams.entries()],
                        selection
                    }
                }
            };

            if (this._exportableImage()) {
                var self = this;
                svgExporter.addStyleAsync(svgExporter.sanitizeSvgElement($(SVG_SELECTOR))).done(function (svg) {
                    self.svg = svg;
                    self.$el.html(self.template(context));
                });
            } else {
                this.$el.html(this.template(context));
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
                        jsonstat: disableAnyFormat,
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
            var filename = this._getFilenameFromIdentifier("", "chart");

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

        clickDownloadButton: function (e, type) {
            e.preventDefault();
            var $currentTarget = $(e.currentTarget);
            if ($currentTarget.hasClass('disabled')) {
                return;
            }

            var jsonBody = $currentTarget.hasClass('selection') ? this.datasetSelection : JSON.stringify(this.getEmptyDatasetSelection());
            var xlsxCsvAndTsvFilenameSuffix = $currentTarget.hasClass('selection') ? "-selection" : "";
            switch (type) {
                case "tsv":
                    var self = this;
                    this._showExportTsvAttributesConfig(function (url, suffixAndFileExtension) {
                        self.downloadFile('POST', url, { jsonBody: jsonBody }, xlsxCsvAndTsvFilenameSuffix + suffixAndFileExtension);
                    });
                    break;
                case "xlsx":
                case "px":
                    this.downloadFile('POST', this.urls[type], { jsonBody: jsonBody }, xlsxCsvAndTsvFilenameSuffix + "." + type);
                    break;
                case "png":
                case "pdf":
                case "svg":
                    this.downloadFile('POST', this.urls[type], { svg: this.svg }, "." + type, "chart");
                    break;
                case "jsonstat":
                    this.redirectToFile(this.urls[type], $currentTarget.hasClass('selection') ? { representation: this.jsonstatSelection } : null);
                    break;
            }
        },

        redirectToFile: function (url, requestParams) {
            this.optionsModel.set('isDownloading', true);

            var formattedUrl = new URL(url);
            if (requestParams) {
                _.each(Object.keys(requestParams), function (key) {
                    formattedUrl.searchParams.append(key, requestParams[key]);
                });
            }
            window.location.href = formattedUrl.href;
        },

        downloadFile: function (requestMethod, url, requestParams, suffixAndFileExtension, filenameCustomPrefix) {
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
                        filename = self._getFilenameFromIdentifier(suffixAndFileExtension, filenameCustomPrefix);
                    }
                    self._downloadFileInBrowserFromBlob(blob, filename);
                }
            };
            xhr.onloadend = function () {
                self.optionsModel.set('isDownloading', false);
            };
            xhr.ontimeout = xhr.onloadend;
            xhr.send(new URLSearchParams(requestParams));
        },

        _getFilenameFromContentDisposition: function (xhr) {
            var disposition = xhr.getResponseHeader('Content-Disposition');
            if (disposition && disposition.indexOf('attachment') !== -1) {
                var filenameRegex = /filename[^\w;=\n]*=((['"]).*?\2|[^;\n]*)/;
                var filenameMatches = filenameRegex.exec(disposition);
                if (filenameMatches != null && filenameMatches[1]) { return filenameMatches[1].replace(/['"]/g, ''); }
            }
            return "";
        },

        _getFilenameFromIdentifier: function (suffixAndFileExtension, customPrefix) {
            var identifier = this.filterDimensions.metadata.identifier();
            return [customPrefix ? customPrefix : identifier.type, identifier.agency, identifier.identifier, identifier.version].join("-").replace(".", "_") + suffixAndFileExtension;
        },

        _downloadFileInBrowserFromBlob: function (blob, filename) {
            var downloadUrl = window.URL.createObjectURL(blob);

            var a = $('a#blob-download-anchor')[0];
            if (!a) {
                a = document.createElement("a");
                a.id = "blob-download-anchor";
                document.body.appendChild(a);
            }

            if (typeof a.download === 'undefined') {
                window.location = downloadUrl;
            } else {
                a.href = downloadUrl;
                a.download = filename;
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
                    callback(self._buildExportEndpoint('tsv', { fields: '-attributes' }), "-observations.tsv");
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
            return representations.join(":");
        },

        _getJsonStatUrl() {
            let link = this.filterDimensions.metadata.datasourceIdentifier.identifier.selfLink;
            let isIndicator = this.filterDimensions.metadata.datasourceIdentifier.identifier.type === 'indicator';

            let jsonStatUrl;

            if (link.hasOwnProperty("href")) {
                // dataset or query
                jsonStatUrl = new URL(link.href);
            } else if (typeof link === 'string') {
                // indicator
                jsonStatUrl = new URL(link);
            } else {
                return null;
            }

            if (isIndicator) {
                jsonStatUrl.href += "/data";
            }
            jsonStatUrl.href += ".jsonstat";

            var locale = I18n.locale;
            jsonStatUrl.searchParams.append('lang', locale);

            return jsonStatUrl;
        },
    });

}());