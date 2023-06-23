(function () {
    "use strict";

    App.namespace("App.Table.ScrollManager");

    var Point = App.Table.Point,
        Rectangle = App.Table.Rectangle;

    var ScrollManager = App.Table.ScrollManager = function (view) {
        this.view = view;
        this.canvas = view.canvas;
        this.$canvas = $(this.canvas);
        this.lastPoint = undefined;
        this.$document = $(document);

        this.eventNamespace = ".scrollManager";

        _.bindAll(this, "mousemove", "mousedown", "mouseup", "mousewheel", "dblclick", "mouseleave");

        this.bindEvents();
    };

    ScrollManager.prototype.destroy = function () {
        this.$canvas.removeClass('move move-updown col-resize move-lefright');
        this.unbindEvents();
    };

    ScrollManager.prototype.pointFromEvent = function (e) {
        var point;
        var touchPoint = this.pointFromTouchEvent(e);
        if (touchPoint) {
            point = touchPoint;
        } else {
            point = this.pointFromMouseEvent(e);
        }
        return point;
    };

    ScrollManager.prototype.pointFromMouseEvent = function (e) {
        var offset = this.$canvas.offset();
        var x = e.pageX - offset.left,
            y = e.pageY - offset.top;
        return new Point(x, y);
    };

    ScrollManager.prototype.pointFromTouchEvent = function (e) {
        if (e.targetTouches && e.targetTouches.length === 1) {
            var offset = this.$canvas.offset();
            var touch = e.targetTouches[0];
            return new Point(touch.pageX - offset.left, touch.pageY - offset.top);
        }
    };

    ScrollManager.prototype.bindEvents = function () {
        this.bindMouseEvents();
        this.bindTouchEvents();
    };

    ScrollManager.prototype.bindTouchEvents = function () {
        var self = this;

        this.canvas.addEventListener('touchmove', function (e) {
            self.mousemove(e);
        }, false);

        this.canvas.addEventListener('touchstart', function (e) {
            self.mousedown(e);
        }, false);

        this.canvas.addEventListener('touchend', function (e) {
            self.mouseup(e);
        }, false);
    };

    ScrollManager.prototype.bindMouseEvents = function () {
        // mouse movements
        this.$canvas.on("mousedown" + this.eventNamespace, this.mousedown);
        this.$canvas.on("dblclick" + this.eventNamespace, this.dblclick);
        this.$canvas.on('mousemove' + this.eventNamespace, this.mousemove);
        this.$canvas.on('mouseleave' + this.eventNamespace, this.mouseleave);
        this.$canvas.on('click' + this.eventNamespace, this.click);

        // mouse wheel
        this.$canvas.on('mousewheel', this.mousewheel);
    };

    ScrollManager.prototype.unbindEvents = function () {
        this.$document.off(this.eventNamespace);
    };

    ScrollManager.prototype.mousemove = function (e) {
        var current = this.pointFromEvent(e);
        this.changeCursor(current);

        if (this.lastPoint) {
            var distance = current.distance(this.lastPoint);
            if (this.lastZone === "rightScrollZone-scrollBar") {
                distance = distance.negate();
                distance.x = 0;
                this.view.scrollDistance(distance);
            } else if (this.lastZone === "bottomScrollZone-scrollBar") {
                distance = distance.negate();
                distance.y = 0;
                this.view.scrollDistance(distance);
            } else if (this.lastZone === "leftHeaderZone") {
                distance.x = 0;
                this.view.move(distance);
            } else if (this.lastZone === "topHeaderZone") {
                distance.y = 0;
                this.view.move(distance);
            } else if (this.lastZone === "bodyZone") {
                this.view.move(distance);
            } else if (this.lastZone === "leftHeaderZone-separator") {
                this.view.resizeLeftHeaderColumnWidth(this.lastLeftColumnSeparator, distance);
            } else if (this.lastZone === "topHeaderZone-separator") {
                this.view.resizeColumnWidth(this.lastColumnSeparator, distance);
            }
            this.lastPoint = current;
        }

        this.view.setMousePosition(current, e);
    };

    ScrollManager.prototype.mousedown = function (e) {
        var point = this.pointFromEvent(e);
        var zone = this.view.zoneFromPoint(point);

        this.lastPoint = point;
        this.lastZone = zone;
        this.lastColumnSeparator = this.view.columnSeparatorIndex(point);
        this.lastLeftColumnSeparator = this.view.leftColumnHeaderSeparatorIndex(point);

        this.view.setLastClickZone(zone);
        var self = this;
        if (zone === "rightScrollZone") {
            self.repeatUntil(
                function () {
                    self.view.stepScroll(new Point(0, point.y));
                },
                function () {
                    return zone === self.view.zoneFromPoint(point) && point.eq(self.lastPoint);
                },
                100
            );

        } else if (zone === "bottomScrollZone") {
            self.repeatUntil(
                function () {
                    self.view.stepScroll(new Point(point.x, 0));
                },
                function () {
                    return zone === self.view.zoneFromPoint(point) && point.eq(self.lastPoint);
                },
                100
            );
        }

        this.$canvas.off('mousemove' + this.eventNamespace);
        this.$canvas.off('mouseleave' + this.eventNamespace);
        this.$document.one("mouseup" + this.eventNamespace, this.mouseup);
        this.$document.on("mousemove" + this.eventNamespace, this.mousemove);

        return false;
    };

    ScrollManager.prototype.mouseup = function (e) {
        this.lastPoint = undefined;
        this.lastZone = undefined;
        this.view.setLastClickZone(this.lastZone);
        var current = this.pointFromEvent(e);
        this.changeCursor(current);

        this.$document.off("mousemove" + this.eventNamespace);

        this.$canvas.on('mousemove' + this.eventNamespace, this.mousemove);
        this.$canvas.on('mouseleave' + this.eventNamespace, this.mouseleave);
    };

    ScrollManager.prototype.mouseleave = function (e) {
        var current = this.pointFromEvent(e);
        this.changeCursor(current);
    };

    ScrollManager.prototype.repeatUntil = function (fn, condition, ms) {
        var cfn = function () {
            if (condition()) {
                fn();
                setTimeout(cfn, ms);
            }
        };
        cfn();
    };

    ScrollManager.prototype.mousewheel = function (event, delta, deltaX, deltaY) {
        this.view.move(new App.Table.Point(deltaX * 60, deltaY * 60));
        return false;
    };

    ScrollManager.prototype.changeCursor = function (currentPoint) {

        if (!this.lastPoint) {
            var cursorClass;
            var zone = this.view.zoneFromPoint(currentPoint);
            if (zone === "bodyZone") {
                cursorClass = "move";
            } else if (zone === "leftHeaderZone") {
                cursorClass = "move-updown";
            } else if (zone === "leftHeaderZone-separator") {
                cursorClass = "col-resize";
            } else if (zone === "topHeaderZone") {
                cursorClass = "move-leftright";
            } else if (zone === "topHeaderZone-separator") {
                cursorClass = "col-resize";
            }

            if (cursorClass) {
                this.$canvas.addClass(cursorClass);
            }

            var toRemove = _.without(["move", "move-updown", "move-leftright", "col-resize"], cursorClass).join(" ");
            this.$canvas.removeClass(toRemove);
        }
    };

    ScrollManager.prototype.dblclick = function (e) {
        var point = this.pointFromEvent(e);
        this.view.setActiveCell(point);
    };

}());