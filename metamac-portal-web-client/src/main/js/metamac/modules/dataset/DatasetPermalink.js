(function () {
    "use strict";

    var UserUtils = App.modules.user.UserUtils;
    var PERMALINK_SUBPATH = "/permalink";

    App.namespace('App.modules.dataset.Permalink');

    App.modules.dataset.DatasetPermalink = {

        baseUrl: function () {
            return App.endpoints["permalinks"] + "/permalinks";
        },

        buildPermalinkContent: function (filterDimensions, dynamicSelection, lastVersion) {
            var queryParams = JSON.parse(JSON.stringify(App.queryParams));
            queryParams.version = lastVersion ? "~latest" : filterDimensions.metadata.getVersion();
            return JSON.stringify({
                queryParams: queryParams,
                hash: this.removePermalink(window.location.hash),
                selection: filterDimensions.exportJSONSelection(),
                dynamicSelection: dynamicSelection,
                state: filterDimensions.exportJSONState()
            });
        },

        removePermalink: function (hash) {
            return hash.indexOf(PERMALINK_SUBPATH) !== -1 ? hash.substring(0, hash.indexOf(PERMALINK_SUBPATH)) : hash;
        },

        retrievePermalink: function (permalinkId, callback) {
            var url = this.baseUrl() + "/" + permalinkId;
            $.getJSON(url).done(function (content) {
                if(App.endpoints["external-users"] && App.endpoints["external-users-web"]) {
                    UserUtils.updateLastAccess(permalinkId);
                }
                callback(undefined, content);
            }).fail(function () {
                console.warn("Requested permalink not found.");
                callback(undefined, false);
            });
        },

        savePermalinkWithUserAuth: function (content) {
            var self = this;
            return new Promise(function(resolve, reject) {
                $.ajax({
                    url: self.baseUrl(),
                    method: "POST",
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify({ content: content }),
                    beforeSend: UserUtils.prepareAuthorizationAndXSRFHeaders(true),
                }).fail(function(jqXHR) {
                    reject(jqXHR)
                }).done(function(val) {
                    resolve(val)
                });
            });
        },

        savePermalink: function (content, el) {
            var requestFunction = function (url) {
                return new Promise(function (resolve, reject) {
                    $.ajax({
                        url: url,
                        method: "POST",
                        dataType: "json",
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify({content: content}),
                        beforeSend: UserUtils.prepareAuthorizationAndXSRFHeaders()
                    }).fail(function (jqXHR) {
                        reject(jqXHR)
                    }).done(function (val) {
                        resolve(val)
                    });
                });
            };
            if (typeof requestWithCaptcha !== 'undefined') {
                return requestWithCaptcha(
                    requestFunction,
                    this.baseUrl(),
                    {
                        captchaEl: el,
                        action: "portal_permalink",
                        buttonText: I18n.t("captcha.button.text"),
                        labelText: I18n.t("captcha.label.text"),
                        withButton: true
                    }
                );
            } else {
                return requestFunction(this.baseUrl());
            }            
        },
    }

}());

