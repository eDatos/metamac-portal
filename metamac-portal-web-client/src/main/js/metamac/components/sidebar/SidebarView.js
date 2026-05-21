(function () {
    "use strict";

    App.namespace("App.components.sidebar");

    App.components.sidebar.SidebarView = Backbone.View.extend({

        template: App.templateManager.get("components/sidebar/sidebar-container"),

        className: "sidebar-container",

        initialize: function (options) {
            this.sideView = options.sideView;
            this.contentView = options.contentView;
            this.optionsModel = options.optionsModel;

            this.state = new App.components.sidebar.SidebarStateModel();

            this._onToggleFilter();

            _.bindAll(this, "_onClickSplitter", "_onMousemoveSplitter", "_onMouseupSplitter");
        },

        events: {
            "mousedown .sidebar-splitter": "_onClickSplitter"
        },

        _bindEvents: function () {
            this.listenTo(this.state, "change:width change:visible", this._updateSidebar);

            this.listenTo(this.optionsModel, "change:filter", this._onToggleFilter);

            this.delegateEvents();
        },

        _unbindEvents: function () {
            this.stopListening();
        },

        _onToggleFilter: function () {
            this.state.set('visible', this.optionsModel.get('filter'));
        },

        _updateSidebar: function () {
            var width = this.state.get('width');
            const GAP = 10;
            if (this.sideView && this.state.get('visible')) {
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

        render: function () {
            this._unbindEvents();
            this._bindEvents();

            this.$el.html(this.template({}));

            this.$sidebarContainer = this.$el;
            this.$sidebar = this.$('.sidebar-sidebar');
            this.$sidebarContent = this.$('.sidebar-sidebar-content');
            this.$content = this.$('.sidebar-content');

            if (this.sideView) {
                this.sideView.setElement(this.$sidebarContent);
                this.sideView.render();
            }

            if (this.contentView != null) {
                this.contentView.setElement(this.$content);
                this.contentView.render();
            }

            this._updateSidebar();

            return this;
        },

        close: function () {
            this.state.restoreDefaults();
        }

    });


}());
