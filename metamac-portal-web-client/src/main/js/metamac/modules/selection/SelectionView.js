(function () {
    "use strict";

    App.namespace('App.modules.selection.SelectionView');

    App.modules.selection.SelectionView = Backbone.Marionette.CompositeView.extend({

        template: "selection/selection",
        itemView: App.widget.filter.sidebar.FilterSidebarDimensionView,
        itemViewContainer: ".selection-dimensions-container",

        events: {
            "click .selection-visualize-selection": "onVisualizeSelection",
            "click .selection-visualize-all": "onVisualizeAll"
        },

        initialize: function (options) {
            this.metadata = options.metadata;
            this.data = options.data;
            this.controller = options.controller;
            this.filterDimensions = this.controller.filterDimensions;
            this.dataSource = new App.DataSourceDataset({
                data: this.data,
                filterDimensions: this.filterDimensions
            });

            this.optionsModel = new App.modules.dataset.OptionsModel({
                widget: App.config.widget,
                visualize: true
            });

            this._initializeOptionsView();
            this._initializeFullScreen();
        },

        serializeData: function () {
            var context = {
                showHeader: this._showHeader(),
                selectAllUrl: App.context + this.metadata.urlIdentifierPart(),
                metadata: this.metadata.toJSON()
            };
            return context;
        },

        _showHeader: function () {
            return App.config.showHeader && !this.optionsModel.get('widget');
        },

        _initializeOptionsView: function () {
            this.optionsView = new App.modules.dataset.OptionsView({
                data: this.data,
                optionsModel: this.optionsModel,
                filterDimensions: this.filterDimensions,
                el: this.$(".selection-options-bar"),
                dataSource: this.dataSource
                //,buttons : this.veElements
            });
        },

        buildItemView: function (item, ItemViewType, itemViewOptions) {
            var options = _.extend({ filterDimension: item, collapsable: false }, itemViewOptions);
            return new ItemViewType(options);
        },

        onBeforeRender: function () {
            this.delegateEvents();

            this.collection.invoke('set', { open: true });
            this.collection.accordion = false;

            var zones = this.collection.zones;

            // Remove restrictions
            zones.get("left").set({ fixedSize: undefined, drawableLimit: Infinity });
            zones.get("top").set({ fixedSize: undefined, drawableLimit: Infinity });

            zones
                .getFixedZones()
                .forEach(function (zone) {
                    zone.get('dimensions').each(function (dimension) {
                        zones.setDimensionZone("left", dimension);
                    }, this);
                });
        },

        onRender: function () {
            // We render here the options bar and the user header because marionette provides a built in method
            this.optionsView.setElement(this.$('.selection-options-bar')).render();

            this.fullScreen.setContainer($('.metamac-container'));
            // Workaround: assigning a inner container as selection-body will generate problems when changing pages, because the fullscreen will break because it doesn´t exist.
            // Thats why its assigned to a parent
            //            this.fullScreen.setContainer(this.$('.selection-body'));

            this.optionsModel.set('fullScreen', false);

            this._unbindEvents();
            this._bindEvents();
        },

        _initializeFullScreen: function () {
            this.fullScreen = new App.FullScreen();
        },

        _bindEvents: function () {
            // FullScreen
            this.listenTo(this.optionsView, "enterFullScreen", _.bind(this.fullScreen.enterFullScreen, this.fullScreen));
            this.listenTo(this.optionsView, "exitFullScreen", _.bind(this.fullScreen.exitFullScreen, this.fullScreen));
            this.listenTo(this.fullScreen, "didEnterFullScreen", this._onDidEnterFullScreen);
            this.listenTo(this.fullScreen, "didExitFullScreen", this._onDidExitFullScreen);
        },

        _unbindEvents: function () {
            this.stopListening();
        },

        _onDidEnterFullScreen: function () {
            this.optionsModel.set('fullScreen', true);
        },

        _onDidExitFullScreen: function () {
            this.optionsModel.set('fullScreen', false);
        },

        onBeforeClose: function () {
            var models = this.collection.models;
            _(models).first().set({ open: true });
            _.chain(models).tail().invoke('set', { open: false });
            this.collection.accordion = true;
        },

        onVisualizeAll: function (e) {
            e.preventDefault();

            this.collection.each(function (filterDimension) {
                filterDimension.get('representations').selectAll();
            });
            this.gotoVisualization();
        },

        onVisualizeSelection: function (e) {
            e.preventDefault();
            // generate a permalink?
            this.gotoVisualization();
        },

        gotoVisualization: function () {
            var controllerParams = this.metadata.identifier();

            controllerParams.fullScreen = this.optionsModel.get('fullScreen');

            this.controller.showDatasetVisualization(controllerParams);
        }
    });

}());
