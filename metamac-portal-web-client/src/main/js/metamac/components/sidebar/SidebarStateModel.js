(function () {
    "use strict";

    App.namespace("App.components.sidebar");

    App.components.sidebar.SidebarStateModel = Backbone.Model.extend({

        defaults : {
            width : 400,
            minWidth : 400,
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
