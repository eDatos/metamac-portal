(function () {

    App.namespace("App.modules.dataset");

    var DatasetPermalink = App.modules.dataset.DatasetPermalink;
    var DisabledFeatureInternalPortalView = Backbone.View.extend({
        render: function () {
            this.$el.html('<b>' + I18n.t("filter.button.disabledFeature.internalPortal") + '</b>');
        }
    });

    App.modules.dataset.OptionsView = Backbone.View.extend({

        template: App.templateManager.get('dataset/dataset-options'),

        initialize: function (options) {
            this.data = options.data;
            this.filterDimensions = options.filterDimensions;
            this.dataSource = options.dataSource;
            this.optionsModel = options.optionsModel;

            this._bindEvents();
        },

        events: {
            "click .dataset-options-filter": "clickFilter",
            "click .visual-element-options-edit": "clickFilterLoader",
            "click .visual-element-options-fs": "clickFullScreen",
            "click .visual-element-options-share": "clickShare",
            "click .visual-element-options-save": "clickSave",
            "click .visual-element-options-api-download": "clickApiDownload",
            "click .visual-element-options-embed": "clickEmbed",
        },

        destroy: function () {
            this._unbindEvents();
        },

        _bindEvents: function () {
            this.listenTo(this.optionsModel, "change:fullScreen", this.updateFullscreenButton);
            this.listenTo(this.optionsModel, "change:filter", this.updateFilterButton);
            this.listenTo(this.filterDimensions, "change:drawable", _.debounce(this.updateView, 400));

            this.delegateEvents();
        },

        
        updateView: function () {
            this.render();
        },

        _unbindEvents: function () {
            this.stopListening();
        },

        fullScreenIsAllowed: function () {
            return true;
        },

        isFullScreen: function () {
            return this.optionsModel.get('fullScreen');
        },

        isFilter: function () {
            return this.optionsModel.get('filter');
        },

        isOptions: function () {
            return this.optionsModel.get('options');
        },

        updateFullscreenButton: function () {
            var $fullScreenButton = this.$el.find('.visual-element-options-fs');
            $fullScreenButton.toggleClass('active', this.fullScreenIsAllowed() && this.isFullScreen());
        },

        updateFilterButton: function () {
            var $filterButton = this.$el.find('.dataset-options-filter');
            $filterButton.toggleClass('active', this.isFilter());
        },

        render: function () {
            this._unbindEvents();
            this._bindEvents();

            var fullScreenVisible = this.fullScreenIsAllowed();
            var fullScreenActive = this.isFullScreen();
            var filterActive = this.isFilter();
            var optionsEnabled = this.isOptions();

            if (optionsEnabled) {
                var context = {
                    filter: {
                        active: filterActive,
                        btnClass: filterActive ? 'active' : ''
                    },
                    fullScreen: {
                        visible: fullScreenVisible,
                        active: fullScreenActive,
                        btnClass: fullScreenActive ? 'active' : ''
                    },
                    helpUrl: this._getHelpUrl(),
                    usersAreAvailable: !!(App.endpoints["external-users"] && App.endpoints["external-users-web"] && window.Edatos && Edatos.UserManagement),
                    visualize: this.optionsModel.get('visualize'),
                    widget: this.optionsModel.get('widget'),
                    widgetButton: this.optionsModel.get('widgetButton')
                };
                this.$el.html(this.template(context));

                this.renderDownloadButton();
            }
            return this;
        },

        _getHelpUrl: function () {
            try {
                var helpUrl = JSON.parse(App.config["helpUrl"]);
                return App.InternationalizationUtils.localizeLabel(helpUrl);
            } catch (error) {
                return App.config["helpUrl"];
            }
        },

        clickFilter: function (e) {
            this.optionsModel.set('filter', !this.optionsModel.get('filter'));
        },

        clickFilterLoader: function (e) {
            if (!this.isFilter()) {
                this.trigger('launchFilter');
            }
        },

        clickFullScreen: function (e) {
            if (this.isFullScreen()) {
                this.trigger('exitFullScreen');
                this.$el.find('.visual-element-options-fs').removeClass("active");
            } else {
                if (this.fullScreenIsAllowed) {
                    this.trigger('enterFullScreen');
                    this.$el.find('.visual-element-options-fs').addClass("active");
                }
            }
        },

        clickShare: function (e) {
            e.preventDefault();
            var modalContentView = null;
            var modal = null;
            var title = I18n.t("filter.button.share");
            if (DatasetPermalink.needsPermalink(this.filterDimensions)) {
                var self = this;
                modalContentView = new App.components.modal.PermalinkConfigModalView({
                    filterDimensions: this.filterDimensions,
                    onSubmit: function (permalink) {
                        modal.close();

                        modalContentView = new App.modules.dataset.DatasetShareView({permalinkId: permalink.id, filterDimensions: self.filterDimensions});
                        modal = new App.components.modal.ModalView({title: title, contentView: modalContentView});
                        modal.show();
                    },
                });
            } else {
                modalContentView = new App.modules.dataset.DatasetShareView({permalinkId: DatasetPermalink.getExistingPermalinkId(this.filterDimensions), filterDimensions: this.filterDimensions});
            }
            modal = new App.components.modal.ModalView({title: title, contentView: modalContentView});
            modal.show();
        },

        clickSave: function (e) {
            e.preventDefault();
            if (this.isInternalPortal()) {
                var modalContentView = new DisabledFeatureInternalPortalView();
                var title = I18n.t("filter.button.save");
                var modal = new App.components.modal.ModalView({title: title, contentView: modalContentView});
                modal.show();
            } else {
                var self = this;
                Edatos.UserManagement.getAccount().then(function (val) {
                    var modal;
                    var title = I18n.t("filter.save.modal.title");
                    if (DatasetPermalink.needsPermalink(self.filterDimensions)) {
                        var modalContentView = new App.components.modal.PermalinkConfigModalView({
                            filterDimensions: self.filterDimensions,
                            onSubmit: function (permalink) {
                                modal.close();

                                modalContentView = new App.modules.dataset.DatasetSaveView({permalinkId: permalink.id, filterDimensions: self.filterDimensions, user: val});
                                modal = new App.components.modal.ModalView({title: title, contentView: modalContentView});
                                modal.show();
                            },
                        });
                    } else {
                        modalContentView = new App.modules.dataset.DatasetSaveView({
                            permalinkId: DatasetPermalink.getExistingPermalinkId(self.filterDimensions),
                            filterDimensions: self.filterDimensions,
                            user: val
                        });
                    }
                    modal = new App.components.modal.ModalView({title: title, contentView: modalContentView});
                    modal.show();
                }).catch(function () {
                    var modal;
                    var modalContentView = new App.components.modal.ConfirmationModalView({
                        question: I18n.t("modal.information.loginRequired.message"),
                        onConfirm: function () {
                            Edatos.UserManagement.login();
                            modal.close();
                        },
                        onReject: function () {
                            modal.close();
                        },
                    });
                    var title = I18n.t("modal.information.loginRequired.title");
                    modal = new App.components.modal.ModalView({title: title, contentView: modalContentView});
                    modal.show();
                });
            }
        },

        clickEmbed: function (e) {
            e.preventDefault();
            var modalContentView = null;
            var modal = null;
            var title = I18n.t("filter.button.embed");
                if (DatasetPermalink.needsPermalink(this.filterDimensions)) {
                    var self = this;
                    modalContentView = new App.components.modal.EmbedConfigModalView({
                        filterDimensions: this.filterDimensions,
                        onSubmit: function (permalink, embedConfigExtraData) {
                            modal.close();

                            modalContentView = new App.modules.dataset.DatasetEmbedView({permalinkId: permalink.id, filterDimensions: self.filterDimensions, title: embedConfigExtraData.title});
                            modal = new App.components.modal.ModalView({title: title, contentView: modalContentView});
                            modal.show();
                        },
                    });
                } else {
                    modalContentView = new App.modules.dataset.DatasetEmbedView({permalinkId: DatasetPermalink.getExistingPermalinkId(this.filterDimensions), filterDimensions: this.filterDimensions});
                }
            modal = new App.components.modal.ModalView({title: title, contentView: modalContentView});
            modal.show();
        },

        setCurrentVe: function (currentVe) {
            this.currentVe = currentVe;
        },

        renderDownloadButton: function () {
            if (!this.downloadSelectView) {
                this.downloadSelectView = new App.modules.dataset.DatasetDownloadView({
                    currentVe: this.currentVe,
                    filterDimensions: this.filterDimensions,
                    estimatedNumberOfCells: {
                        all: this.data.getDataNonEmptyAttributesCount(), // Depends only on datarequest
                        selection: this.dataSource.getSelectionNonEmptyAttributesCount() // Depends on datarequest and selected values
                    },
                    numberOfObservations: {
                        all: {
                            total: this.data.getDataObservationsCount(),
                            tableSize: this.data.getDataTableSize()
                        },
                        selection: {
                            total: this.dataSource.getSelectionObservationsCount(),
                            tableSize: this.filterDimensions.getTableInfo().getTableSize()
                        }
                    },
                    optionsModel: this.optionsModel,
                });
            }
            this.downloadSelectView.setElement(this.$('.visual-element-options-download'));
            this.downloadSelectView.render();
        },

        clickApiDownload: function (e) {
            e.preventDefault();
            var modalContentView = null;
            var modal = null;
            var title = I18n.t("filter.apiDownload.modal.title");

            var self = this;
            modalContentView = new App.modules.dataset.DatasetApiDownloadView({
                filterDimensions: this.filterDimensions,
                optionsModel: this.optionsModel,
                identifierType: this.filterDimensions.metadata.datasourceIdentifier.identifier.type,
                onClickInfoLink: function () {
                    if (self.isFilter()) {
                        $(document).trigger('closeFilter');
                    }
                    modal.close();
                },
            });

            modal = new App.components.modal.ModalView({title: title, contentView: modalContentView});
            modal.show();
        },

        isInternalPortal: function () {
            return App.config["installationType"] === "INTERNAL";
        }


    });


}());
