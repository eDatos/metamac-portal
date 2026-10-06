(function () {
    "use strict";

    App.namespace("App.modules.collection.subscription");

    var UserUtils = App.modules.user.UserUtils;

    App.modules.collection.subscription.SubscribeButtonView = Backbone.View.extend({

        template: App.templateManager.get("collection/subscription/subscribe-button"),
        tooltipTemplate: App.templateManager.get("collection/subscription/subscribe-tooltip"),

        events: {
            "click .visualizer-subscribe-button": "clickSubscribe"
        },

        initialize: function (options) {
            this.operationCode = options.operationCode;
        },

        render: function () {
            var self = this;

            Edatos.UserManagement.addOnLogoutListener(function () {
                self._renderState(false);
            });

            Edatos.UserManagement.getAccount().then(function () {
                UserUtils.isOperationFavorite(self.operationCode).then(function (isFavorite) {
                    self._renderState(isFavorite);
                });
            }).catch(function () {
                self._renderState(false);
            });
            return this;
        },

        _renderState: function (subscribed) {
            this._destroyTooltip();
            this.$el.html(this.template({ subscribed: subscribed }));
            if (!subscribed && this._supportsHover()) {
                this._initTooltip();
            }
        },

        _supportsHover: function () {
            return !!(window.matchMedia && window.matchMedia('(hover: hover)').matches);
        },

        _initTooltip: function () {
            var self = this;
            var tooltipOptions = {
                items: '.visualizer-subscribe-button',
                content: function () {
                    return self.tooltipTemplate();
                },
                classes: {
                    'ui-tooltip': 'visualizer-subscribe-tooltip'
                },
                show: false,
                hide: false,
                position: {
                    my: 'left center',
                    at: 'right+12 center',
                    collision: 'flip fit',
                    using: function (position, feedback) {
                        $(this).css(position).attr('data-placement', feedback.horizontal === 'left' ? 'right' : 'left');
                    }
                }
            };
            this.$('.visualizer-subscribe-button').tooltip(tooltipOptions);
        },

        _destroyTooltip: function () {
            var $button = this.$('.visualizer-subscribe-button');
            if ($button.length && $button.tooltip('instance')) {
                $button.tooltip('destroy');
            }
        },

        clickSubscribe: function (e) {
            e.preventDefault();
            var self = this;

            this._closeTooltip();

            Edatos.UserManagement.getAccount().then(function () {
                self._confirmSubscription();
            }).catch(function () {
                self._requestLogin();
            });
        },

        _closeTooltip: function () {
            var $button = this.$('.visualizer-subscribe-button');
            if ($button.length && $button.tooltip('instance')) {
                $button.tooltip('close');
            }
        },

        _confirmSubscription: function () {
            var self = this;
            var modal = this._openModal(I18n.t("subscribe.modal.confirmation.title"), new App.components.modal.ConfirmationModalView({
                question: I18n.t("subscribe.modal.confirmation.message"),
                onConfirm: function (confirmation) {
                    confirmation.disableButtons();
                    self._subscribe(modal);
                },
                onReject: function () {
                    modal.close();
                }
            }));
        },

        _requestLogin: function () {
            var modal = this._openModal(I18n.t("modal.information.loginRequired.title"), new App.components.modal.ConfirmationModalView({
                question: I18n.t("modal.information.loginRequired.message"),
                onConfirm: function () {
                    Edatos.UserManagement.login();
                },
                onReject: function () {
                    modal.close();
                }
            }));
        },

        _subscribe: function (confirmationModal) {
            var self = this;
            UserUtils.subscribeToOperation(this.operationCode).then(function () {
                confirmationModal.close();
                self._renderState(true);
                self._showInformationModal(I18n.t("subscribe.modal.result.success"));
            }).catch(function () {
                confirmationModal.close();
                self._showInformationModal(I18n.t("subscribe.modal.result.error"));
            });
        },

        _showInformationModal: function (message) {
            this._openModal(I18n.t("subscribe.modal.result.title"), new App.components.modal.InformationModalView({ message: message }));
        },

        _openModal: function (title, contentView) {
            var modal = new App.components.modal.ModalView({
                title: title,
                contentView: contentView,
                titleIconName: "fa-bell-on"
            });
            modal.show();
            return modal;
        }

    });

}());
