(function () {
    App.namespace("App.components.navigationTabs");

    App.components.navigationTabs.NavigationTabsView = Backbone.Marionette.ItemView.extend({

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
            const $target = $(e.currentTarget);

            if ($target.attr('href')) {
                return;
            }

            let type = $target.data('type');
            const $subtabs = this.$(`.navigation-subtabs a[data-parent-type="${type}"]`);
            if ($subtabs.length > 0) {
                const $activeSubtabs = $subtabs.filter('.active');
                const $defaultSubtab = $subtabs.filter('[data-default]');
                type = ($activeSubtabs.length > 0 ? $activeSubtabs : ($defaultSubtab.length > 0 ? $defaultSubtab : $subtabs.first())).data('type');
            }

            if (this.optionsModel.get('filter')) {
                $(document).trigger('closeFilter');
            }

            this.optionsModel.set('type', type);
        },

        _onTypeChange: function () {
            const type = this.optionsModel.get('type');
            if (!type) {
                return;
            }

            this.$('.navigation-tabs a').removeClass('active');
            this.$('.navigation-subtabs a').removeClass('active').hide();

            const subTab = this.$(`.navigation-subtabs a[data-type="${type}"]`);
            if (subTab.length === 0) {
                this.$(`.navigation-tabs a[data-type="${type}"]`).addClass('active');
                this.$('.navigation-subtabs').hide();
            } else {
                subTab.addClass('active');

                const parentType = subTab.data('parentType');
                this.$(`.navigation-tabs a[data-type="${parentType}"]`).addClass('active');
                this.$(`.navigation-subtabs a[data-parent-type="${parentType}"]`).show();
                this.$('.navigation-subtabs').show();
            }
        }
    });
}());
