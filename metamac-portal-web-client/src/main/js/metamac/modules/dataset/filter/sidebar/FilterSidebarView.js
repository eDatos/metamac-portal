(function () {
    "use strict";

    App.namespace("App.widget.filter.sidebar");

    var FilterSidebarDimensionView = App.widget.filter.sidebar.FilterSidebarDimensionView;
    var FilterSidebarMultidatasetView = App.widget.filter.sidebar.FilterSidebarMultidatasetView;

    App.widget.filter.sidebar.FilterSidebarView = Backbone.View.extend({

        template: App.templateManager.get('dataset/filter/sidebar/filter-sidebar-view'),

        id: "filterSidebar",
        icon: "filter-sidebar-icon-filter",
        title: I18n.t("filter.sidebar.filter.title"),

        initialize: function (options) {
            this.filterDimensions = options.filterDimensions;
            this.optionsModel = options.optionsModel;

            //Initialize subviews here to keep state

            this.subviews = this.filterDimensions
                .where({singleValue: false})                
                .map(function (dimension) {
                return new FilterSidebarDimensionView({
                    filterDimensions: this.filterDimensions,
                    filterDimension: dimension
                });
            }, this);

            if (this.filterDimensions.hasMultidataset()) {
                this.multidataset = new FilterSidebarMultidatasetView({
                    filterDimensions: this.filterDimensions
                });
            }

            this.title = I18n.t("filter.sidebar.filter.title");

            this.listenTo(this.filterDimensions, "change:valuesToIgnoreStatus", this.render);

            //_.last(this.subviews).stateModel.set('collapsed', false); // open last subview
        },

        destroy: function () {
            _.invoke(this.subviews, 'destroy');
            this._unbindEvents();
        },

        events: {
            "change .control-ignore-value": "onIgnoreDimensionValue"
        },

        onIgnoreDimensionValue: function(event) {
            var $target = $(event.target);
            var value = $target.data('value');
            
            this.filterDimensions.setIgnoranceOfValue(value, !$target.is(':checked'));
        },

        _bindEvents: function () {
            _.invoke(this.subviews, '_bindEvents');
            if (!this._resizeObserver) {
                this._resizeObserver = new ResizeObserver(_.bind(this._onResize, this));
                this._resizeObserver.observe(this.$el[0]);
            }
        },

        _unbindEvents: function () {
            _.invoke(this.subviews, '_unbindEvents');
            this._resizeObserver.disconnect();
            this._resizeObserver = null;
        },

        render: function () {
            this._unbindEvents();
            this._bindEvents();

            this.$el.html(this.template({
                valuesToIgnore: this.filterDimensions.getValuesToIgnoreStatus()
            }));

            var $dimensions = this.$('.filter-sidebar-dimensions');

            _.each(this.subviews, function (subview) {
                $dimensions.append(subview.render());
            }, this);

            if (this.multidataset) {
                var $multidatasets = this.$('.filter-sidebar-multidatasets');
                $multidatasets.append(this.multidataset.render());
            }

            this._onResize();
        },

        _onSubviewChangeCollapsed: function (changedView) {
            if (!changedView.stateModel.get('collapsed')) {
                _.chain(this.subviews)
                    .filter(function (subview) {
                        return changedView.cid !== subview.cid;
                    }).each(function (subview) {
                        subview.stateModel.set('collapsed', true);
                    });
            }
        },

        _onResize: function () {
            var totalCollapsedHeight = _.reduce(this.subviews, function (memo, subview) {
                return memo + subview.getCollapsedHeight();
            }, 0);

            if (this.multidataset) {
                totalCollapsedHeight += this.multidataset.getCollapsedHeight();
            }

            var maxHeight = this.$el.height() - totalCollapsedHeight;
            _.each(this.subviews, function (subview) {
                subview.setMaxHeight(maxHeight);
            });
        }

    });


}());
