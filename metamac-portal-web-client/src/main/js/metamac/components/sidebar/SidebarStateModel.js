(function () {
    "use strict";

    App.namespace("App.components.sidebar");

    App.components.sidebar.SidebarStateModel = Backbone.Model.extend({

        defaults : {
            width : 375,
            minWidth : 375,
            visible : false,
            currentSideView : undefined
        },

        initialize : function (options) {
            this.sideViewsIds = options.sideViewsIds;
        },

        toggleSideView : function (viewId) {
            if (_.contains(this.sideViewsIds, viewId)) {
                if (this.get("currentSideView") === viewId) {
                    this.set("currentSideView", undefined);                    
                } else {
                    this.set("currentSideView", viewId);
                }
            } else {
                this.set("currentSideView", undefined);
            }
        },        

        validate : function (attrs, options) {
            if (attrs.width < attrs.minWidth) {
                return "width min size is "  + attrs.minWidth;
            }
        },

        restoreDefaults : function () {
            this.set(this.defaults);
        }

    });


}());
