(function () {
    "use strict";

    App.namespace("App.widget.filter.sidebar");

    var FilterSidebarCategoryView = App.widget.filter.sidebar.FilterSidebarCategoryView;
    var FilterRepresentation = App.modules.dataset.filter.models.FilterRepresentation;

    App.widget.filter.sidebar.FilterSidebarDimensionView = Backbone.View.extend({

        template: App.templateManager.get('dataset/filter/sidebar/filter-sidebar-dimension'),

        initialize: function (options) {
            this.filterDimension = options.filterDimension;
            this.resetLastIndex();
            this.collapsable = _(options).has('collapsable') ? options.collapsable : true;
        },

        destroy: function () {
            if (this.subviews) {
                _.invoke(this.subviews, 'destroy');
            }
            this._unbindEvents();
            this.remove();
        },

        close: function () {
            this.remove();
        },

        events: {
            "click .filter-sidebar-dimension-title": "_onClickTitle"
        },

        _bindEvents: function () {
            this.listenTo(this.filterDimension, "change:visible", this.resetLastIndex);
            this.listenTo(this.filterDimension, "change:open", this._onChangeOpen);
            this.listenTo(this.filterDimension.get("representations"), "reverse", this.render);
        },

        _unbindEvents: function () {
            this.stopListening();
        },

        render: function () {
            if (this.filterDimension.get('singleValue')) { return; }
            
            this.delegateEvents();
            this._unbindEvents();
            this._bindEvents();

            var context = {
                dimension: this.filterDimension.toJSON()
            };

            this.$el.html(this.template(context));

            this.subviews = [];

            var filterRepresentations = this.filterDimension.get('representations');
            var $categories = this.$(".filter-sidebar-categories");
            this.representationsSubviews = filterRepresentations.map(function (filterRepresentation) {
                var view = new FilterSidebarCategoryView({
                    filterSidebarDimensionView: this,
                    filterDimension: this.filterDimension,
                    filterRepresentation: filterRepresentation
                });
                view.render();
                $categories.append(view.el);
                return view;
            }, this);
            this.subviews = this.subviews.concat(this.representationsSubviews);
            $categories.perfectScrollbar();

            this.searchbarView = new App.components.searchbar.SearchbarView({
                model: this.filterDimension,
                modelAttribute: "filterQuery",
                el: this.$(".filter-sidebar-dimension-searchbar")
            });
            this.searchbarView.render();
            this.subviews.push(this.searchbarView);

            this.actionsView = new App.widget.filter.sidebar.FilterSidebarDimensionActionsView({
                filterDimension: this.filterDimension,
                el: this.$('.filter-sidebar-dimension-actions')
            });
            this.actionsView.render();
            this.subviews.push(this.actionsView);

            if (this.filterDimension.get('hierarchy')) {
                let hierarchyLevel;
                let levelsModels;
                if (this.filterDimension.isTimeDimension()) {
                    hierarchyLevel = this.filterDimension.getGranularities();
                    levelsModels = hierarchyLevel.map((n, i) => {
                        return {id: i, title: I18n.t('filter.selector.temporal.' + n)};
                    });
                } else {
                    hierarchyLevel = this.filterDimension.getMaxHierarchyLevel() + 1;
                    levelsModels = _(hierarchyLevel).times(function (n) {
                        return {id: n, title: 'Nivel ' + (n + 1)};
                    });
                }
                levelsModels.unshift({ id: -1, title: I18n.t('filter.selector.level.all') });
                this.levelsCollection = new Backbone.Collection(levelsModels);

                this.levelView = new App.components.select.views.SelectView({
                    collection: this.levelsCollection,
                    selectionModel: this.filterDimension,
                    name: 'filterLevel',
                    el: this.$('.filter-sidebar-dimension-levels')
                });
                this.levelView.render();
                this.subviews.push(this.levelView);
            }

            this.visibleLabelTypeView = new App.components.ToggleableView({
                inactiveValue: { id: FilterRepresentation.VISIBLE_LABEL_TYPES.LABEL, title: "Código y etiqueta", icon: "icon-tags" },
                activeValue: { id: FilterRepresentation.VISIBLE_LABEL_TYPES.CODE_AND_LABEL, title: "Etiqueta", icon: "icon-tags" },
                selectionModel: this.filterDimension,
                name: "visibleLabelType",
                el: this.$(".filter-sidebar-dimension-visibleLabelType")
            });
            this.visibleLabelTypeView.render();
            this.subviews.push(this.visibleLabelTypeView);


            this.setMaxHeight(this.maxHeight);
            this._onChangeOpen(this.filterDimension);

            return this.el;
        },

        updateScrollbar: function () {
            // Wait for DOM
            setTimeout(function () {
                this.$(".filter-sidebar-categories").perfectScrollbar('update');
            }, 10);
        },

        getCollapsedHeight: function () {
            return this.$(".filter-sidebar-dimension-title").outerHeight(true);
        },

        _onClickTitle: function (e) {
            e.preventDefault();
            if (this.collapsable) {
                this.filterDimension.toggle('open');
            }
        },

        _onChangeOpen: function (model) {
            if (model.id === this.filterDimension.id) {
                this.$el.find('.collapse').toggleClass('in', this.filterDimension.get('open'));
                this.$el.find('.filter-sidebar-dimension-title').toggleClass('active', this.filterDimension.get('open'));
                this.updateScrollbar();
            }
        },

        setMaxHeight: function (maxHeight) {
            this.maxHeight = maxHeight;
            this.$('.collapse').css('max-height', maxHeight);
            var SIDEBAR_DIMENSION_HEADER_HEIGHT = 65;
            var height = maxHeight - SIDEBAR_DIMENSION_HEADER_HEIGHT;
            this.$('.filter-sidebar-categories').css('height', height);
            this.updateScrollbar();
        },

        resetLastIndex: function () {
            this.lastIndex = -1;
        }

    });
}());