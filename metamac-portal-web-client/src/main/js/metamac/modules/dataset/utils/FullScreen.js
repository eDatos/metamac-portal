(function () {
    "use strict";

    App.namespace("App.FullScreen");

    App.FullScreen = function (options) {
        this.initialize(options);
    };

    App.FullScreen.prototype = {

        FS_RESIZE_DELAY : 300,

        events : {
            change : 'fullscreenchange webkitfullscreenchange mozfullscreenchange MSFullscreenChange',
            error : 'mozfullscreenerror webkitfullscreenerror MSFullscreenError'
        },

        initialize : function (options) {
            options || (options = {});
            if (_.has(options, 'container')) {
                this.setContainer(options.container);
            }
            this.$document = $(document);
            _.bindAll(this, "exitFullScreen", "_keydown", "_didExitFullScreen");
        },

        setContainer : function (container) {
            if (container instanceof $) {
                this.$container = container;
            } else {
                this.$container = $(container);
            }
            this.container = this.$container[0];
        },

        getContainer : function () {
            return this.container;
        },

        get$Container : function () {
            return this.$container;
        },

        _getRequestFullScreen : function () {
            // IE11 Bug on fullscreen iframe https://connect.microsoft.com/IE/feedback/details/838286/ie-11-incorrectly-reports-dom-element-sizes-in-fullscreen-mode-when-fullscreened-element-is-within-an-iframe
            var msRequest;
            if (App.config["widget"]) {
                msRequest = undefined;
            } else {
                msRequest = this.getContainer().msRequestFullscreen || this.getContainer().msRequestFullScreen;
            }
            return this.getContainer().requestFullscreen
                || this.getContainer().requestFullScreen
                || this.getContainer().webkitRequestFullscreen
                || this.getContainer().mozRequestFullscreen
                || this.getContainer().webkitRequestFullScreen
                || this.getContainer().mozRequestFullScreen
                || msRequest;
//              || this._popUpFullScreen; 
        },

        _getRequestExitFullScreen : function () {
            // IE11 Bug on fullscreen iframe https://connect.microsoft.com/IE/feedback/details/838286/ie-11-incorrectly-reports-dom-element-sizes-in-fullscreen-mode-when-fullscreened-element-is-within-an-iframe
            var msRequest;
            if (App.config["widget"]) {
                msRequest = undefined;
            } else {
                msRequest = document.msExitFullscreen || document.msCancelFullScreen;
            }
            return document.exitFullscreen ||
                document.cancelFullscreen ||                
                document.mozCancelFullScreen ||
                document.mozExitFullscreen ||
                document.webkitCancelFullScreen ||
                document.webkitExitFullscreen ||
                msRequest;
//              || window.close;
        },

        browserHasFullScreenSupport : function () {
            var requestFS = this._getRequestFullScreen();
            return !_.isUndefined(requestFS);
        },

        _enterFullScreenSupport : function () {
            this._getRequestFullScreen().call(this.getContainer());
            this._setFullScreenCss();
        },

        _enterFullScreenNoSupport : function () {
            this._setFullScreenCss();
        },

        enterFullScreen : function () {
            var self = this;
            this.trigger('willEnterFullScreen');
            if (this.browserHasFullScreenSupport()) {
                var fn = function () {
                    setTimeout(function () {
                        self.trigger('didEnterFullScreen');
                        self._addExitFullScreenListeners();
                    }, this.FS_RESIZE_DELAY); // time out for wait browser animation
                };
                self.$document.one(self.events.change, fn);
                self._enterFullScreenSupport();
            } else {
                self._enterFullScreenNoSupport();
                self._addExitFullScreenListeners();
                self.trigger('didEnterFullScreen');
            }
        },

        refreshFullScreenListeners: function() {
            this._removeExitFullScreenListeners();
            this._addExitFullScreenListeners();
        },

        _addExitFullScreenListeners : function () {
            if (this.browserHasFullScreenSupport()) {
                this.$document.on(this.events.change, this._didExitFullScreen);
                this.$document.on(this.events.error, this._didExitFullScreen);
            } else {
                this.$document.on('keydown', this._keydown);
            }
        },

        _removeExitFullScreenListeners : function () {
            this.$document.off(this.events.change, this._didExitFullScreen);
            this.$document.off(this.events.error, this._didExitFullScreen);
            this.$document.off('keydown', this._keydown);
        },

        _keydown : function (e) {
            if (e.which === 27) {  //ESC code
                this.exitFullScreen();
            }
        },

        exitFullScreen : function () {
            this.trigger('willExitFullScreen');
            if (this.browserHasFullScreenSupport()) {
                this._exitFullScreenSupport();
            } else {
                this._exitFullScreenNoSupport();
            }
        },

        _exitFullScreenSupport : function () {
            var method = this._getRequestExitFullScreen();
            method.call(document);
        },

        _exitFullScreenNoSupport : function () {
            this._didExitFullScreen();
        },

        _didExitFullScreen : function () {
            var self = this;
            setTimeout(function () {
                self._removeFullScreenCss();
                self._removeExitFullScreenListeners();
                self.trigger('didExitFullScreen');
            }, this.FS_RESIZE_DELAY);
        },

        _setFullScreenCss : function () {
            if (!this.browserHasFullScreenSupport()) {
                this.get$Container().addClass('full-screen-no-support');
                $('.navbar-fixed-top').css('position', 'static');
            } else {
                this.get$Container().addClass('full-screen');
            }
        },

        _removeFullScreenCss : function () {
            if (!this.browserHasFullScreenSupport()) {
                this.get$Container().removeClass('full-screen-no-support');
                $('.navbar-fixed-top').css('position', 'fixed');
            } else {
                this.get$Container().removeClass('full-screen');
            }
        },

        isInFullScreen: function() {
            var fullscreenElement = this._getFullscreenElement();
            return !!fullscreenElement && this.get$Container()[0] === fullscreenElement;
        },
        
        _getFullscreenElement: function() {
            return document.fullscreenElement || /* Standard syntax */
                document.webkitFullscreenElement || /* Chrome, Safari and Opera syntax */
                document.mozFullScreenElement ||/* Firefox syntax */
                document.msFullscreenElement; /* IE/Edge syntax */
        }

    };

    _.extend(App.FullScreen.prototype, Backbone.Events);

}());
