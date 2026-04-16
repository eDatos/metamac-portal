(function () {
    "use strict";

    App.namespace('App.VisualElement.ApiDownload');

    App.VisualElement.ApiDownload = function (options) {
        this.initialize(options);
        this._type = 'apiDownload';
    };

    App.VisualElement.ApiDownload.prototype = new App.VisualElement.Base();

    _.extend(App.VisualElement.ApiDownload.prototype, {

        template: App.templateManager.get("dataset/dataset-api-download"),

        load: function () {
            this._getSelectionApiUrl();
            this._bindEvents();
            this.render();
        },

        _bindEvents: function () {
            this.listenTo(this.filterDimensions, "change:drawable change:zone change:visibleLabelType reverse", _.debounce(this._updateSelectionApiUrl, 20));
        },

        _unbindEvents: function () {
            this.stopListening();
        },

        destroy: function () {
            this._unbindEvents();
        },

        render: function () {
            if (!this.$el) {
                return;
            }

            var self = this;
            var formats = this._getApiDownloadFormats();
            var context = {
                url: formats.map(function (format) {
                    return { format: format, href: self._buildEndpoint(format.toLowerCase()) };
                }),
                selectionUrl: formats.map(function (format) {
                    return { format: format, href: self._buildSelectionEndpoint(format.toLowerCase()) };
                }),
                selectionIsVisible: this.selectionApiUrl.isVisible,
                apiDownloadMessage: this._buildApiDownloadMessage(),
                selectionApiDownloadMessage: this._buildApiDownloadMessage(true),
                apiDocumentationUrl: this.metadata.getApiDocumentationUrl(),
                targetBlank: App.config["widget"],
                rightsHolder: this.showRightsHolderText() ? this.getRightsHolderText() : '',
            };
            this.$el.html(this.template(context));

            var scrollGroup = this.$el.find('.metadata-group');
            scrollGroup.perfectScrollbar();
            this.$el.find('.metadata-accordion').accordion({
                collapsible: true,
                active: false,
                heightStyle: "content",
                activate: function () {
                    scrollGroup.perfectScrollbar('update');
                }
            });

            scrollGroup.perfectScrollbar('update');
        },

        _updateSelectionApiUrl: function () {
            this._getSelectionApiUrl();
            this.render();
        },

        _getSelectionApiUrl: function () {
            var apiUrl = this.data.metadata.getApiUrl();
            var dimensionParameter = App.DimensionsUtils.getDimensionsParameterForRequest(this._getDimensionsForApiUrl());
            this.selectionApiUrl = {
                href: apiUrl.href,
                queryParams: dimensionParameter,
                isVisible: !!dimensionParameter
            };
        },

        _getDimensionsForApiUrl: function () {
            return _.map(this.filterDimensions.getDimensionsWithSomeRepresentationNotSelected(), function (dimension) {
                var representations = _.map(dimension.getSelectedRepresentations(), function(representation) {
                    return representation.id;
                });
                return {
                    id: dimension.id,
                    representations: representations
                };
            });
        },

        _buildApiDownloadMessage: function(isSelection) {
            var formats = this._getApiDownloadFormats();
            var formatExample = formats[0];
            return isSelection?
                I18n.t("entity.dataset.selectionApiUrl.apiDownload", { formats: formats, formatExampleLowercase: formatExample.toLowerCase() })
                : I18n.t("entity.dataset.apiUrl.apiDownload", { formats: formats, formatExample: formatExample, formatExampleLowercase: formatExample.toLowerCase() });
        },

        _getApiDownloadFormats: function() {
            var allApiDownloadFormats = ["CSV", "TSV", "XLSX", "XML", "JSON", "JSONSTAT"];
            if (this._isIndicator()) {
                return allApiDownloadFormats.filter(format => format !== "XML");
            }
            return allApiDownloadFormats;
        },

        _buildEndpoint: function (type) {
            return this.filterDimensions.metadata.getApiUrl().href + "." + type;
        },

        _buildSelectionEndpoint: function (type) {
            return this.selectionApiUrl.href + "." + type + '?' + this.selectionApiUrl.queryParams;
        }
    });
}());
