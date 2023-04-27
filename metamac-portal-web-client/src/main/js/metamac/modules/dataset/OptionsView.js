(function () {

    App.namespace("App.modules.dataset");

    var UserUtils = App.modules.user.UserUtils;
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
            this.dataSource = new App.DataSourceDataset({ data: this.data, filterDimensions: this.filterDimensions });
            this.optionsModel = options.optionsModel;
            this.buttons = options.buttons;

            this._bindEvents();
        },

        events: {
            "click .dataset-options-filter": "clickFilter",
            "click .change-visual-element button": "changeType",
            "click .visual-element-options-edit": "clickFilterLoader",
            "click .visual-element-options-fs": "clickFullScreen",
            "click .visual-element-options-share": "clickShare",
            "click .visual-element-options-save": "clickSave",
            "click .visual-element-options-download": "clickDownload",
            "click .visual-element-options-embed": "clickEmbed",
        },

        destroy: function () {
            this._unbindEvents();
        },

        _bindEvents: function () {
            this.listenTo(this.optionsModel, "change:type", this.render);
            this.listenTo(this.optionsModel, "change:fullScreen", this.updateFullscreenButton);
            this.listenTo(this.optionsModel, "change:filter", this.updateFilterButton);

            this.delegateEvents();
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
            var self = this;

            var activeType = this.optionsModel.get('type');

            var fullScreenVisible = this.fullScreenIsAllowed();
            var fullScreenActive = this.isFullScreen();
            var filterActive = this.isFilter();
            var optionsEnabled = this.isOptions();

            if (optionsEnabled) {
                var buttons = this.buttons;

                var veTypeButtons = _.map(buttons, function (type) {
                    return {
                        title: I18n.t("filter.button." + type),
                        type: type,
                        btnClass: type === activeType ? 'active' : '',
                        enabled: self._isVisualizationButtonEnabled(type)
                    };
                });

                var context = {
                    veTypeButton: veTypeButtons,
                    filter: {
                        active: filterActive,
                        btnClass: filterActive ? 'active' : ''
                    },

                    fullScreen: {
                        visible: fullScreenVisible,
                        active: fullScreenActive,
                        btnClass: fullScreenActive ? 'active' : ''
                    },
                    helpUrl: App.config["helpUrl"],
                    usersAreAvailable: !!(App.endpoints["external-users"] && App.endpoints["external-users-web"]),
                    visualize: this.optionsModel.get('visualize'),
                    widget: this.optionsModel.get('widget'),
                    widgetButton: this.optionsModel.get('widgetButton')
                };
                this.$el.html(this.template(context));
            }
            return this;
        },

        _isVisualizationButtonEnabled: function (type) {

            if (type == "line" && !this.filterDimensions.canDrawLineVisualizations()) {
                return false;
            }

            if ((type == "map" || type == "mapbubble") && !this.filterDimensions.canDrawMapVisualizations()) {
                return false;
            }

            if (this.optionsModel.get('widget')) {
                return type == "info" || type == this.optionsModel.get('widgetInitialType');
            }
            return true;
        },

        _isExportableImage: function () {
            return _.contains(['line', 'column', 'bar', 'map', 'mapbubble'], this.optionsModel.get('type'));
        },

        clickFilter: function (e) {
            this.optionsModel.set('filter', !this.optionsModel.get('filter'));
        },

        changeType: function (e) {
            if (this.isFilter()) {
                $(document).trigger('closeFilter');
            }
            var $target = $(e.currentTarget);
            var type = $target.data('type');

            this.optionsModel.set('type', type);
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
            if (this.isInternalPortal()) {
                modalContentView = new DisabledFeatureInternalPortalView();
            } else {
                if (DatasetPermalink.needsPermalink(this.filterDimensions)) {
                    var self = this;
                    modalContentView = new App.components.modal.PermalinkConfigModalView({
                        filterDimensions: this.filterDimensions,
                        onSubmit: function (permalink) {
                            modal.close();

                            modalContentView = new App.modules.dataset.DatasetShareView({ permalinkId: permalink.id, filterDimensions: self.filterDimensions });
                            modal = new App.components.modal.ModalView({ title: title, contentView: modalContentView });
                            modal.show();
                        },
                    });
                } else {
                    modalContentView = new App.modules.dataset.DatasetShareView({ permalinkId: DatasetPermalink.getExistingPermalinkId(this.filterDimensions), filterDimensions: this.filterDimensions });
                }
            }
            modal = new App.components.modal.ModalView({ title: title, contentView: modalContentView });
            modal.show();
        },

        clickSave: function (e) {
            e.preventDefault();
            if (this.isInternalPortal()) {
                var modalContentView = new DisabledFeatureInternalPortalView();
                var title = I18n.t("filter.button.save");
                var modal = new App.components.modal.ModalView({ title: title, contentView: modalContentView });
                modal.show();
            } else {
                var self = this;
                UserUtils.getAccount().then(function(val) {
                    var modal;
                    var title = I18n.t("filter.save.modal.title");
                    if (DatasetPermalink.needsPermalink(self.filterDimensions)) {
                        var modalContentView = new App.components.modal.PermalinkConfigModalView({
                            filterDimensions: self.filterDimensions,
                            onSubmit: function (permalink) {
                                modal.close();

                                modalContentView = new App.modules.dataset.DatasetSaveView({ permalinkId: permalink.id, filterDimensions: self.filterDimensions, user: val });
                                modal = new App.components.modal.ModalView({ title: title, contentView: modalContentView });
                                modal.show();
                            },
                        });
                    } else {
                        modalContentView = new App.modules.dataset.DatasetSaveView({ permalinkId: DatasetPermalink.getExistingPermalinkId(self.filterDimensions), filterDimensions: self.filterDimensions, user: val });
                    }
                    modal = new App.components.modal.ModalView({ title: title, contentView: modalContentView });
                    modal.show();
                }).catch(function() {
                    var modal;
                    var modalContentView = new App.components.modal.ConfirmationModalView({
                        question: I18n.t("modal.information.loginRequired.message"),
                        onConfirm: function () {
                            UserUtils.login();
                            modal.close();
                        },
                        onReject: function () {
                            modal.close();
                        },
                    });
                    var title = I18n.t("modal.information.loginRequired.title");
                    modal = new App.components.modal.ModalView({ title: title, contentView: modalContentView });
                    modal.show();
                });
            }
        },

        clickEmbed: function (e) {
            e.preventDefault();
            var modalContentView = null;
            var modal = null;
            var title = I18n.t("filter.button.embed");
            if (this.isInternalPortal()) {
                modalContentView = new DisabledFeatureInternalPortalView();
            } else {
                if (DatasetPermalink.needsPermalink(this.filterDimensions)) {
                    var self = this;
                    modalContentView = new App.components.modal.EmbedConfigModalView({
                        filterDimensions: this.filterDimensions,
                        onSubmit: function (permalink, embedConfigExtraData) {
                            modal.close();

                            modalContentView = new App.modules.dataset.DatasetEmbedView({ permalinkId: permalink.id, filterDimensions: self.filterDimensions, title: embedConfigExtraData.title });
                            modal = new App.components.modal.ModalView({ title: title, contentView: modalContentView });
                            modal.show();
                        },
                    });
                } else {
                    modalContentView = new App.modules.dataset.DatasetEmbedView({ permalinkId: DatasetPermalink.getExistingPermalinkId(this.filterDimensions), filterDimensions: this.filterDimensions });
                }
            }
            modal = new App.components.modal.ModalView({ title: title, contentView: modalContentView });
            modal.show();
        },

        clickDownload: function (e) {
            e.preventDefault();
            var modalContentView = null;
            if (this.isInternalPortal() && !this._isExportableImage()) {
                modalContentView = new DisabledFeatureInternalPortalView();
            } else {
                modalContentView = new App.modules.dataset.DatasetDownloadView({ 
                    filterDimensions: this.filterDimensions, 
                    visualizationType: this.optionsModel.get('type'),
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
                    }
                });
            }
            var title = I18n.t("filter.download.modal.title");
            var modal = new App.components.modal.ModalView({ title: title, contentView: modalContentView });
            modal.show();
        },

        isInternalPortal: function () {
            return App.config["installationType"] === "INTERNAL";
        }


    });


}());