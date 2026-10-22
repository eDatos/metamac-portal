(function () {
    "use strict";

    App.namespace("App.modules.user");

    App.modules.user.UserUtils = {

        saveFilter: function (filter) {
            return new Promise(function (resolve, reject) {
                Edatos.UserManagement.prepareRequestWithEdatosAuthenticationToExternalUsers({
                    url: App.endpoints["external-users"] + '/api/filters',
                    method: "POST",
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    data: filter.toString(),
                    headers: {
                        "api-key": App.config["apiKey"]
                    }
                }).then(ajaxSettings => {
                    $.ajax(ajaxSettings).done(function (val) {
                        resolve(val);
                    }).fail(function (jqXHR) {
                        reject(jqXHR);
                    });
                });
            });
        },

        updateLastAccess: function (permalinkId) {
            return new Promise(function(resolve, reject) {
                Edatos.UserManagement.prepareRequestWithEdatosAuthenticationToExternalUsers({
                    url: App.endpoints["external-users"] + '/api/filters/last-access/' + permalinkId,
                    method: "PUT",
                    headers: {
                        "api-key": App.config["apiKey"]
                    }
                }).then(ajaxSettings => {
                    $.ajax(ajaxSettings).done(function (val) {
                        resolve(val);
                    }).fail(function (jqXHR) {
                        reject(jqXHR);
                    });
                });
            });
        },

        isOperationSubscribable: function (operationCode) {
            return new Promise(function (resolve) {
                $.ajax({
                    url: App.endpoints["external-users"] + '/api/categories',
                    type: "HEAD",
                    data: { operationCode: operationCode },
                    headers: {
                        "api-key": App.config["apiKey"]
                    }
                }).done(function () {
                    resolve(true);
                }).fail(function () {
                    resolve(false);
                });
            });
        },

        isOperationFavorite: function (operationCode) {
            return new Promise(function (resolve) {
                Edatos.UserManagement.prepareRequestWithEdatosAuthenticationToExternalUsers({
                    url: App.endpoints["external-users"] + '/api/favorites',
                    type: "HEAD",
                    data: { operationCode: operationCode },
                    headers: {
                        "api-key": App.config["apiKey"]
                    }
                }).then(ajaxSettings => {
                    $.ajax(ajaxSettings).done(function () {
                        resolve(true);
                    }).fail(function () {
                        resolve(false);
                    });
                });
            });
        },

        subscribeToOperation: function (operationCode) {
            return new Promise(function (resolve, reject) {
                Edatos.UserManagement.prepareRequestWithEdatosAuthenticationToExternalUsers({
                    url: App.endpoints["external-users"] + '/api/favorites',
                    method: "POST",
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify({ externalOperation: { code: operationCode } }),
                    headers: {
                        "api-key": App.config["apiKey"]
                    }
                }).then(ajaxSettings => {
                    $.ajax(ajaxSettings).done(function (val) {
                        resolve(val);
                    }).fail(function (jqXHR) {
                        reject(jqXHR);
                    });
                });
            });
        },
    };
}());

