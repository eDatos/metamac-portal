(function () {
    "use strict";

    App.namespace('App.modules.selection.SelectionView');

    App.modules.selection.SelectionView = App.modules.layout.BasePageLayout.extend({

        template: "selection/selection",

        className: "selection-view",

        regions: {
            routeTabs: ".navigation-tabs-region",
            content: ".selection-visualization-container",
            optionsBar: ".selection-visualization-options-bar"
        },

        _getOptionsModelConfig: function () {
            return {
                widget: App.config.widget,
                visualize: true
            };
        },

        _getVeElements: function () {
            return ["info", "selection", "apiDownload"];
        },

        _getTabsConfig: function () {
            var helpUrl = this._getHelpUrl();
            return [
                {
                    type: "selection",
                    enabled: true,
                    title: I18n.t("filter.button.selection")
                }, {
                    type: "info",
                    enabled: this._isVisualizationButtonEnabled("info"),
                    title: I18n.t("filter.button.info")
                }, {
                    type: "apiDownload",
                    enabled: this._isVisualizationButtonEnabled("apiDownload"),
                    title: I18n.t("filter.button.apiDownload")
                }, {
                    type: "help",
                    enabled: !!helpUrl,
                    link: helpUrl,
                    title: I18n.t("filter.button.helpUrl")
                }
            ];
        },

        _getVisualizationContext: function () {
            return "selection";
        },

        _afterTypeChange: function (controllerParams) {
            this.controller.changeSelectionVisualization(controllerParams);
        },

        onRender: function () {
            this.routeTabs.show(this.routeTabsView);
            this.content.show(this.visualizationView);
            this.optionsBar.show(this.optionsView);
            this.fullScreen.setContainer($('.metamac-container'));
            this.optionsModel.set('fullScreen', false);

            this._unbindEvents();
            this._bindEvents();
        },

        _bindEvents: function () {
            App.modules.selection.SelectionView.__super__._bindEvents.call(this);
            this.listenTo(this.optionsView, "visualize", this._onVisualize);
        },

        _onVisualize: function () {
            var controllerParams = this.metadata.identifier();
            controllerParams.fullScreen = this.optionsModel.get('fullScreen');
            controllerParams.visualizationType = undefined;
            this.controller.showDatasetVisualization(controllerParams);
        }
    });

}());
