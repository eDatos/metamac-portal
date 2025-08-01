(function () {
    var Constants = App.Constants;

    App.namespace("App.modules.dataset");

    App.modules.dataset.DatasetView = Backbone.Marionette.Layout.extend({

        template: "dataset/dataset-page",

        className: "dataset-view",

        regions: {
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
                buttons: this.visualElements,
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
        },

        serializeData: function () {
            var context = {
                showHeader: this._showHeader(), // Depends if the server is already painting the title and description
                isWidget: this.optionsModel.get('widget'),
                metadata: this.metadata.toJSON()
            };
            return context;
        },

        _showHeader: function () {
            return App.config.showHeader && !this.optionsModel.get('widget');
        },

        onRender: function () {

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

            $body.on('resize.datasetSidebarHeight', _.bind(updateSidebarHeightOnResize, this));
        },

        _updateSidebarHeight: function (height) {
            this.content.$el.height(height);
        },

        showLoading: function () {
            this.visualizationView.showLoading();
        }
    });

}());
