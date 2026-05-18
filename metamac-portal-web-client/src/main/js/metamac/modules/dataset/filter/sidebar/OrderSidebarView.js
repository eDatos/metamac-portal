(function () {
    "use strict";

    App.namespace("App.widget.filter.sidebar");

    var DRAGOVER_CLASS = "drag-over";

    App.widget.filter.sidebar.OrderSidebarView = Backbone.View.extend({

        id : "orderSidebar",
        title : I18n.t("filter.sidebar.order.title"),

        template : App.templateManager.get("dataset/filter/sidebar/filter-order-view"),

        initialize : function (options) {
            this.filterDimensions = options.filterDimensions;
            this.title = I18n.t("filter.sidebar.order.title");
            this.optionsModel = options.optionsModel;
        },

        events : {
            "dragstart .order-sidebar-dimension.draggable" : "_onDragstart",
            "dragenter .order-sidebar-dimension.draggable" : "_onDragenter",
            "dragover .order-sidebar-dimension.draggable" : "_onDragover",
            "dragleave .order-sidebar-dimension.draggable" : "_onDragleave",
            "drop .order-sidebar-dimension.draggable" : "_onDrop",
            "dragend .order-sidebar-dimension.draggable" : "_onDragend",

            "dragenter .order-sidebar-zone.draggable" : "_onDragenter",
            "dragover .order-sidebar-zone.draggable" : "_onDragover",
            "dragleave .order-sidebar-zone.draggable" : "_onDragleave",
            "drop .order-sidebar-zone.draggable" : "_onDrop"
        },

        destroy : function () {
            this._unbindEvents();
        },

        _bindEvents : function () {
            this.listenTo(this.filterDimensions, "change:zone", _.throttle(this.render, 15));
        },

        _unbindEvents : function () {
            this.stopListening();
        },

        _getCurrentChartType : function () {
            return this.optionsModel.get("type");
        },

        _getLabelFromZone : function (zone) {
            var currentChartType = this._getCurrentChartType();
            return I18n.t("filter.sidebar.order." + currentChartType + "." + zone);
        },

        _renderContextForMap : function () {
            var zonesIds = ["left", "fixed"];

            var zones = _.map(zonesIds, function (zone) {
                return {
                    id : zone,
                    label : this._getLabelFromZone(zone),
                    draggable : zone === "left",
                    dimensions : this._dimensionsForZone(zone),
                    isFixed : zone === "fixed"
                };
            }, this);

            return {zones : zones};
        },

        _renderContext : function () {
            var zonesIds = ["top", "left", "fixed"];

            var zones = _.map(zonesIds, function (zone) {
                return {
                    id : zone,
                    label : this._getLabelFromZone(zone),
                    draggable : true,
                    dimensions : this._dimensionsForZone(zone),
                    isFixed : zone === "fixed"
                };
            }, this);

            return {zones : zones};
        },

        _isMap : function () {
            return "map" === this._getCurrentChartType() || "mapbubble" === this._getCurrentChartType();
        },

        render : function () {
            this._unbindEvents();
            this._bindEvents();
            var context = this._isMap() ? this._renderContextForMap() : this._renderContext();
            this.$el.html(this.template(context));
        },

        _dimensionsForZone : function (zoneId) {
            var dimensionCollection = this.filterDimensions.dimensionsAtZone(zoneId);
            var isMap = this._isMap();
            var dimensionsForZone = dimensionCollection.map(function (dimensionModel) {
                var dimension = dimensionModel.toJSON();
                dimension.draggable = isMap ? dimensionModel.get('type') === "GEOGRAPHIC_DIMENSION" : true;
                if (dimensionModel.isFixedDimension()) {
                    dimension.selectedCategory = dimensionModel.get('representations').findWhere({drawable : true}).toJSON();
                }
                return dimension;
            });
            return dimensionsForZone;
        },

        _onDragstart : function (e) {
            var $elem = $(e.currentTarget);
            e.originalEvent.dataTransfer.effectAllowed = 'move';
            e.originalEvent.dataTransfer.setData('Text', $elem.data("dimension-id"));
        },

        _onDragover : function (e) {
            e.preventDefault();
            var $currentTarget = $(e.currentTarget);
            $currentTarget.addClass(DRAGOVER_CLASS);
            return false;
        },

        _onDragenter : function (e) {
            e.preventDefault();
            var $currentTarget = $(e.currentTarget);
            $currentTarget.addClass(DRAGOVER_CLASS);
        },

        _onDragleave : function (e) {
            var $currentTarget = $(e.currentTarget);
            $currentTarget.removeClass(DRAGOVER_CLASS);
        },

        _onDrop : function (e) {
            var currentTarget = $(e.currentTarget);
            var transferDimensionId = e.originalEvent.dataTransfer.getData("Text");
            var transferDimension = this.filterDimensions.get(transferDimensionId);

            if (currentTarget.data("dimension-id")) {
                // swap two dimensions
                var toDimensionId = currentTarget.data("dimension-id");
                var toDimension = this.filterDimensions.get(toDimensionId);
                this.filterDimensions.zones.swapDimensions(transferDimension, toDimension);
            } else {
                //move to a zone
                var zone = currentTarget.data("zone");
                this.filterDimensions.zones.setDimensionZone(zone, transferDimension);
            }
            return false;
        },

        _onDragend : function () {
            this.$("." + DRAGOVER_CLASS).removeClass(DRAGOVER_CLASS);
        }

    });


}());
