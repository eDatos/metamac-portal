(function () {
    'use strict';

    App.namespace('App.Map.MapContainerView');

    App.Map.MapContainerView = Backbone.View.extend({

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
            this.$el.empty();
            this._initInternalViews();
        },

        update: function (newDataJson, newGeoJson, newTitle) {
            this.dataJson = newDataJson;
            this.geoJson = newGeoJson;
            this.title = newTitle;

            var isMap = this.mapType === 'map';
            this.mapView.update(this.dataJson, this.geoJson, this.title, !isMap);
            if (isMap) {
                this.updateRanges();
            }
            
        },

        render: function () {
            this.zoomView.render();
            if (this.mapType === 'map') {
                this.rangesView.render();
            }
            this.mapView.render();
        },

        destroy: function () {
            this.mapView.destroy();
            this.zoomView.destroy();
            this.rangesView.destroy();
        },

        transform: function () {
            this.mapView.transform();
            this.zoomView.transform();
        },

        updateRanges: function () {
            this.mapView.updateRanges();
            this.rangesView.updateRanges();
        },

        zoomExit: function () {
            this.mapView.zoomExit();
        },

        _initInternalViews: function () {
            this._initMapView();
            this._initZoomView();
            this._initLeyendView();
            this._initRangesView();
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
                metadata: this.metadata
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

        _initLeyendView: function () {
        },

        _initRangesView: function () {
            var $elRanges = $('<div id="ranges-container"/>').appendTo(this.$el);
            this.rangesView = new App.Map.RangesView({
                el: $elRanges.get(0),
                model: this._mapModel,
                width: this._width,
                height: this._height
            });
        }

    });

})();
