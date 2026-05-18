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
            this.visualizationTabs = options.visualizationTabs;

            this._bindEvents();
        },

        events: {
            "click .dataset-options-filter": "clickFilter",
            "click .visual-element-options-edit": "clickFilterLoader",
            "click .visual-element-options-fs": "clickFullScreen",
            "click .visual-element-options-share": "clickShare",
            "click .visual-element-options-save": "clickSave",
            "click .visual-element-options-embed": "clickEmbed",
            "click .selection-visualize-selection": "clickVisualize",
            "click .visualization-button": "clickVisualizationButton"
        },

        destroy: function () {
            this._unbindEvents();
        },

        _bindEvents: function () {
            this.listenTo(this.optionsModel, "change:fullScreen", this.updateFullscreenButton);
            this.listenTo(this.optionsModel, "change:filter", this.updateFilterButton);
            this.listenTo(this.filterDimensions, "change:drawable", _.debounce(this.updateView, 400));

            if (this.optionsModel.get('widget')) {
                this.listenTo(this.optionsModel, "change:widgetInitialType", this.updateView);
                this.listenTo(this.optionsModel, "change:type", this.updateWidgetActiveTab);
            }

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
                    usersAreAvailable: !!(App.endpoints["external-users"] && App.endpoints["external-users-web"] && window.Edatos && Edatos.UserManagement),
                    visualize: this.optionsModel.get('visualize'),
                    filterDisabled: this._isFilterDisabled(),
                    widgetButton: this.optionsModel.get('widgetButton'),
                    widgetTabs: this._getWidgetTabs()
                };
                this.$el.html(this.template(context));

                this.renderDownloadButton();
            }
            return this;
        },

        _isFilterDisabled: function () {
            return this.optionsModel.get('widget') && (this.optionsModel.get('type') === 'info' || this.optionsModel.get('type') === 'apiEndpoints');
        },

        _getWidgetTabs: function () {
            if (!this.optionsModel.get('widget') || !this.visualizationTabs) {
                return null;
            }
            const currentType = this.optionsModel.get('type');
            const widgetInitialType = this.optionsModel.get('widgetInitialType');
            const widgetTabs = [];

            const self = this;
            _.each(this.visualizationTabs, function (tab) {
                if (tab.subtabs && tab.subtabs.length > 0) {
                    _.each(tab.subtabs, function (subtab) {
                        if (self._isFixedVisualizationTypeForWidgets(subtab.type) || subtab.type === widgetInitialType) {
                            widgetTabs.push(_.extend({}, subtab, { active: subtab.type === currentType }));
                        }
                    });
                } else if (self._isFixedVisualizationTypeForWidgets(tab.type) || tab.type === widgetInitialType) {
                    widgetTabs.push(_.extend({}, tab, { active: tab.type === currentType }));
                }
            });
            return widgetTabs;
        },

        _isFixedVisualizationTypeForWidgets: function (visualizationType) {
            return visualizationType === 'info' || visualizationType === 'apiEndpoints';
        },

        updateWidgetActiveTab: function () {
            const type = this.optionsModel.get('type');
            this.$('.visualization-button').removeClass('active');
            this.$(`.visualization-button[data-type="${type}"]`).addClass('active');
        },

        clickVisualizationButton: function (e) {
            const type = $(e.currentTarget).data('type');
            this.optionsModel.set('type', type);
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
                if (this.fullScreenIsAllowed()) {
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

                        modalContentView = new App.components.modal.ShareModalView({permalinkId: permalink.id, filterDimensions: self.filterDimensions});
                        modal = new App.components.modal.ModalView({title: title, contentView: modalContentView, titleIconName: "fa-share-nodes"});
                        modal.show();
                    },
                    customButtonText: I18n.t("modal.shareConfig.button.submit")
                });
            } else {
                modalContentView = new App.components.modal.ShareModalView({permalinkId: DatasetPermalink.getExistingPermalinkId(this.filterDimensions), filterDimensions: this.filterDimensions});
            }
            modal = new App.components.modal.ModalView({title: title, contentView: modalContentView, titleIconName: "fa-share-nodes"});
            modal.show();
        },

        clickSave: function (e) {
            e.preventDefault();
            if (this.isInternalPortal()) {
                var modalContentView = new DisabledFeatureInternalPortalView();
                var title = I18n.t("filter.button.save");
                var modal = new App.components.modal.ModalView({title: title, contentView: modalContentView, titleIconName: "fa-floppy-disk"});
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

                                modalContentView = new App.components.modal.SaveModalView({permalinkId: permalink.id, filterDimensions: self.filterDimensions, user: val});
                                modal = new App.components.modal.ModalView({title: title, contentView: modalContentView, titleIconName: "fa-floppy-disk"});
                                modal.show();
                            },
                            customButtonText: I18n.t("modal.saveConfig.button.submit")
                        });
                    } else {
                        modalContentView = new App.components.modal.SaveModalView({
                            permalinkId: DatasetPermalink.getExistingPermalinkId(self.filterDimensions),
                            filterDimensions: self.filterDimensions,
                            user: val
                        });
                    }
                    modal = new App.components.modal.ModalView({title: title, contentView: modalContentView, titleIconName: "fa-floppy-disk"});
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
                    modal = new App.components.modal.ModalView({title: title, contentView: modalContentView, titleIconName: "fa-floppy-disk"});
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

                            modalContentView = new App.components.modal.EmbedModalView({permalinkId: permalink.id, filterDimensions: self.filterDimensions, title: embedConfigExtraData.title});
                            modal = new App.components.modal.ModalView({title: title, contentView: modalContentView, titleIconName: "fa-code"});
                            modal.show();
                        },
                        customButtonText: I18n.t("modal.embedConfig.button.submit"),
                    });
                } else {
                    modalContentView = new App.components.modal.EmbedModalView({permalinkId: DatasetPermalink.getExistingPermalinkId(this.filterDimensions), filterDimensions: this.filterDimensions});
                }
            modal = new App.components.modal.ModalView({title: title, contentView: modalContentView, titleIconName: "fa-code"});
            modal.show();
        },

        setCurrentVe: function (currentVe) {
            this.currentVe = currentVe;
            this.renderDownloadButton();
        },

        renderDownloadButton: function () {
            if (!this.currentVe) {
                return;
            }

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
            } else {
                this.downloadSelectView.setCurrentVe(this.currentVe);
            }
            this.downloadSelectView.setElement(this.$('.visual-element-options-download'));
            this.downloadSelectView.render();
        },

        clickVisualize: function (e) {
            e.preventDefault();
            this.trigger('visualize');
        },

        isInternalPortal: function () {
            return App.config["installationType"] === "INTERNAL";
        }
    });


}());
