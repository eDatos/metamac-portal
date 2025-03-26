(function () {
    "use strict";

    App.namespace("App.svg.Exporter");

    App.svg.Exporter = function () {
    };

    App.svg.Exporter.prototype = {

        sanitizeSvg: function (svg) {
            svg = svg
                // This conversion is enough for our purposes because we can change the color format in the places where it really matters via echarts options.
                .replaceAll(/rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]?(?:\.[0-9]+)?)\s*\)/g, 'rgb($1, $2, $3)')
                .replace(/<text([^>]*)font-size: *([0-9]+)px/g, function (match, otherAttributes, fontSize) {
                    return '<text' + otherAttributes + 'font-size:' + (fontSize > 1 ? +fontSize - 1 : fontSize) + 'px';
                })
                .replace(/<text([^>]*text-anchor="start"[^>]*)y="([0-9.]+)"/g, function (match, otherAttributes, yValue) {
                    return '<text' + otherAttributes + 'y="' + (+yValue + 2) + '"';
                })
                .replaceAll(" fill=\"transparent\"", " fill=\"none\"");
            return svg;
        },

        mimeTypeFromType: function (type) {
            var mime;
            if (type === "svg") {
                mime = "image/svg+xml";
            } else if (type === "pdf") {
                mime = "application/pdf";
            } else {
                mime = "image/png";
            }
            return mime;
        }
    };

}());
