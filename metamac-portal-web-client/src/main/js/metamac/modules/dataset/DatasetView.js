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
                menu: false,
                filter: this.filterDimensions.hasMultidataset(),
                mustApplyVisualizationRestrictions: !this.metadata.identifier().permalinkId
            };
        },

        _getVeElements: function () {
            if (!this._veElements) {
                var visualElements = ["info", "table", "column", "bar", "line"];
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
            var sideViews = [];
            if (!this.optionsModel.get('widget')) {
                // sidebar - filter
                this.filterSidebarView = new App.widget.filter.sidebar.FilterSidebarView({
                    filterDimensions: this.filterDimensions,
                    optionsModel: this.optionsModel
                });

                this.orderSidebarView = new App.widget.filter.sidebar.OrderSidebarView({
                    filterDimensions: this.filterDimensions,
                    optionsModel: this.optionsModel
                });

                sideViews.push(this.filterSidebarView);
                sideViews.push(this.orderSidebarView);
            }

            this.sidebarView = new App.components.sidebar.SidebarView({
                sideViews: sideViews,
                contentView: this.visualizationView,
                optionsModel: this.optionsModel,
                defaultCurrentSideView: "filterSidebar"
            });
        },

        _getTabsConfig: function () {
            var self = this;
            var helpUrl = this._getHelpUrl();

            var graphSubtabs = [
                { type: "column", title: I18n.t("filter.button.column") },
                { type: "bar", title: I18n.t("filter.button.bar") },
                { type: "line", title: I18n.t("filter.button.line") }
            ].filter(function (subtab) {
                return self._isVisualizationButtonEnabled(subtab.type);
            });

            var mapSubtabs = [
                { type: "map", title: I18n.t("filter.button.map") },
                { type: "mapbubble", title: I18n.t("filter.button.mapbubble") }
            ].filter(function (subtab) {
                return self._isVisualizationButtonEnabled(subtab.type);
            });

            return [
                {
                    type: "table",
                    enabled: self._isVisualizationButtonEnabled("table"),
                    title: I18n.t("filter.button.table")
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
                    title: I18n.t("filter.button.info")
                }, /* TODO add when the api download is transformed into a page (now it's a modal) {
                    type: "api",
                    enabled: true,
                    title: I18n.t("filter.button.apiDownload")
                }, */ {
                    type: "help",
                    enabled: !!helpUrl,
                    link: helpUrl,
                    title: I18n.t("filter.button.helpUrl")
                }
            ];
        },

        _bindEvents: function () {
            App.modules.dataset.DatasetView.__super__._bindEvents.call(this);

            if (this.optionsModel.get('widget')) {
                this.listenTo(this.optionsModel, "change:filter", this._updateDimensionsHeight);
            }
        },

        _updateDimensionsHeight: function () {
            this.content.$el.toggleClass('no-dimensions', !this.optionsModel.get('filter'));
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
            if (this.optionsModel.get('widget')) {
                this._initializeWidget();
            }
            this._unbindEvents();
            this._bindEvents();

            if (this.optionsModel.get('widget')) {
                this._updateDimensionsHeight();
            }

            App.BrowsersCompatibility.forceFontsRepaint();
        },

        onBeforeClose: function () {
            this.optionsModel.unset('type');
        },

        _onDidEnterFullScreen: function () {
            App.modules.dataset.DatasetView.__super__._onDidEnterFullScreen.call(this);

            if (this.optionsModel.get('widget')) {
                this._updateSidebarHeight('');
            }
        },

        _onDidExitFullScreen: function () {
            App.modules.dataset.DatasetView.__super__._onDidExitFullScreen.call(this);

            if (this.optionsModel.get('widget')) {
                this._updateSidebarHeight($('body').height());
            }
        },

        _initializeWidget: function () {
            this.content.$el.addClass('dataset-widget');
            const $body = $('body');
            this._updateSidebarHeight($body.height());

            const updateSidebarHeightOnResize = _.debounce(() => {
                this._updateSidebarHeight($body.height());
            }, 100);

            this._sidebarResizeObserver = new ResizeObserver(_.bind(updateSidebarHeightOnResize, this));
            this._sidebarResizeObserver.observe($body[0]);
        },

        _updateSidebarHeight: function (height) {
            this.content.$el.height(height);
        },

        showLoading: function () {
            this.visualizationView.showLoading();
        }
    });

}());
