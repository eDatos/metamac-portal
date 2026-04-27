(function () {
    'use strict';
    
    App.namespace('App.Map.RangesView');
    
    App.Map.RangesView = Backbone.View.extend({
        _templateRanges : App.templateManager.get('dataset/map/map-ranges'),
        
        events : {
            "mousedown #draggable" : "_handleMouseDown",
            "click #line" : "_handleClick"
            // mouseup and mousemove are jQuery events atached to the document
        },
        
        initialize : function(options) {
            this._pressed = false;
            this._setUpListeners();
        },
        
        render : function() {
            this.$RangesContainer = $(this._templateRanges()); 
            this.$el.html(this.$RangesContainer);
            this._storeInitialCSSInfo();
            this._setDraggingDivPositionAndPageX();
        },
        
        destroy : function() {
            this.$el.remove();
            $(document).off('mousemove', this._handleMouseMove);
            $(document).off('mouseup', this._handleMouseUp);
            this.$el.off('mousewheel');
        },
        
        updateRanges : function() {
            this.render();
        },
        
        _setUpListeners : function() {
            _.bindAll(this, '_handleMouseMove', '_handleMouseUp', '_handleMousewheel');
            $(document).on('mousemove', this._handleMouseMove);
            $(document).on('mouseup', this._handleMouseUp);
            this.$el.on('mousewheel', this._handleMousewheel);
        },
        
        _storeInitialCSSInfo : function() {
            var minRangesNum = this.model.get("minRangesNum");
            var maxRangesNum = this.model.get("maxRangesNum");
            var numElements = maxRangesNum - minRangesNum + 1;
            this.$currentRange = $('#draggable');
            this.$rangesLine = $('#line');
            this._maxLeft = this.$rangesLine.width() /*- this.$currentRange.width()*/;
            this._increment = this._calculateIncrementPixels(this._maxLeft, numElements);
        },
        
        _calculateIncrementPixels : function(totalSize, numElements) {
            var numRanges = numElements - 1;
            return totalSize / numRanges;
        },
        
        _getDraggableDivLeft : function(){
            var currentRangesNum = this.model.get("currentRangesNum");
            return (currentRangesNum - 1) * this._increment;
        },
        
        _setDraggingDivPositionAndPageX : function() {
            this._draggableDivLeft = this._getDraggableDivLeft();
            this.$currentRange.css("left", this._draggableDivLeft);
            this._draggablePageX = this.$currentRange.offset().left;
        },
        
        _isMovementLongEnough : function(diffX) {
            var toret;
            toret = Math.abs(diffX) >= this._increment ? true : false;
            return toret;
        },

        _movingLeft : function() {
            var currentRangesNum = this.model.get("currentRangesNum");
            var minRangesNum = this.model.get("minRangesNum");
            if (currentRangesNum > minRangesNum)
                this.model.set("currentRangesNum", currentRangesNum - 1);
        },
        
        _movingRight : function() {
            var currentRangesNum = this.model.get("currentRangesNum");
            var maxRangesNum = this.model.get("maxRangesNum");
            if (currentRangesNum < maxRangesNum)
                this.model.set("currentRangesNum", currentRangesNum + 1);
        },
        
        _handleMouseDown : function(e) {
            this._pressed = true;
            this._draggablePageX = e.pageX;
            e.preventDefault();
        },
        
        _handleMouseUp : function(e) {
            this._pressed = false;
        },
        
        _handleMouseMove : function(e) {
            if (this._pressed) {
                var diffX = e.pageX - this._draggablePageX;
                if (this._isMovementLongEnough(diffX)) {
                    if (diffX > 0)
                        this._movingRight();
                    else if (diffX < 0)
                        this._movingLeft();
                }
            }
        },
        
        _handleMousewheel : function(e, delta) {
            if (delta > 0)
                this._movingRight();
            else if (delta < 0)
                this._movingLeft();  
            return false;
        },
        
        _handleClick : function(e) {
            var diffX = e.pageX - this._draggablePageX;
            if (diffX > 0) {
                this._movingRight();
            }
            else if (diffX < 0) {
                this._movingLeft();
            }
            return false;
        }
        
    });
    
})();
