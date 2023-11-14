(function () {
    "use strict";

    App.namespace("App.util.ObjectUtils");

    App.util.ObjectUtils = {};

    App.util.ObjectUtils.deepExtend = function (target, source) {
        for (const key in source) {
            if ($.isPlainObject(source[key]) && key in target && $.isPlainObject(target[key])) {
                this.deepExtend(target[key], source[key]);
            } else {
                target[key] = source[key];
            }
        }
    };
}());
