(function () {
    "use strict";

    var Point = App.Table.Point;

    App.namespace("App.Table.KeyboardManager");

    App.Table.KeyboardManager = function (options) {
        this.init(options);
    };

    App.Table.KeyboardManager.prototype = {
        init : function (options) {
            this.view = options.view;
            this.speed = 15;
            this.wait = 1000 / 60;

            _.bindAll(this, "loop", "arrow", "home", "end", "pageup", "pagedown");
            this.bindEvents();
        },

        destroy : function () {
            this.unbindEvents();
        },

        bindEvents : function () {
            var self = this;
            var $document = $(document);
            $document.on('keydown.up keydown.right keydown.down keydown.left', this.arrow);
            $document.on('keydown.home', this.home);
            $document.on('keydown.end', this.end);
            $document.on('keydown.pageup', this.pageup);
            $document.on('keydown.pagedown', this.pagedown);
        },

        unbindEvents : function () {
            var $document = $(document);
            $document.unbind('keydown.up keydown.right keydown.down keydown.left', this.arrow);
            $document.unbind('keydown.home', this.home);
            $document.unbind('keydown.end', this.end);
            $document.unbind('keydown.pageup', this.pageup);
            $document.unbind('keydown.pagedown', this.pagedown);
        },

        isArrowKeyPressed : function () {
            return keydown.up || keydown.right || keydown.down || keydown.left;
        },

        home : function () {
            this.view.moveToBegin();
            return false;
        },

        end : function () {
            this.view.moveToEnd();
            return false;
        },

        pageup : function () {
            this.view.pageup();
            return false;
        },

        pagedown : function (){
            this.view.pagedown();
            return false;
        },

        arrow : function () {
            if(!this.timer) {
                this.loop();
            }
            return false;
        },

        loop : function () {
            if(this.isArrowKeyPressed()) {
                var distance = new Point(0, 0);
                if(keydown.left) {
                    distance.x = this.speed;
                } else if(keydown.right) {
                    distance.x = -this.speed;
                }

                if(keydown.up) {
                    distance.y = this.speed;
                } else if(keydown.down) {
                    distance.y = -this.speed;
                }
                this.view.move(distance);

                this.timer = setTimeout(this.loop, this.wait);
            }else{
                this.timer = undefined;
            }
        }
    };

}());
