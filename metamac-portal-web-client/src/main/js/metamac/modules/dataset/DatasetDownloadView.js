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
            var identifierUrlPart = this.filterDimensions.metadata.urlIdentifierPart();

            var context = {
                selection: JSON.stringify(datasetSelection),
                emptySelection: JSON.stringify(this.getEmptyDatasetSelection()),
                url: {
                    tsv: App.endpoints["export"] + "/tsv" + identifierUrlPart,
                    excel: App.endpoints["export"] + "/excel" + identifierUrlPart,
                    px: App.endpoints["export"] + "/px" + identifierUrlPart
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
                });
            } else {
                this.$el.html(this.template(context));
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
            var isQuery = this.filterDimensions.metadata.identifier().type == "query";

            return {
                dataFormats: haveDataFormats,
                allDimensionsWithSelections: allDimensionsWithSelections,
                mapFormats: haveMapFormats,
                imageFormats: haveImageFormats,
                iconPreffix: visualizationSupertype,
                drawSelectionButtons: !isQuery || haveImageFormats // TODO METAMAC-2709
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

        onClickDownloadXlsx: function (e) {
            e.preventDefault();
            this.exportApiCall("excel");
        },

        onClickDownloadTsv: function () {
            this.exportApiCall("tsv");
        },

        onClickDownloadPng: function () {

        },

        onClickDownloadPdf: function () {

        },

        onClickDownloadSvg: function () {

        },

        exportApiCall: function (exportType) {
            var identifier = this.filterDimensions.metadata.identifier();
            var url = App.endpoints["export"] + "/" + exportType + "/" + identifier.agency + "/" + identifier.identifier + "/" + identifier.version;
            var selection = this.getDatasetSelection();

            var downloadRequest = $.ajax({
                url: url,
                method: "POST",
                data: JSON.stringify(selection),
                contentType: "application/json; charset=utf-8"
            });

            downloadRequest.done(function (response) {
                console.log(response);
            });
        }


    });

}());