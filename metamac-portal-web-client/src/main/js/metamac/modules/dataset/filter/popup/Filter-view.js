App.namespace("App.widget.filter");

App.widget.filter.FilterView = Backbone.View.extend({
    _templateExternalContainer : App.templateManager.get('dataset/filter/popup/filter-external-container'),
    _templateTableContainers : App.templateManager.get('dataset/filter/popup/filter-table-containers'),
    _templateColumnContainers : App.templateManager.get('dataset/filter/popup/filter-column-containers'),
    _templateBarContainers : App.templateManager.get('dataset/filter/popup/filter-bar-containers'),
    _templateLineContainers : App.templateManager.get('dataset/filter/popup/filter-line-containers'),
    _templatePieContainers : App.templateManager.get('dataset/filter/popup/filter-pie-containers'),
    _templateMapContainers : App.templateManager.get('dataset/filter/popup/filter-map-containers'),

    initialize : function (options) {
        this.filterOptions = options.filterOptions;
    },

    _renderZones : function () {
        switch (this.type) {
            case 'table':
                this._renderTableContainers();
                this._renderTableDimensions();
                break;
            case 'column':
                this._renderColumnContainers();
                this._renderColumnDimensions();
                break;
            case 'bar':
                this._renderBarContainers();
                this._renderBarDimensions();
                break;
            case 'line':
                this._renderLineContainers();
                this._renderLineDimensions();
                break;
            case 'pie':
                this._renderPieContainers();
                this._renderPieDimensions();
                break;
            case 'map':
            case 'mapbubble':
                this._renderMapContainers();
                this._renderMapDimensions();
                break;
        }
    },

    _renderExternalContainer : function () {
        this.$filterContainer = $(this._templateExternalContainer());
        this.$el.append(this.$filterContainer);

        return this;
    },

    _renderTableContainers : function () {
        this.$filterZonesContainers = $(this._templateTableContainers());
        this.$filterContainer.append(this.$filterZonesContainers);
        this._adjustingLeftContainer();

        return this;
    },

    _renderColumnContainers : function () {
        this.$filterZonesContainers = $(this._templateColumnContainers());
        this.$filterContainer.append(this.$filterZonesContainers);

        return this;
    },

    _renderBarContainers : function () {
        this.$filterZonesContainers = $(this._templateBarContainers());
        this.$filterContainer.append(this.$filterZonesContainers);

        return this;
    },

    _renderLineContainers : function () {
        this.$filterZonesContainers = $(this._templateLineContainers());
        this.$filterContainer.append(this.$filterZonesContainers);

        return this;
    },

    _renderPieContainers : function () {
        this.$filterZonesContainers = $(this._templatePieContainers());
        this.$filterContainer.append(this.$filterZonesContainers);

        return this;
    },

    _renderMapContainers : function () {
        this.$filterZonesContainers = $(this._templateMapContainers());
        this.$filterContainer.append(this.$filterZonesContainers);

        return this;
    },

    _renderTableDimensions : function () {
        var leftZoneContext = {dims : this.model.getLeftDimensions()};
        var topZoneContext = {dims : this.model.getTopDimensions()};
        var fixedZonecontext = {dims : this.model.getFixedDimensions()};
        _.each(leftZoneContext.dims, function (dim) {
            this._createDimension(dim, '#div-left-dimensions');
        }, this);
        _.each(topZoneContext.dims, function (dim) {
            this._createDimension(dim, '#div-top-dimensions');
        }, this);
        _.each(fixedZonecontext.dims, function (dim) {
            this._createDimension(dim, '#div-fixed-dimensions');
        }, this);

        return this;
    },

    _renderColumnDimensions : function () {
        var horizontalDim = this.model.getHorizontalDimension();
        var columnsDim = this.model.getColumnsDimension();
        var fixedZonecontext = {dims : this.model.getFixedDimensions()};
        this._createDimension(horizontalDim, '#div-dimension-long1');
        this._createDimension(columnsDim, '#div-dimension-long2');
        _.each(fixedZonecontext.dims, function (dim) {
            this._createDimension(dim, '#div-fixed-dimensions');
        }, this);

        return this;
    },

    _renderBarDimensions : function () {
        var horizontalDim = this.model.getHorizontalDimension();
        var columnsDim = this.model.getColumnsDimension();
        var fixedZonecontext = {dims : this.model.getFixedDimensions()};
        this._createDimension(horizontalDim, '#div-dimension-long1');
        this._createDimension(columnsDim, '#div-dimension-long2');
        _.each(fixedZonecontext.dims, function (dim) {
            this._createDimension(dim, '#div-fixed-dimensions');
        }, this);

        return this;
    },

    _renderLineDimensions : function () {
        var horizontalDim = this.model.getHorizontalDimension();
        var linesDim = this.model.getLinesDimension();
        var fixedZonecontext = {dims : this.model.getFixedDimensions()};
        this._createDimension(horizontalDim, '#div-dimension-long1');
        this._createDimension(linesDim, '#div-dimension-long2');
        _.each(fixedZonecontext.dims, function (dim) {
            this._createDimension(dim, '#div-fixed-dimensions');
        }, this);

        return this;
    },

    _renderPieDimensions : function () {
        var sectorsDim = this.model.getSectorsDimension();
        var fixedZonecontext = {dims : this.model.getFixedDimensions()};
        this._createDimension(sectorsDim, '#div-dimension-long1');
        _.each(fixedZonecontext.dims, function (dim) {
            this._createDimension(dim, '#div-fixed-dimensions');
        }, this);

        return this;
    },

    _renderMapDimensions : function () {
        var mapDim = this.model.getMapDimension();
        var fixedZonecontext = {dims : this.model.getFixedDimensions()};
        this._createDimension(mapDim, '#div-dimension-long1');
        _.each(fixedZonecontext.dims, function (dim) {
            if (dim.type === "GEOGRAPHIC_DIMENSION") {
                this._createDimension(dim, '#div-fixed-dimensions');
            } else {
                this._createDimensionStatic(dim, '#div-fixed-dimensions');
            }
        }, this);
        return this;
    },

    events : {
        "click #close" : "close",
        "click #button-options" : "save",
        "click #button-cancel-filter" : "close",

        "click .div-dimension-short" : "_handleClickDim",
        "click .div-dimension-short-static" : "_handleClickDim",

        "dragstart .div-dimension-short" : "_handleDragstart",
        "selectstart .div-dimension-short" : "_handleSelectstart",
        "dragover .div-dimension-short" : "_handleDragover",
        "dragleave .div-dimension-short" : "_handleDragleave",
        "dragend .div-dimension-short" : "_handleDragend",

        "dragenter .div-dimension-container" : "_handleDragenter",
        "dragover .div-dimension-container" : "_handleDragover",
        "dragleave .div-dimension-container" : "_handleDragleave",
        "dragend .div-dimension-container" : "_handleDragend",
        "drop .div-dimension-container" : "_handleDrop",

        "dragenter .div-dimension-long" : "_handleDragenter",
        "dragover .div-dimension-long" : "_handleDragover",
        "dragleave .div-dimension-long" : "_handleDragleave",
        "dragend .div-dimension-long" : "_handleDragend",
        "drop .div-dimension-long" : "_handleDrop",

        "dragenter .div-dimension-short" : "_handleDragenter",
        "drop .div-dimension-short" : "_handleDrop",

        "click #filter-container" : "_handleCollapseCategories"
    },

    _handleClickDim : function (e) {
        return false;
    },

    _handleDragstart : function (e) {
        var $elem = $(e.currentTarget);
        $elem.addClass("shaded");
        e.originalEvent.dataTransfer.effectAllowed = 'move';
        e.originalEvent.dataTransfer.setData('Text', $elem.attr("id"));

        return true;
    },

    _handleSelectstart : function (e) {
        var elem = e.currentTarget;
        elem.dragDrop();
        return true;
    },

    _handleDragover : function (e) {
        var $elem = $(e.currentTarget);
        if ($elem.hasClass('div-dimension-short')) {
            $elem.addClass("highlight-short");
        } else {
            $elem.addClass("highlight-long");
        }
        e.originalEvent.dataTransfer.dropEffect = 'move';

        return false;
    },

    _handleDragleave : function (e) {
        var elem = e.currentTarget;
        this._removeHighlights(elem);

        return false;
    },

    _handleDragend : function (e) {
        // IDEA: We shouldn't use jQuery selector for this. There are dimension objects.
        var filterView = this;
        var dimensions = $('.div-dimension-short').get();
        $.each(dimensions, function (idx, elem) {
            $(elem).removeClass("shaded");
            filterView._removeHighlights(elem);
        });

        return false;
    },

    _handleDragenter : function (e) {
        return false;
    },

    _handleDrop : function (e) {
        var elem = e.currentTarget;
        var oldEleid = e.originalEvent.dataTransfer.getData("Text");
        var oldDimension = $('#' + oldEleid).get(0);
        var movementOptions = this._detectMovementAndElementsToMove(elem);
        var targetDimension = movementOptions.targetDimension;
        var newParent = movementOptions.newParent;
        if (movementOptions.swapFlag) {
            this.model.swapDimensions($(oldDimension).data('number'), $(targetDimension).data('number'));
        } else {
            this.model.changeDimensionZone($(oldDimension).data('number'), $(newParent).data('zone'));
        }
        this._removeHighlights(elem);
        this.render();

        return false;
    },

    _handleWillExpandCategories : function (who) {
        _.each(this._dimensionViews, function (dimensionView) {
            if (dimensionView !== who) {
                dimensionView.collapseCategories();
            }
        });

        return false;
    },

    _handleCollapseCategories : function () {
        _.each(this._dimensionViews, function (dimensionView) {
            dimensionView.collapseCategories();
        });

        return false;
    },


    /**
     * Detects the targetDimension and the new parent in a drop
     * @param {string} elemDestiny The element over which we made the drop
     */
    _detectMovementAndElementsToMove : function (elemDestiny) {
        var swapFlag = 1;
        var newParent = null;
        var targetDimension = null;
        // This case is an APPEND (but if it is a chart could be a swap) -> In the zone itself
        if ($(elemDestiny).hasClass('div-dimension-long') || $(elemDestiny).hasClass('div-dimension-container')) {
            newParent = elemDestiny;
            if (this.type === 'table') {
                swapFlag = 0;
                targetDimension = null;
            }
            else {
                targetDimension = $(newParent).children('.div-dimension-short');
            }
        }
        // Calculating the new Parent and the targe dimension
        else {
            newParent = $(elemDestiny).parents('.div-dimension-long, .div-dimension-container').get(0);
            targetDimension = $(elemDestiny).get(0);
        }
        var toret = {};
        toret.swapFlag = swapFlag;
        toret.newParent = newParent;
        toret.targetDimension = targetDimension;

        return toret;
    },

    _removeHighlights : function (elem) {
        $(elem).removeClass("highlight-long");
        $(elem).removeClass("highlight-short");
    },

    _createDimension : function (dim, zoneId) {
        // TODO: Implement Test
        var $zone = $(zoneId);
        var tempEl = $("<div id='div-dimension-short" + dim.number + "' class='div-dimension-short' draggable='true'  data-number='" + dim.number + "'/>").appendTo($zone);
        var tempDimensionView = new App.widget.filter.FilterDimensionView({model : this.model, el : tempEl, zone : $zone.data("zone") });
        tempDimensionView.render(dim);
        
        // IDEA: Is an array the best datastructure?
        this._dimensionViews.push(tempDimensionView);
    },

    _createDimensionStatic : function (dim, zoneId) {
        var $zone = $(zoneId);
        var tempEl = $("<div id='div-dimension-short" + dim.number + "' class='div-dimension-short-static' draggable='false'  data-number='" + dim.number + "'/>").appendTo($zone);
        var tempDimensionView = new App.widget.filter.FilterDimensionView({model : this.model, el : tempEl, zone : $zone.data("zone") });
        tempDimensionView.render(dim);
        
        // IDEA: Is an array the best datastructure?
        this._dimensionViews.push(tempDimensionView);
    },

    _addDimensionListeners : function () {
        var filterView = this;
        _.each(this._dimensionViews, function (dimensionView) {
            dimensionView.on('willExpandCategories', filterView._handleWillExpandCategories, filterView);
        });
    },

    _adjustingLeftContainer : function () {
        var $filterContainer = $("#filter-container");
        var $leftDimensions = $("#div-left-dimensions");
        var $topDimensions = $("#div-top-dimensions");
        var filterContainerTop = $filterContainer.offset().top;
        var filterContainerHeight = $filterContainer.height();
        var filterContainerBottom = filterContainerTop + filterContainerHeight;

        var bottomMargin = 25;
        var topDimensionsTop = $topDimensions.offset().top;
        var leftDimensionsHeight = filterContainerBottom - topDimensionsTop - bottomMargin;

        /* Adjunting the height */
        $leftDimensions.css("width", leftDimensionsHeight);
        $leftDimensions.css("top", topDimensionsTop - filterContainerTop + leftDimensionsHeight + 3);
    },

    _initializeTmpFilterOptions : function () {
        this.model = this.filterOptions.clone();
        var self = this;

        this.filterOptions.on("selectedCategoriesRestriction", function (args) {
            self.model.setSelectedCategoriesRestriction(args.restriction);
        });
        this.filterOptions.on("zoneLengthRestriction", function (args) {
            self.model.setZoneLengthRestriction(args.restriction);
        });
    },

    _destroyTmpFilterOptions : function () {
        this.filterOptions.off("selectedCategoriesRestriction");
        this.filterOptions.off("zoneLengthRestriction");

        this.model = null;
    },

    /**
     * We have change the visualization
     */
    launch : function (type) {
        this._initializeTmpFilterOptions();
        this.render(type);
    },

    /**
     * Launches the filters box and adds the events
     * @param {string} type The type of the visual-element
     */
    render : function (type) {
        if (this.$filterContainer) {
            this.$filterContainer.remove();
        }
        this._dimensionViews = [];
        this._renderExternalContainer();
        if (type) {
            this.type = type;
        }
        this._renderZones();
        this._addDimensionListeners();
    },


    /**
     * Saves the filters and closes the filters box
     */
    save : function () {
        this.$filterContainer.remove();
        this.filterOptions.reset(this.model);
        this._destroyTmpFilterOptions();
        this.trigger('saveFilter');
    },


    /**
     * Restores the old filters and closes the filters box
     */
    close : function () {
        this._destroyTmpFilterOptions();
        this.$filterContainer.remove();
        this.trigger('closeFilter');
    }


});


