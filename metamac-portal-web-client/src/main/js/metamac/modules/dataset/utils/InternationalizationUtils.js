(function () {
    "use strict";

    App.namespace("App.InternationalizationUtils");

    App.InternationalizationUtils = {

        initializeLocalesIndex: function () {
            if (!this.localesIndex || !this.localesIndex.primary) {
                this.localesIndex = {
                    primary: I18n.locale,
                    secondary: I18n.defaultLocale
                };
            }
        },

        localizeLabel: function (labels) {
            if (labels) {
                this.initializeLocalesIndex();

                var self = this;
                var label;
                if (this.localesIndex.primary) {
                    label = _.find(labels, function (label) {
                        return label.lang == self.localesIndex.primary;
                    });
                    if (label) label = label.value;
                }
                if (!label && this.localesIndex.secondary) {
                    label = _.find(labels, function (label) {
                        return label.lang == self.localesIndex.secondary;
                    });
                    if (label) label = label.value;
                }
                if (!label) {
                    label = _.first(labels).value
                }

                return label;
            }
        }
    };
}());
