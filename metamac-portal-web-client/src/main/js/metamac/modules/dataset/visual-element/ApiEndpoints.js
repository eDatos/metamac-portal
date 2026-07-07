(function () {
    "use strict";

    App.namespace('App.VisualElement.ApiEndpoints');

    App.VisualElement.ApiEndpoints = function (options) {
        this.initialize(options);
        this._type = 'apiEndpoints';
    };

    App.VisualElement.ApiEndpoints.prototype = new App.VisualElement.Base();

    _.extend(App.VisualElement.ApiEndpoints.prototype, {

        template: App.templateManager.get("dataset/dataset-api-endpoints"),

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

        _destroyWidgets: function () {
            this.$el.find('.metadata-accordion').accordion('destroy');
            this.$el.find('.metadata-group').perfectScrollbar('destroy');
        },

        render: function () {
            if (!this.$el) {
                return;
            }

            const self = this;
            const formats = this._getApiEndpointsFormats();
            const context = {
                url: formats.map(function (format) {
                    return { format: format, href: self._buildEndpoint(format.toLowerCase()) };
                }),
                selectionUrl: formats.map(function (format) {
                    return { format: format, href: self._buildSelectionEndpoint(format.toLowerCase()) };
                }),
                selectionIsVisible: this.selectionApiUrl.isVisible,
                apiEndpointsMessage: this._buildApiEndpointsMessage(),
                selectionApiEndpointsMessage: this._buildApiEndpointsMessage(true),
                apiDocumentationUrl: this.metadata.getApiDocumentationUrl(),
                rightsHolder: this.showRightsHolderText() ? this.getRightsHolderText() : '',
            };
            this.$el.html(this.template(context));

            const scrollGroup = this.$el.find('.metadata-group');
            scrollGroup.perfectScrollbar();
            scrollGroup.on('remove', _.bind(this._destroyWidgets, this));
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
            const apiUrl = this.data.metadata.getApiUrl();
            const dimensionParameter = App.DimensionsUtils.getDimensionsParameterForRequest(this._getDimensionsForApiUrl());
            this.selectionApiUrl = {
                href: apiUrl.href,
                queryParams: dimensionParameter,
                isVisible: !!dimensionParameter
            };
        },

        _getDimensionsForApiUrl: function () {
            return _.map(this.filterDimensions.getDimensionsWithSomeRepresentationNotSelected(), function (dimension) {
                const representations = _.map(dimension.getSelectedRepresentations(), function(representation) {
                    return representation.id;
                });
                return {
                    id: dimension.id,
                    representations: representations
                };
            });
        },

        _buildApiEndpointsMessage: function(isSelection) {
            const formats = this._getApiEndpointsFormats();
            const formatExample = formats[0];
            return isSelection?
                I18n.t("entity.dataset.selectionApiUrl.apiEndpoints", { formats: formats, formatExampleLowercase: formatExample.toLowerCase() })
                : I18n.t("entity.dataset.apiUrl.apiEndpoints", { formats: formats, formatExample: formatExample, formatExampleLowercase: formatExample.toLowerCase() });
        },

        _getApiEndpointsFormats: function() {
            const ALL_API_ENDPOINTS_FORMATS = ["CSV", "TSV", "XLSX", "XML", "JSON", "JSONSTAT"];
            if (this._isIndicator()) {
                return ALL_API_ENDPOINTS_FORMATS.filter(format => format !== "XML");
            }
            return ALL_API_ENDPOINTS_FORMATS;
        },

        _buildEndpoint: function (type) {
            return `${this.filterDimensions.metadata.getApiUrl().href}.${type}`;
        },

        _buildSelectionEndpoint: function (type) {
            return `${this.selectionApiUrl.href}.${type}?${this.selectionApiUrl.queryParams}`;
        }
    });
}());
