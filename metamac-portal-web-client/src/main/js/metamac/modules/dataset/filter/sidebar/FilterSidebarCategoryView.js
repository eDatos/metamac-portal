(function () {
    "use strict";

    App.namespace("App.widget.filter.sidebar");

    App.widget.filter.sidebar.FilterSidebarCategoryView = Backbone.View.extend({

        template: App.templateManager.get('dataset/filter/sidebar/filter-sidebar-category'),

        className: "filter-sidebar-category",

        initialize: function (options) {
            this.filterRepresentation = options.filterRepresentation;
            this.filterDimension = options.filterDimension;
            this.filterSidebarDimensionView = options.filterSidebarDimensionView;
        },

        events: {
            "click .filter-sidebar-category-label" : "toggleSelected",
            "click .category-state" : "toggleSelected",

            "dblclick .filter-sidebar-category-label": "toggleSelectedElementAndChildren",
            "dblclick .category-state": "toggleSelectedElementAndChildren",

            "click .category-expand": "toggleOpen"
        },

        _bindEvents: function () {
            var renderEvents = 'change:visibleLabel change:selected change:childrenSelected change:visible change:open change:matchIndexBegin change:matchIndexEnd';
            // Debounce 0 is strange, but needed, because if put the render as inmediate, the views reset, losing the events pointing to them
            this.listenTo(this.filterRepresentation, renderEvents, this.render);
        },

        _unbindEvents: function () {
            this.stopListening();
        },

        destroy: function () {
            this._unbindEvents();
            this.remove();
        },

        toggleOpen: function (e) {
            e.preventDefault();
            this.filterRepresentation.toggle('open');
        },

        toggleSelected: function (e) {
            e.preventDefault();
            var representations = this.filterDimension.get('representations');
            var currentIndex = representations.indexOf(this.filterRepresentation);
            if (e.shiftKey && this.filterSidebarDimensionView.lastIndex !== -1) {
                var newState = !this.filterRepresentation.get('selected');
                var sortedIndex = [currentIndex, this.filterSidebarDimensionView.lastIndex].sort();
                representations.toggleRepresentationsVisibleRange(sortedIndex[0], sortedIndex[1], newState);
            } else {
                // We do this to avoid interactions with the inmediate rendering and toggleSelectedElementAndChildren
                var selected = this.filterRepresentation.get('selected');
                var self = this;
                // Wait for double click events to happen
                setTimeout(function () {
                    var currentSelected = self.filterRepresentation.get('selected');
                    // If after the timeout the seleted value is still the same, you can toggle it safely
                    if (selected == currentSelected) {
                        self.filterRepresentation.toggle('selected');
                    }
                }, 400);
            }
            this.filterSidebarDimensionView.lastIndex = currentIndex;
        },

        toggleSelectedElementAndChildren: function (e) {
            e.preventDefault();
            this.filterRepresentation.trigger("loading");
            this.filterRepresentation.toggleMeAndMyChildren('selected');
        },

        _stateClass: function () {
            var stateClass;
            if (this.filterRepresentation.children.length > 0 && this.filterRepresentation.get('childrenSelected')) {
                stateClass = this.filterRepresentation.get('selected') ?
                    'filter-sidebar-category-any-children-icon-check' :
                    'filter-sidebar-category-any-children-icon-unchecked';
            } else {
                stateClass = this.filterRepresentation.get('selected') ?
                    'filter-sidebar-category-icon-check' :
                    'filter-sidebar-category-icon-unchecked';
            }
            return stateClass;
        },

        _collapseClass: function () {
            if (this.filterRepresentation.children.length > 0) {
                if (this.filterRepresentation.get('open') || this.filterRepresentation.checkAnyChildVisible()) {
                    this.filterRepresentation.set('open', true);
                    return this.filterRepresentation.get('childrenSelected') ? 'filter-sidebar-category-any-children-icon-collapse' : 'filter-sidebar-category-icon-collapse';
                } else {
                    return this.filterRepresentation.get('childrenSelected') ? 'filter-sidebar-category-any-children-icon-expand' : 'filter-sidebar-category-icon-expand';
                }
            }
        },

        _strongZone: function (str, begin, end) {
            if (begin >= 0 && end > begin) {
                var p1 = str.substring(0, begin);
                var p2 = str.substring(begin, end);
                var p3 = str.substring(end);
                return p1 + "<strong>" + p2 + "</strong>" + p3;
            } else {
                return str;
            }
        },

        render: function () {
            this._unbindEvents();
            this._bindEvents();

            var visible = this.filterRepresentation.get('visible');

            if (visible) {
                this.$el.removeClass('hide');
                var stateClass = this._stateClass();
                var collapseClass = this._collapseClass();
                var filterRepresentation = this.filterRepresentation.toJSON();
                var label = this._strongZone(filterRepresentation.visibleLabel, filterRepresentation.matchIndexBegin, filterRepresentation.matchIndexEnd);

                var context = {
                    filterRepresentation: filterRepresentation,
                    label: new Handlebars.SafeString(label),
                    stateClass: stateClass,
                    collapseClass: collapseClass
                };
                this.$el.html(this.template(context));
                this.$el.css("padding-left", this.filterRepresentation.get('level') * 18);
            } else {
                this.$el.addClass('hide');
                this.$el.html('');
            }

            return this.el;
        }

    });
}());