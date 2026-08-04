(function () {
    App.namespace("App.modules.dataset");

    App.modules.dataset.DatasetView = App.modules.layout.BasePageLayout.extend({

        template: "dataset/dataset-page",

        className: "dataset-view",

        regions: {
            routeTabs: ".navigation-tabs-region",
            content: ".dataset-sidebar-visualization-container",
            optionsBar: ".dataset-visualization-options-bar",
            dimensions: ".dataset-visualization-dimensions"
        },

        initialize: function (options) {
            App.modules.dataset.DatasetView.__super__.initialize.call(this, options);
            this._initializeSidebarView();
        },

        _getOptionsModelConfig: function () {
            return {
                widget: App.config.widget,
                filter: this.filterDimensions.hasMultidataset(),
                mustApplyVisualizationRestrictions: !this.metadata.identifier().permalinkId
            };
        },

        _getVeElements: function () {
            if (!this._veElements) {
                let visualElements = ["info", "apiEndpoints", "table", "column", "bar", "line"];
                if (_.findWhere(this.metadata.getDimensions(), { type: 'GEOGRAPHIC_DIMENSION' })) {
                    visualElements.push("map");
                    visualElements.push("mapbubble");
                }
                this._veElements = visualElements;
            }
            return this._veElements;
        },

        _initializeSidebarView: function () {
            this.dimensionsView = new App.modules.dataset.DimensionsView({
                filterDimensions: this.filterDimensions,
                optionsModel: this.optionsModel,
                data: this.data
            });

            // sidebarView
            if (!this.optionsModel.get('widget')) {
                this.filterSidebarView = new App.widget.filter.sidebar.FilterSidebarView({
                    filterDimensions: this.filterDimensions,
                    optionsModel: this.optionsModel,
                    multidataset: this.multidataset
                });
            }

            this.sidebarView = new App.components.sidebar.SidebarView({
                sideView: this.filterSidebarView,
                contentView: this.visualizationView,
                optionsModel: this.optionsModel
            });
        },

        _getTabsConfig: function () {
            const self = this;
            const helpUrl = this._getHelpUrl();

            const graphSubtabs = [
                { type: "column", title: I18n.t("filter.button.column"), iconClass: "dataset-options-column" },
                { type: "bar", title: I18n.t("filter.button.bar"), iconClass: "dataset-options-bar", default: true },
                { type: "line", title: I18n.t("filter.button.line"), iconClass: "dataset-options-line" }
            ].filter(function (subtab) {
                return self._isVisualizationButtonEnabled(subtab.type);
            });

            const mapSubtabs = [
                { type: "map", title: I18n.t("filter.button.map"), iconClass: "dataset-options-map" },
                { type: "mapbubble", title: I18n.t("filter.button.mapbubble"), iconClass: "dataset-options-mapbubble" }
            ].filter(function (subtab) {
                return self._isVisualizationButtonEnabled(subtab.type);
            });

            return [
                {
                    type: "table",
                    enabled: self._isVisualizationButtonEnabled("table"),
                    title: I18n.t("filter.button.table"),
                    iconClass: "dataset-options-table"
                }, {
                    type: "charts",
                    enabled: graphSubtabs.length > 0,
                    title: I18n.t("filter.button.charts"),
                    subtabs: graphSubtabs
                }, {
                    type: "maps",
                    enabled: mapSubtabs.length > 0,
                    title: I18n.t("filter.button.maps"),
                    subtabs: mapSubtabs
                }, {
                    type: "info",
                    enabled: self._isVisualizationButtonEnabled("info"),
                    title: I18n.t("filter.button.info"),
                    iconClass: "dataset-options-info"
                }, {
                    type: "apiEndpoints",
                    enabled: self._isVisualizationButtonEnabled("apiEndpoints"),
                    title: I18n.t("filter.button.apiEndpoints"),
                    iconClass: "dataset-options-api-endpoints"
                }, {
                    type: "help",
                    enabled: !!helpUrl,
                    link: helpUrl,
                    title: I18n.t("filter.button.helpUrl")
                }
            ];
        },

        _getVisualizationContext: function () {
            return "dataset";
        },

        _afterTypeChange: function (controllerParams) {
            this.dimensionsView.render();
            this.controller.changeDatasetVisualization(controllerParams);
        },

        _unbindEvents: function () {
            App.modules.dataset.DatasetView.__super__._unbindEvents.call(this);
            if (this._sidebarResizeObserver) {
                this._sidebarResizeObserver.disconnect();
                this._sidebarResizeObserver = null;
            }
        },

        onRender: function () {
            this.routeTabs.show(this.routeTabsView);
            this.content.show(this.sidebarView);
            this.optionsBar.show(this.optionsView);
            this.dimensions.show(this.dimensionsView);
            this.fullScreen.setContainer($('.metamac-container'));
            this._unbindEvents();
            this._bindEvents();

            App.BrowsersCompatibility.forceFontsRepaint();
        },

        onBeforeClose: function () {
            this.optionsModel.unset('type');
        },

        _onDidEnterFullScreen: function () {
            App.modules.dataset.DatasetView.__super__._onDidEnterFullScreen.call(this);
        },

        _onDidExitFullScreen: function () {
            App.modules.dataset.DatasetView.__super__._onDidExitFullScreen.call(this);
        },

        showLoading: function () {
            this.visualizationView.showLoading();
        }
    });

}());
