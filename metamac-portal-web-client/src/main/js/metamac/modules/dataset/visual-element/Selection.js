(function () {
    "use strict";

    App.namespace("App.VisualElement.Selection");

    App.VisualElement.Selection = function (options) {
        this.initialize(options);
        this._type = 'selection';
        this._dimensionViews = [];
    };

    App.VisualElement.Selection.prototype = new App.VisualElement.Base();

    _.extend(App.VisualElement.Selection.prototype, {

        template: App.templateManager.get("selection/selection-body"),

        load: function () {
            this._destroyDimensionViews();

            this.filterDimensions.invoke('set', { open: true });
            this.filterDimensions.accordion = false;

            var zones = this.filterDimensions.zones;
            zones.get("left").set({ fixedSize: undefined, drawableLimit: Infinity });
            zones.get("top").set({ fixedSize: undefined, drawableLimit: Infinity });
            zones.getFixedZones().forEach(function (zone) {
                zone.get('dimensions').each(function (dimension) {
                    zones.setDimensionZone("left", dimension);
                }, this);
            });

            this.$el.html(this.template());

            var $container = this.$el.find('.selection-dimensions-container');
            this._dimensionViews = this.filterDimensions.map(function (dimension) {
                var view = new App.widget.filter.sidebar.FilterSidebarDimensionView({
                    filterDimension: dimension,
                    collapsable: false
                });
                view.render();
                $container.append(view.el);
                return view;
            });
        },

        destroy: function () {
            var models = this.filterDimensions.models;
            _(models).first().set({ open: true });
            _.chain(models).tail().invoke('set', { open: false });
            this.filterDimensions.accordion = true;
            this._destroyDimensionViews();
        },

        _destroyDimensionViews: function () {
            _.invoke(this._dimensionViews, 'destroy');
            this._dimensionViews = [];
        }

    });

}());
