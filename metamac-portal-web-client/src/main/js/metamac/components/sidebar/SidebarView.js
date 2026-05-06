(function () {
    "use strict";

    App.namespace("App.components.sidebar");

    App.components.sidebar.SidebarView = Backbone.View.extend({

        template: App.templateManager.get("components/sidebar/sidebar-container"),

        className: "sidebar-container",

        initialize: function (options) {
            this.sideViews = options.sideViews;
            this.contentView = options.contentView;
            this.optionsModel = options.optionsModel;
            this.defaultCurrentSideView = options.defaultCurrentSideView;

            var stateOptions = {
                sideViewsIds: _.pluck(this.sideViews, "id")
            };
            this.state = new App.components.sidebar.SidebarStateModel(stateOptions);

            this._onToggleFilter();

            _.bindAll(this, "_onClickSplitter", "_onMousemoveSplitter", "_onMouseupSplitter");
        },

        events: {
            "mousedown .sidebar-splitter": "_onClickSplitter"
        },

        _bindEvents: function () {
            this.listenTo(this.state, "change:currentSideView", this._onChangeCurrentSideView);
            this.listenTo(this.state, "change:width", this._updateSidebar);
            this.listenTo(this.state, "change:visible", this._updateVisibility);

            this.listenTo(this.optionsModel, "change:filter", this._onToggleFilter);

            this.delegateEvents();
        },

        _unbindEvents: function () {
            this.stopListening();
        },

        _onToggleFilter: function () {
            this.state.set('visible', this.optionsModel.get('filter'));
        },

        _updateVisibility: function () {
            this._updateSidebar();
            if (this.state.get("visible")) {
                if (!this.state.get("currentSideView")) {
                    this.state.set("currentSideView", this.defaultCurrentSideView);
                }
            } else {
                this.state.set("currentSideView", undefined);
            }
        },

        _updateSidebar: function () {
            var width = this.state.get('width');
            const GAP = 10;
            if (this.state.get('visible')) {
                this.$sidebar.css({ width: width, left: 0 });
                this.$content.css('margin-left', width + GAP);
            } else {
                this.$sidebar.css({ width: width, left: -width });
                this.$content.css('margin-left', 0);
            }

            this.updateSidebarHeight();
        },
        updateSidebarHeight: function () {
            var menuHeight = $(".js-sidebar-container-sibling").height();
            if (menuHeight) {
                this.$el.css({ height: menuHeight });
            }
        },

        _onClickSplitter: function (e) {
            e.preventDefault();

            this._splitterInitialState = {
                pageX: e.pageX,
                width: this.$sidebar.outerWidth()
            };

            var isFullScreen = this.optionsModel.get('fullScreen');
            var $overlayContainer = isFullScreen ? this.$el : $('body');

            this.$overlay = $('<div>')
                .addClass('sidebar-overlay')
                .appendTo($overlayContainer)
                .on('mousemove.sidebar', this._onMousemoveSplitter)
                .on('mouseup.sidebar', this._onMouseupSplitter);
        },

        _onMousemoveSplitter: function (e) {
            e.stopImmediatePropagation();
            if (e.which === 1) {
                var diff = e.pageX - this._splitterInitialState.pageX;
                var newWidth = this._splitterInitialState.width + diff;
                this.state.set('width', newWidth, { validate: true });
            } else {
                this._onMouseupSplitter();
            }
        },

        _onMouseupSplitter: function () {
            if (this.$overlay) {
                this.$overlay.remove();
            }
        },

        _getSideView: function (id) {
            return _.find(this.sideViews, function (view) {
                return view.id === id;
            });
        },

        _onChangeCurrentSideView: function () {
            var currentSideViewId = this.state.get('currentSideView');
            var currentView = currentSideViewId ? this._getSideView(currentSideViewId) : undefined;
            if (currentView) {
                currentView.render();
                this.$el.toggleClass("sidebar-slideRight", true);
                this.state.set('visible', true);
                this.$("li[data-view-id='" + currentSideViewId + "']").addClass("active");
            } else {
                this.state.set('visible', false);
            }

            var previousViewId = this.state.previous("currentSideView");
            if (previousViewId) {
                var previousView = this._getSideView(previousViewId);
                if (previousView && previousView.destroy) {
                    previousView.destroy();
                }
                this.$("li[data-view-id='" + previousViewId + "']").removeClass("active");
            }

        },

        render: function () {
            this._unbindEvents();
            this._bindEvents();

            this.$el.html(this.template({}));

            this.$sidebarContainer = this.$el;
            this.$sidebar = this.$('.sidebar-sidebar');
            this.$sidebarContent = this.$('.sidebar-sidebar-content');
            this.$content = this.$('.sidebar-content');
            _.each(this.sideViews, function (view) {
                view.setElement(this.$sidebarContent);
            }, this);

            if (this.sideViews.length) {
                this.sideViews[0].render();
            }

            if (this.contentView != null) {
                this.contentView.setElement(this.$content);
                this.contentView.render();
            }

            this._updateVisibility();

            return this;
        },

        close: function () {
            this.state.restoreDefaults();
        }

    });


}());
