(function () {
    "use strict";

    App.namespace("App.svg.Exporter");

    App.svg.Exporter = function () {
    };

    App.svg.Exporter.prototype = {

        sanitizeSvg: function (svg) {
            // sanitize
            svg = svg
                .replace(/<text([^>]*)font-size: *([0-9]+)px/g, function (match, otherAttributes, fontSize) {
                    return '<text' + otherAttributes + 'font-size:' + (fontSize > 1 ? +fontSize - 1 : fontSize) + 'px';
                })
                .replace(/<text([^>]*text-anchor="start"[^>]*)y="([0-9.]+)"/g, function (match, otherAttributes, yValue) {
                    return '<text' + otherAttributes + 'y="' + (+yValue + 2) + '"';
                })
                .replace(/zIndex="[^"]+"/g, '')
                .replace(/isShadow="[^"]+"/g, '')
                .replace(/symbolName="[^"]+"/g, '')
                .replace(/jQuery[0-9]+="[^"]+"/g, '')
                .replace(/isTracker="[^"]+"/g, '')
                .replace(/url\([^#]+#/g, 'url(#')
                .replace(/ href=/g, ' xlink:href=')
                .replace(/\n/, ' ')
                .replace(/&nbsp;/g, '\u00A0') // no-break space
                .replace(/&shy;/g, '\u00AD') // soft hyphen
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