(function () {
    "use strict";

    App.namespace("App.util.ObjectUtils");

    App.util.ObjectUtils = {};

    /*
    * This method is necessary because:
    * - The method '_.extend' is not deep, which we need. It means that if we extend the object {a:{b:1}} with {a:{c:2}} we want {a:{b:1,c:2}}, but it returns {a:{c:2}}.
    * - The method '$.extend' is deep, but it also extends arrays (extending {a:[1,2,3]} with {a:[4,5]} would return {a:[4,5,3]}), and we need them to be overridden ({a:[4,5]}).
    * - Lodash could be what we need, but we are already using underscore, so it would probably be hard to include.
    * */
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
