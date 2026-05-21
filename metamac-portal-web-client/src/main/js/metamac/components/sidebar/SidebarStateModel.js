(function () {
    "use strict";

    App.namespace("App.components.sidebar");

    App.components.sidebar.SidebarStateModel = Backbone.Model.extend({

        defaults : {
            width : 375,
            minWidth : 375,
            visible : false
        },

        validate : function (attrs) {
            if (attrs.width < attrs.minWidth) {
                return "width min size is "  + attrs.minWidth;
            }
        },

        restoreDefaults : function () {
            this.set(this.defaults);
        }

    });


}());
