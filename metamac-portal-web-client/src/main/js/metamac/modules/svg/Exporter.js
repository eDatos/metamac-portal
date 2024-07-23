(function () {
    "use strict";

    App.namespace("App.svg.Exporter");

    App.svg.Exporter = function () {
    };

    App.svg.Exporter.prototype = {

        sanitizeSvg: function (svg) {
            const regex = /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]?(?:\.[0-9]+)?)\s*\)/;
            const found = svg.match(regex);
            if (found) {
                // This conversion is enough for our purposes because this come mainly for a previous highcharts conversion that always output 1, so we can safely ignore it
                svg = svg.replace(found[0], 'rgb('+ found[1] + ', '+ found[2] + ', '+ found[3] + ')');
            }
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
                .replace(/<\/svg>.*?$/, '</svg>') // any HTML added to the container after the SVG (#894)
                .replace(/&nbsp;/g, '\u00A0') // no-break space
                .replace(/&shy;/g, '\u00AD') // soft hyphen
                .replace(/fill="#FFFFFF"/g, 'fill="#FFFFFF"') //set background to white, this is a very bad hack
                .replace(new RegExp(App.Constants.colors.hiddenText, "g"), '#909090'); // Ugly hack to style correctly the credits
            return svg;
        },

        submitInDynamicForm: function (options) {
            var $form = $('<form action="' + options.url + '" method="POST">');
            _.each(options.data, function (value, key) {
                var $input = $('<input type="hidden">');
                $input.attr('name', key);
                $input.attr('value', value);
                $form.append($input);
            });
            $form.submit();
        },

        _insertStyleInSvg: function (svg, css) {
            var firstCloseIndex = svg.indexOf(">") + 1;
            var style = '<defs><style type="text/css"><![CDATA[' + css + ']]></style></defs>';
            return svg.substring(0, firstCloseIndex) + style + svg.substring(firstCloseIndex);
        },

        addStyleAsync: function (svg) {
            var self = this;
            var response = new $.Deferred();
            var request = $.get(App.endpoints["statistical-visualizer"] + "/client/map.css");
            $.when(request).done(function (css) {
                var stiledSvg = self._insertStyleInSvg(svg, css);
                response.resolveWith(null, [stiledSvg]);
            });
            return response.promise();
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
        },

        sanitizeSvgElement: function (svgEl) {
            var svgContent = svgEl[0].outerHTML;
            return this.sanitizeSvg(svgContent);
        },

        // Deprecated
        processSvgElement: function (svgEl, type) {
            var sanitizedSvg = this.sanitizeSvgElement(svgEl);

            var self = this;
            this.addStyleAsync(sanitizedSvg).done(function (svg) {
                self.submitInDynamicForm({
                    url: App.context + "/chart/export",
                    data: {
                        filename: 'chart',
                        type: self.mimeTypeFromType(type),
                        width: $el.width(),
                        scale: 2,
                        svg: svg
                    }
                });
            });

        }

    };

}());