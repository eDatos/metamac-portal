(function () {
    App.namespace("App.Map.MapModel");

    App.Map.MapModel = Backbone.Model.extend({
        defaults: {
            minScale: 0.1,
            maxScale: 320,
            scaleFactor: 2,
            currentScale: 1,
            oldScale: null,
            x: 0,
            y: 0,
            animationDelay: 0,
            minValue: 0,
            maxValue: 40,
            values: [1],
            minRangesNum: 1,
            maxRangesNum: 10,
            currentRangesNum: 4,
            mapType: 'map'
        },

        zoomExit: function () {
            this.set({ currentScale: 2, x: 0, y: 0, animationDelay: 1000 });
            this.trigger('zoomExit');
        },

        zoomIn: function () {
            var currentScale = this.get("currentScale");
            var scaleFactor = this.get("scaleFactor");

            var newScale = currentScale * scaleFactor;

            if (this._isRequestedZoomAllowed(1)) {
                this.set({ currentScale: newScale, oldScale: currentScale, animationDelay: 500 });
            }
        },

        zoomOut: function () {
            var currentScale = this.get("currentScale");
            var scaleFactor = this.get("scaleFactor");

            var newScale = currentScale / scaleFactor;

            if (this._isRequestedZoomAllowed(-1)) {
                this.set({ currentScale: newScale, oldScale: currentScale, animationDelay: 500 });
            }
        },

        zoomTo: function (newScale) {
            if (newScale <= this.get("maxScale") && newScale >= this.get("minScale")) {
                this.set({ currentScale: newScale, oldScale: this.get("currentScale"), animationDelay: 500 });
            }
        },

        zoomMouseWheel: function (options) {
            var currentScale = this.get("currentScale");
            var newScale = Math.pow(2, options.delta) * currentScale;

            if (newScale > this.get("maxScale")) {
                newScale = this.get("maxScale");
            }

            if (newScale < this.get("minScale")) {
                newScale = this.get("minScale");
            }

            var x = this.get("x") - this._scaleMovement(options.xOffset, currentScale) + this._scaleMovement(options.xOffset, newScale);
            var y = this.get("y") - this._scaleMovement(options.yOffset, currentScale) + this._scaleMovement(options.yOffset, newScale);

            this.set({ currentScale: newScale, oldScale: currentScale, x: x, y: y, animationDelay: 0 });
        },

        currentZoomLevel: function () {
            var currentScale = this.get("currentScale");
            return this._log2(currentScale);
        },

        numZoomLevels: function () {
            var maxScale = this.get("maxScale");
            return this._log2(maxScale);
        },

        _isRequestedZoomAllowed: function (delta) {
            var currentScale = this.get("currentScale");
            var maxScale = this.get("maxScale");
            var minScale = this.get("minScale");
            if (delta > 0) {
                return (currentScale < maxScale);
            } else {
                return (currentScale > minScale);
            }
        },

        _scaleMovement: function (value, newScale) {
            var currentScale = newScale || this.get("currentScale");
            return value / currentScale;
        },

        _log2: function (val) {
            return Math.log(val) / Math.log(2);
        },

        // Taken from https://github.com/jfsiii/d3-quantile/blob/master/index.js
        _quantile: function (values, p) {
            var H = (values.length - 1) * p + 1,
                h = Math.floor(H),
                v = +values[h - 1],
                e = H - h;
            return e ? v + e * (values[h] - v) : v;
        },

        _createQuantiles: function (values, currentRangesNum, numberOfDecimals) {
            var self = this;
            self.values = _.sortBy(values);
            self.currentRangesNum = currentRangesNum;
            return _.map(_.range(1, currentRangesNum), function (value, key, list) {
                if (value !== 0) {
                    var quantile = self._quantile(self.values, value / self.currentRangesNum);
                    var decimalMultiplier =  Math.pow(10, numberOfDecimals);
                    return Math.round((quantile + Number.EPSILON) * decimalMultiplier) / decimalMultiplier;
                }
            }, self);
        },

        createRangeLimits: function (numberOfDecimals) {
            var minValue = this.get("minValue");
            var maxValue = this.get("maxValue");
            var quantiles = this._createQuantiles(this.get("values"), this.get("currentRangesNum"), numberOfDecimals);

            var rangeLimits = _.flatten([minValue, quantiles, maxValue], true);
            return rangeLimits;
        }

    });

})();
