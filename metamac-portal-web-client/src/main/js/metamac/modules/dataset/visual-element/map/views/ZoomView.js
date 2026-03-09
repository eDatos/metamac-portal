(function () {
    'use strict';

    App.namespace('App.Map.ZoomView');

    App.Map.ZoomView = Backbone.View.extend({
        _templateZoom : App.templateManager.get('dataset/map/map-zoom'),

        events : {
            "click #exit-zoom" : "_handleZoomExit",
            "click #more-zoom" : "_handleZoomIn",
            "click #less-zoom" : "_handleZoomOut"
            // mousewheel is a jQuery event atached to the visualization DIV
        },

        initialize : function (options) {
            this._width = options.width;
            this._height = options.height;
            this._setUpListeners();
        },

        render : function () {
            this.$zoomContainer = $(this._templateZoom());
            this.$el.append(this.$zoomContainer);
            this._storeCSSInfo();
        },

        destroy : function () {
            this.$el.remove();
            this.$el.unbind('mousewheel');
        },

        transform : function () {
            var currentDecrement = this._zoomDecrement() * this._currentZoom();
            var $currentZoom = $('#current-zoom');
            $currentZoom.css("top", this._baseZoomLineTop - currentDecrement);
        },

        _setUpListeners : function () {
            _.bindAll(this, '_handleMousewheel');
            this.$el.on('mousewheel', this._handleMousewheel);
        },

        _storeCSSInfo : function () {
            this.$currentZoom = $('#current-zoom');
            this.$zoomLine = $('#zoom-line');
            this._baseZoomLineTop = parseInt(this.$currentZoom.css("top"), 10);
        },

        _zoomDecrement : function () {
            var numZoomLevels = this.model.numZoomLevels();
            return this._calculateDecrementPixels(this.$zoomLine.height(), this.$currentZoom.height(), numZoomLevels);
        },

        _calculateDecrementPixels : function (totalHeight, controlHeight, numZoomLevels) {
            return (totalHeight - controlHeight) / numZoomLevels;
        },

        _currentZoom : function () {
            return this.model.currentZoomLevel();
        },

        _handleZoomExit : function () {
            this.model.zoomExit();
        },

        _handleZoomIn : function () {
            this.model.zoomIn();
        },

        _handleZoomOut : function () {
            this.model.zoomOut();
        },

        _handleMousewheel : function (e, delta) {
            if (delta > 0) {
                this.model.zoomIn();
            } else if (delta < 0) {
                this.model.zoomOut();
            }
            return false;
        }

    });

})();
