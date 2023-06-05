
(function () {
    "use strict";

    App.namespace("App.components.scrollbuttons");

    App.components.scrollbuttons.Scrollbuttons = function (options) {
        this.initialize(options);
    };

    App.components.scrollbuttons.Scrollbuttons.prototype = {
    
        STEP_LENGTH : 100,
        ANIMATION_LENGTH : 500,
        OFFSET : 13, // Margin-left, see scrollbuttons.less @buttonWidth

        initialize : function (options) {
            this.setEl(options.el);
            this.delegate = options.delegate;
        },

        destroy : function () {
            this.$tooltip.remove();
            this._detachEvents();
        },

        _attachButtons : function() {         
            this.$wrapper.prepend('<button class="scroll-button-left" style="display:none">◀</button>');
            this.$leftButton = this.$wrapper.find('.scroll-button-left');

            this.$wrapper.append('<button class="scroll-button-right" style="display:none">▶</button');
            this.$rightButton = this.$wrapper.find('.scroll-button-right');

            this.updateButtonsVisibility();
        },

        setEl : function (el) {
            this._detachEvents();

            this.$el = $(el);
            this.$el.wrapInner('<div class="scroll-buttons"><div class="scroll-button-content-wrapper"><div class="scroll-button-content"></div></div></div>');
            this.$wrapper = this.$el.find('.scroll-buttons');
            this.$scrollContent = this.$wrapper.find('.scroll-button-content');
            this.scrollContent = this.$scrollContent[0];

            this._attachButtons();
            this._attachEvents();
        },

        updateButtonsVisibility : function() {                           
            var self = this;
            // Force to wait for DOM
            setTimeout(function() {
                if (!self._hasLeftOverflow()) {
                    self.$leftButton.fadeOut();
                } else {
                    self.$leftButton.fadeIn();
                }
                if (!self._hasRightOverflow()) {
                    self.$rightButton.fadeOut();
                } else {
                    self.$rightButton.fadeIn();
                }
            }, 0);        
        },

        _hasLeftOverflow : function() {               
            return this.$scrollContent.is(':visible') && (this._leftOverflow() > 0);
        },

        _leftOverflow : function() {            
            return -(this.scrollContent.offsetLeft - this.OFFSET);
        },

        _hasRightOverflow : function() {
            return this.$scrollContent.is(':visible') && (this.scrollContent.scrollWidth > (this.scrollContent.offsetWidth + this.OFFSET));
        },

        _attachEvents : function () {            
            var self = this;                        
            self.$leftButton.on('click', function () {                    
                if (self._hasLeftOverflow()) {
                    var currentOffset = parseInt(self.$scrollContent.css('margin-left'));
                    var newOffset = currentOffset < self._leftOverflow() ? 0 : currentOffset + self.STEP_LENGTH;
                    self._setNewOffset(newOffset);                            
                }                                      
            });
            self.$rightButton.on('click', function () { 
                if (self._hasRightOverflow()) {
                    var newOffset = parseInt(self.$scrollContent.css('margin-left')) - self.STEP_LENGTH;
                    self._setNewOffset(newOffset);                              
                }
            });

            var resize = _.debounce(_.bind(this.updateSize, this), 200);
            this.$el.on("resize", function (e) {
                e.stopPropagation();
                resize();
            });
        },

        _setNewOffset : function(newOffset) {
            var self = this;
            self.$scrollContent.animate({ 
                    'marginLeft' : newOffset + 'px'
                }, 
                self.ANIMATION_LENGTH, 
                _.bind(self.updateButtonsVisibility, self)
            ); 
        },

        _detachEvents : function () {
            if (this.$leftButton)  { this.$leftButton.off('click'); }
            if (this.$rightButton) { this.$rightButton.off('click'); }
        },        

        updateSize : function() {
            this._setNewOffset(0);
        }
    };

}());