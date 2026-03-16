(function () {
    var Constants = App.Constants;

    App.namespace("App.modules.dataset");

    App.modules.dataset.DatasetView = Backbone.Marionette.Layout.extend({

        template: "dataset/dataset-page",

        className: "dataset-view",

        regions: {
            routeTabs: ".navigation-tabs-region",
            content: ".dataset-sidebar-visualization-container",
            optionsBar: ".dataset-visualization-options-bar",
            dimensions: ".dataset-visualization-dimensions"
        },

        initialize: function (options) {
            this.controller = options.controller;
            this.filterDimensions = options.filterDimensions;
            this.metadata = options.metadata;
            this.data = options.data;
            this.dataSource = new App.DataSourceDataset({
                data: this.data,
                filterDimensions: this.filterDimensions
            });

            this.optionsModel = new App.modules.dataset.OptionsModel({
                widget: App.config.widget,
                menu: false,
                filter: this.filterDimensions.hasMultidataset(),
                mustApplyVisualizationRestrictions: !this.metadata.identifier().permalinkId
            });

            this._initializeVisualElements();
            this._initializeSidebarView();
            this._initializeRouteTabsView();
            this._initializeFullScreen();
        },

        _initializeVisualElements: function () {
            var visualElements = ["info", "table", "column", "bar", "line"];
            if (_.findWhere(this.metadata.getDimensions(), { type: 'GEOGRAPHIC_DIMENSION' })) {
                visualElements.push("map");
                visualElements.push("mapbubble");
            }
            this.visualElements = visualElements;
        },

        _initializeSidebarView: function () {

            // Options bar
            this.optionsView = new App.modules.dataset.OptionsView({
                data: this.data,
                filterDimensions: this.filterDimensions,
                optionsModel: this.optionsModel,
                dataSource: this.dataSource
            });

            // visualization
            this.visualizationView = new App.modules.dataset.DatasetVisualizationView({
                data: this.data,
                filterDimensions: this.filterDimensions,
                optionsModel: this.optionsModel,
                veElements: this.visualElements,
                optionsView: this.optionsView,
                metadata: this.metadata,
                dataSource: this.dataSource
            });

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

        _initializeRouteTabsView: function () {
            this.routeTabsView = new App.components.navigationTabs.RouteTabsView({
                tabs: this._getTabsConfig(),
                optionsModel: this.optionsModel
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

        _initializeFullScreen: function () {
            this.fullScreen = new App.FullScreen();
        },

        _bindEvents: function () {
            // FullScreen
            this.listenTo(this.visualizationView, "enterFullScreen", _.bind(this.fullScreen.enterFullScreen, this.fullScreen));
            this.listenTo(this.visualizationView, "exitFullScreen", _.bind(this.fullScreen.exitFullScreen, this.fullScreen));
            this.listenTo(this.fullScreen, "didEnterFullScreen", this._onDidEnterFullScreen);
            this.listenTo(this.fullScreen, "didExitFullScreen", this._onDidExitFullScreen);
            this.listenTo(this.optionsModel, "change:type", this._onSelectChartType);

            if (this.optionsModel.get('widget')) {
                this.listenTo(this.optionsModel, "change:filter", this._updateDimensionsHeight);
            }
        },

        _updateDimensionsHeight: function () {
            this.content.$el.toggleClass('no-dimensions', !this.optionsModel.get('filter'));
        },

        _unbindEvents: function () {
            this.stopListening();
            if (this._sidebarResizeObserver) {
                this._sidebarResizeObserver.disconnect();
                this._sidebarResizeObserver = null;
            }
        },

        serializeData: function () {
            return {
                showHeader: this._showHeader(), // Depends if the server is already painting the title and description
                isWidget: this.optionsModel.get('widget'),
                metadata: this.metadata.toJSON()
            };
        },

        _getHelpUrl: function () {
            try {
                var helpUrl = JSON.parse(App.config["helpUrl"]);
                return App.InternationalizationUtils.localizeLabel(helpUrl);
            } catch (error) {
                return App.config["helpUrl"];
            }
        },

        _isVisualizationButtonEnabled: function (type) {
            if (type === "line" && !this.filterDimensions.canDrawLineVisualizations()) {
                return false;
            }

            if ((type === "map" || type === "mapbubble") && !this.filterDimensions.canDrawMapVisualizations()) {
                return false;
            }

            if (this.optionsModel.get('widget')) {
                return type === "info" || type === this.optionsModel.get('widgetInitialType');
            }
            return true;
        },

        _showHeader: function () {
            return App.config.showHeader && !this.optionsModel.get('widget');
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

        showChart: function (options) {
            if (this.fullScreen.isInFullScreen()) {
                this.fullScreen.refreshFullScreenListeners();
                this.optionsModel.set('fullScreen', true);
            }
            else if (options.fullScreen) {
                this.fullScreen.enterFullScreen();
            }

            if (!this.optionsModel.get('widgetInitialType')) {
                this.optionsModel.set('widgetInitialType', options.visualizationType);
            }
            this.optionsModel.set('type', options.visualizationType);
        },

        _onSelectChartType: function () {
            var currentVe = this.visualizationView._getCurrentVe();
            if (currentVe) {
                currentVe._unbindEvents();
            }

            var type = this.optionsModel.get('type');
            if (type) {
                this._toggleClassByChartType(type);

                this.visualizationView.activeVisualElement(type);
                this.visualizationView.load();
                this.dimensionsView.render();

                var controllerParams = this.metadata.identifier();
                controllerParams.visualizationType = type;
                this.controller.changeDatasetVisualization(controllerParams);
            }
            this.optionsView.setCurrentVe(this.visualizationView._getCurrentVe());
        },

        _toggleClassByChartType: function (type) {
            var CLASS_PREFFIX = "dataset-visualization-type-";
            var regex = new RegExp("(^|\\s)" + CLASS_PREFFIX + "\\S+", 'g');
            this.content.$el.removeClass(function (index, className) {
                return (className.match(regex) || []).join(' ');
            });
            this.content.$el.addClass(CLASS_PREFFIX + type);
        },

        _onDidEnterFullScreen: function () {
            this.visualizationView._didEnterFullScreen();
            this.optionsModel.set('fullScreen', true);

            if (this.optionsModel.get('widget')) {
                this._updateSidebarHeight('');
            }
        },

        _onDidExitFullScreen: function () {
            this.visualizationView._didExitFullScreen();
            this.optionsModel.set('fullScreen', false);

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
