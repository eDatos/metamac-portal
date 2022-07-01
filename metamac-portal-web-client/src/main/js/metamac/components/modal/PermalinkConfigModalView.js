(function () {
    "use strict";

    var DatasetPermalink = App.modules.dataset.DatasetPermalink;
    var DynamicSelectionBuilder = App.modules.dataset.DatasetDynamicSelectionBuilder;

    App.namespace('App.components.modal.PermalinkConfigModalView');

    App.components.modal.PermalinkConfigModalView = Backbone.View.extend({

        template: App.templateManager.get("components/modal/modal-permalink-config"),

        events: {
            "submit": "createPermalinkAndSubmit",
            "change #version-current": "hideFieldData",
            "change #version-last": "showFieldData",
            "change #data-quantity": "onDataQuantityChosen",
            "change #data-date": "onDataDateChosen",
            "focus input, textarea, select": "hideError"
        },

        initialize: function () {
            this.filterDimensions = this.options.filterDimensions;
            this.onSubmit = this.options.onSubmit || (function() {});
        },

        createPermalinkAndSubmit: function(e) {
            e.preventDefault();
            var errorMessage = this.validateFilter();
            if(!errorMessage) {
                var self = this;
                this.createPermalink().then(function (permalink) {
                    self.onSubmit(permalink);
                });
            } else {
                var loginEl = this.$("#permalink-config-error")[0];
                loginEl.hidden = false;
                loginEl.innerText = errorMessage;
            }
        },

        createPermalink: function () {
            var dynamicSelectionBuilder = DynamicSelectionBuilder();
            if(this.isDataFieldNecessary()) {
                if(this.$("#data-quantity")[0].checked) {
                    dynamicSelectionBuilder.selectNLastTemporalDimensionCategories(this.$("#data-quantity-related-input")[0].valueAsNumber);
                } else {
                    var chosenCategoryAttributes = this.getTemporalDimensionCategories().find(function(val) {
                        return val.get("id") === self.$("#data-date-related-input")[0].value
                    }).attributes;
                    dynamicSelectionBuilder.selectTemporalDimensionCategoriesAfterDate(chosenCategoryAttributes);
                }
            }
            var permalinkContent = DatasetPermalink.buildPermalinkContent(
                this.filterDimensions,
                dynamicSelectionBuilder.build(),
                this.areThereVersions() ? this.$("#version-last")[0].checked : true);
            return DatasetPermalink.savePermalink(permalinkContent);
        },

        validateFilter: function () {
            if(this.isDataFieldNecessary() && !this.$("#data-quantity-related-input")[0].disabled) {
                var value = this.$("#data-quantity-related-input")[0].valueAsNumber;
                return Number.isInteger(value) && value >= 1 ? undefined : I18n.t("modal.permalinkConfig.error.quantity");
            }
        },

        hideFieldData: function () {
            this.$("#field-data")[0].hidden = true;
        },

        showFieldData: function () {
            this.$("#field-data")[0].hidden = !this.isDataFieldNecessary();
        },

        onDataQuantityChosen: function () {
            this.$("#data-quantity-related-input")[0].disabled = false;
            this.$("#data-date-related-input")[0].disabled = true;
        },

        onDataDateChosen: function () {
            this.$("#data-quantity-related-input")[0].disabled = true;
            this.$("#data-date-related-input")[0].disabled = false;
        },

        hideError: function () {
            var saveErrorElement = this.$("#permalink-config-error")[0];
            if (saveErrorElement) {
                saveErrorElement.hidden = true;
            }
        },

        areThereVersions: function () {
            return App.queryParams.type !== "indicator" && App.queryParams.type !== "indicatorInstance" && this.filterDimensions.metadata.metadata.keepAllData;
        },

        isDataFieldNecessary: function () {
            return !_.isUndefined(this.getTemporalDimension()) && (!this.areThereVersions() || (this.$("#version-last").length > 0 && this.$("#version-last")[0].checked));
        },

        getTemporalDimensionCategories: function () {
            var temporalDimension = this.getTemporalDimension();
            return temporalDimension ? temporalDimension.get("representations").models : [];
        },

        getTemporalDimension: function () {
            return this.filterDimensions.models.find(function(dimension) {
                return dimension.get("type") === "TIME_DIMENSION"
            });
        },

        render: function () {
            this.$el.html(this.template({
                thereAreVersions: this.areThereVersions(),
                dataFieldIsNecessary: this.isDataFieldNecessary(),
                defaultCustomQueryName: this.filterDimensions.metadata.getTitle(),
                dimensionCategories: this.getTemporalDimensionCategories().map(function(category) { return category.attributes })
            }));
        },
    });

}());