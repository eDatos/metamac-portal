(function () {
    "use strict";

    App.namespace("App.modules.user");

    App.modules.user.UserUtils = {

        saveFilter: function (filter) {
            return new Promise(function(resolve, reject) {
                $.ajax({
                    url: App.endpoints["external-users"] + '/api/filters',
                    method: "POST",
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    data: filter.toString(),
                    beforeSend: Edatos.UserManagement.prepareAuthorizationAndXSRFHeaders,
                    xhrFields: {
                        withCredentials: true
                    },
                }).done(function(val) {
                    resolve(val)
                }).fail(function(jqXHR) {
                    reject(jqXHR)
                });
            });
        },

        updateLastAccess: function (permalinkId) {
            return new Promise(function(resolve, reject) {
                $.ajax({
                    url: App.endpoints["external-users"] + '/api/filters/last-access/' + permalinkId,
                    method: "PUT",
                    beforeSend: Edatos.UserManagement.prepareAuthorizationAndXSRFHeaders,
                    xhrFields: {
                        withCredentials: true
                    },
                }).done(function(val) {
                    resolve(val)
                }).fail(function(jqXHR) {
                    reject(jqXHR)
                });
            });
        },
    }
}());

