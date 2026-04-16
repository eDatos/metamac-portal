(function () {
    "use strict";

    App.namespace("App.modules.layout.BasePageLayout");

    App.modules.layout.BasePageLayout = Backbone.Marionette.Layout.extend({

        initialize: function (options) {
            this.controller = options.controller;
            this.filterDimensions = options.filterDimensions;
            this.metadata = options.metadata;
            this.data = options.data;
            this.dataSource = new App.DataSourceDataset({
                data: this.data,
                filterDimensions: this.filterDimensions
            });

            this._initializeOptionsModel();
            this._initializeRouteTabsView();
            this._initializeOptionsView();
            this._initializeVisualizationView();
            this._initializeFullScreen();
        },

        _initializeOptionsModel: function () {
            this.optionsModel = new App.modules.dataset.OptionsModel(this._getOptionsModelConfig());
        },

        _initializeRouteTabsView: function () {
            this.routeTabsView = new App.components.navigationTabs.NavigationTabsView({
                tabs: this._getTabsConfig(),
                optionsModel: this.optionsModel
            });
        },

        _initializeOptionsView: function () {
            this.optionsView = new App.modules.dataset.OptionsView({
                data: this.data,
                filterDimensions: this.filterDimensions,
                optionsModel: this.optionsModel,
                dataSource: this.dataSource,
                visualizationTabs: this._getTabsConfig()
            });
        },

        _initializeVisualizationView: function () {
            this.visualizationView = new App.modules.dataset.DatasetVisualizationView({
                data: this.data,
                filterDimensions: this.filterDimensions,
                optionsModel: this.optionsModel,
                veElements: this._getVeElements(),
                optionsView: this.optionsView,
                metadata: this.metadata,
                dataSource: this.dataSource
            });
        },

        _initializeFullScreen: function () {
            this.fullScreen = new App.FullScreen();
        },

        serializeData: function () {
            return {
                showHeader: this._showHeader(),
                isWidget: this.optionsModel.get('widget'),
                metadata: this.metadata.toJSON()
            };
        },

        _showHeader: function () {
            return App.config.showHeader && !this.optionsModel.get('widget');
        },

        _getHelpUrl: function () {
            try {
                var helpUrl = JSON.parse(App.config["helpUrl"]);
                return App.InternationalizationUtils.localizeLabel(helpUrl);
            } catch (error) {
                return App.config["helpUrl"];
            }
        },

        showVisualizationType: function (options) {
            if (this.fullScreen.isInFullScreen()) {
                this.fullScreen.refreshFullScreenListeners();
                this.optionsModel.set('fullScreen', true);
            } else if (options.fullScreen) {
                this.fullScreen.enterFullScreen();
            }

            if (!this.optionsModel.get('widgetInitialType')) {
                this.optionsModel.set('widgetInitialType', options.visualizationType);
            }
            this.optionsModel.set('type', options.visualizationType);
        },

        _isVisualizationButtonEnabled: function (type) {
            if (type === "line" && !this.filterDimensions.canDrawLineVisualizations()) {
                return false;
            }
            if ((type === "map" || type === "mapbubble") && !this.filterDimensions.canDrawMapVisualizations()) {
                return false;
            }

            return true;
        },

        _bindEvents: function () {
            // FullScreen
            this.listenTo(this.optionsView, "enterFullScreen", _.bind(this.fullScreen.enterFullScreen, this.fullScreen));
            this.listenTo(this.optionsView, "exitFullScreen", _.bind(this.fullScreen.exitFullScreen, this.fullScreen));
            this.listenTo(this.fullScreen, "didEnterFullScreen", this._onDidEnterFullScreen);
            this.listenTo(this.fullScreen, "didExitFullScreen", this._onDidExitFullScreen);
            this.listenTo(this.optionsModel, "change:type", this._onSelectType);
        },

        _unbindEvents: function () {
            this.stopListening();
        },

        _onDidEnterFullScreen: function () {
            this.visualizationView._didEnterFullScreen();
            this.optionsModel.set('fullScreen', true);
        },

        _onDidExitFullScreen: function () {
            this.visualizationView._didExitFullScreen();
            this.optionsModel.set('fullScreen', false);
        },

        _onSelectType: function () {
            var currentVe = this.visualizationView._getCurrentVe();
            if (currentVe) {
                currentVe._unbindEvents();
            }

            var type = this.optionsModel.get('type');
            if (type) {
                this._toggleClassByType(type);

                this.visualizationView.activeVisualElement(type);
                this.visualizationView.load();
                var controllerParams = this.metadata.identifier();
                controllerParams.visualizationType = type;
                this._afterTypeChange(controllerParams);
            }
            this.optionsView.setCurrentVe(this.visualizationView._getCurrentVe());
        },

        _toggleClassByType: function (type) {
            var GENERIC_PREFIX = "visualization-type-";
            var CONTEXT_PREFIX = this._getVisualizationContext() + "-visualization-type-";
            var regex = new RegExp("(^|\\s)(" + GENERIC_PREFIX + "|" + CONTEXT_PREFIX + ")\\S+", 'g');
            this.$el.removeClass(function (index, className) {
                return (className.match(regex) || []).join(' ');
            });
            this.$el.addClass(GENERIC_PREFIX + type + " " + CONTEXT_PREFIX + type);
        },

        // Subclasses must override at least the following methods:

        _getOptionsModelConfig: function () {
            return {};
        },

        _getVeElements: function () {
        },

        _getTabsConfig: function () {
        },

        _getVisualizationContext: function () {
        },

        _afterTypeChange: function (controllerParams) {
        },

        onRender: function () {

        }
    });

}());
