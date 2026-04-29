(function () {
    App.namespace("App.modules.dataset");

    App.modules.dataset.OptionsModel = Backbone.Model.extend({
        defaults: {
            type: '',
            fullScreen: false,
            filter: false,
            visualize: false,
            options: true,
            widget: false,
            widgetButton: true,
            widgetInitialType: '',
            mustApplyVisualizationRestrictions: true,
            isDownloading: false
        }
    });

})();