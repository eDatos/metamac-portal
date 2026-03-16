(function () {
    App.namespace("App.components.navigationTabs");

    App.components.navigationTabs.RouteTabsView = Backbone.Marionette.ItemView.extend({

        template: "components/navigationTabs/navigation-tabs",

        events: {
            "click .navigation-tabs a": "changeType",
            "click .navigation-subtabs a": "changeType"
        },

        initialize: function (options) {
            this.tabs = options.tabs;
            this.optionsModel = options.optionsModel;
            this.listenTo(this.optionsModel, "change:type", this._onTypeChange);
        },

        serializeData: function () {
            return {
                tabs: this.tabs
            };
        },

        changeType: function (e) {
            var $target = $(e.currentTarget);

            if ($target.attr('href')) {
                return;
            }

            var type = $target.data('type');
            var $subtabs = this.$('.navigation-subtabs a[data-parent-type="' + type + '"]');
            if ($subtabs.length > 0) {
                var $activeSubtabs = $subtabs.filter('.active');
                type = ($activeSubtabs.length > 0 ? $activeSubtabs : $subtabs.first()).data('type');
            }

            if (this.optionsModel.get('filter')) {
                $(document).trigger('closeFilter');
            }

            this.optionsModel.set('type', type);
        },

        _onTypeChange: function () {
            var type = this.optionsModel.get('type');
            if (!type) {
                return;
            }

            this.$('.navigation-tabs a').removeClass('active');
            this.$('.navigation-subtabs a').removeClass('active').hide();

            var subTab = this.$('.navigation-subtabs a[data-type="' + type + '"]');
            if (subTab.length === 0) {
                this.$('.navigation-tabs a[data-type="' + type + '"]').addClass('active');
                this.$('.navigation-subtabs').hide();
            } else {
                subTab.addClass('active');

                var parentType = subTab.data('parentType');
                this.$('.navigation-tabs a[data-type="' + parentType + '"]').addClass('active');
                this.$('.navigation-subtabs a[data-parent-type="' + parentType + '"]').show();
                this.$('.navigation-subtabs').show();
            }
        }
    });
}());
