(function () {
    'use strict';

    App.namespace('App.Map.MapContainerView');

    App.Map.MapContainerView = Backbone.View.extend({

        _errorTemplate: App.templateManager.get('dataset/map/map-error'),
        _granuralitiesWithNoSelection: App.templateManager.get('dataset/granuralities-with-no-selection'),

        initialize: function (options) {
            this._data = options.data;
            this._filterDimensions = options.filterDimensions;
            this._mapModel = options.mapModel;
            this._width = options.width;
            this._height = options.height;
            this.geoJson = options.geoJson;
            this.baseGeoJson = options.baseGeoJson;
            this.container = options.container;
            this.dataJson = options.dataJson;
            this.mapType = options.mapType;
            this.title = options.title;
            this.rightsHolder = options.rightsHolder;
            this.showRightsHolder = options.showRightsHolder;
            this.callback = options.callback;
            this.metadata = options.metadata;
            this.$title = options.$title;
            this.$el.empty();
            this._initInternalViews();
        },

        update: function (newDataJson, newGeoJson, newTitle) {
            
            if (!this._filterDimensions.checkGeographicDimensionsWithTwoElements()) {
                this.renderNoSelectionView();
            } else {
                if (this.$noSelection) {
                    this.$noSelection.hide();
                }
            }
            this.dataJson = newDataJson;
            this.geoJson = newGeoJson;
            this.title = newTitle;

            this.mapView.update(this.dataJson, this.geoJson, this.title);
            if (this.mapType === 'map') {
                this.mapView.updateRanges();
            }
        },

        renderNoSelectionView: function () {
            this.setupNoSelectionViewIfNeeded();
            this.$noSelection.html(this._granuralitiesWithNoSelection());
            this.$noSelection.show();
        },

        setupNoSelectionViewIfNeeded: function () {
            if (this.$el.find('.dataset-no-selection').length) { return; }
            this.$noSelection = $('<div class="dataset-no-selection dataset-message"></div>');
            this.$noSelection.hide();
            this.$el.append(this.$noSelection);
        },

        render: function () {
            if (this.mapView.canRender()) {
                this.zoomView.render();
                this.mapView.render();
            } else {
                this.$el.html(this._errorTemplate());
            }
        },

        destroy: function () {
            this.mapView.destroy();
            this.zoomView.destroy();
        },

        transform: function () {
            this.mapView.transform();
            this.zoomView.transform();
        },

        zoomExit: function () {
            this.mapView.zoomExit();
        },

        _initInternalViews: function () {
            this._initMapView();
            this._initZoomView();
        },

        _initMapView: function () {
            var $mapContainer = $('<div class="svgContainer"></div>').appendTo(this.$el);
            this.mapView = new App.Map.MapView({
                el: $mapContainer,
                data: this._data,
                filterDimensions: this._filterDimensions,
                model: this._mapModel,
                shapeList: this.geoJson,
                baseShapeList: this.baseGeoJson,
                container: this.container,
                dataJson: this.dataJson,
                width: this._width,
                height: this._height,
                mapType: this.mapType,
                title: this.title,
                rightsHolder: this.rightsHolder,
                showRightsHolder: this.showRightsHolder,
                callback: this.callback,
                metadata: this.metadata,
                $title: this.$title
            });
        },

        _initZoomView: function () {
            var $elZoom = $('<div id="zoom-container"/>').appendTo(this.$el);
            this.zoomView = new App.Map.ZoomView({
                el: $elZoom.get(0),
                model: this._mapModel,
                width: this._width,
                height: this._height
            });
        },

        getExportChartSvg: function () {
            return this.mapView.getExportChartSvg();
        }
    });

})();
