(function () {
    "use strict";

    var Point = App.Table.Point;

    App.namespace("App.Table.SpinnerZone");

    App.Table.SpinnerZone = function (options) {
        App.Table.Zone.prototype.initialize.apply(this, arguments);
        this.initialize(options);
    };

    _.extend(App.Table.SpinnerZone.prototype, App.Table.Zone.prototype);

    App.Table.SpinnerZone.prototype.initialize = function (options) {
        this.speed = options.speed || 0.005;
        this.spinnerSize = options.spinnerSize || 4;

        this.onAjax = false;
        _.bindAll(this, 'ajaxStart', 'ajaxStop', 'loop');

        $(document).on('ajaxStart.spinnerZone', this.ajaxStart);
        $(document).on('ajaxStop.spinnerZone', this.ajaxStop);
    };

    App.Table.SpinnerZone.prototype.destroy = function () {
        $(document).off('.spinnerZone');
    };

    App.Table.SpinnerZone.prototype.ajaxStart = function () {
        if (!this.onAjax) {
            this.onAjax = true;
            this.loop();
        }
    };

    App.Table.SpinnerZone.prototype.ajaxStop = function () {
        this.onAjax = false;
        this.clear();
    };

    App.Table.SpinnerZone.prototype.loop = function () {
        if (this.onAjax) {
            this.repaint();
            window.requestAnimationFrame(this.loop);
        }
    };

    App.Table.SpinnerZone.prototype.repaint = function () {
        this.ctx.save();

        var time = new Date().getTime();
        this.clear();

        for (var i = 0; i < this.spinnerSize; i++) {
            var t = (time * this.speed - i * Math.PI / this.spinnerSize) % Math.PI;
            var alpha = Math.sin(t);

            this.ctx.fillStyle = "rgba(15, 91, 149, " + alpha + ")";
            var point = this.absolutePoint2RelativePoint(new Point(20 * i, 10));
            this.ctx.fillRect(point.x, point.y, 10, 10);
        }
        this.ctx.restore();
    };

}());
