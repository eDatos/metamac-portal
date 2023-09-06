(function () {
    "use strict";

    App.i18n = {

        localizeText : function (multiLocaleText) {
            if (multiLocaleText) {
                var text = _.findWhere(multiLocaleText.text, {lang : I18n.locale});
                if (!text) {
                    text = _.findWhere(multiLocaleText.text, {lang : I18n.defaultLocale});
                }
                if (!text) {
                    text = _.first(multiLocaleText.text);
                }

                return text.value;
            }
        },

        startsWithVowelOrH: function(string) {
            var vowelAndHRegex = '^[aieouhAIEOUH].*';
            return string.match(vowelAndHRegex);
        }

    }
}());