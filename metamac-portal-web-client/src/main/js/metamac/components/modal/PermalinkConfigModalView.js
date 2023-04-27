(function () {
    "use strict";

    var DatasetPermalink = App.modules.dataset.DatasetPermalink;
    var DynamicSelectionBuilder = App.modules.dataset.DatasetDynamicSelectionBuilder;

    App.namespace('App.components.modal.PermalinkConfigModalView');

    App.components.modal.PermalinkConfigModalView = Backbone.View.extend({

        template: App.templateManager.get("components/modal/modal-permalink-config"),

        events: {
            "submit": "createPermalinkAndSubmit",
            "change #update-periods": "showUpdatePeriodsOptions",
            "change #selected-periods": "showSelectedPeriodsOptions",
            "change #periods-quantity": "onDataQuantityChosen",
            "change #periods-date": "onDataDateChosen",
            "change #periods-all": "onDataAllChosen",
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
                    self.onSubmit(permalink, self.getExtraDataForSubmit());
                });
            } else {
                var errorEl = this.$("#permalink-config-error")[0];
                errorEl.innerText = errorMessage;
            }
        },

        createPermalink: function () {
            var dynamicSelectionBuilder = DynamicSelectionBuilder();
            if(this.areUpdatePeriodsOptionsNecessary()) {
                if(this.$("#periods-quantity")[0].checked) {
                    dynamicSelectionBuilder.selectNLastTemporalDimensionCategories(this.$("#periods-quantity-related-input")[0].valueAsNumber);
                } else if(this.$("#periods-all")[0].checked) {
                    dynamicSelectionBuilder.selectAllTemporalDimensionCategories();
                } else {
                    var chosenCategoryAttributes = this.getTemporalDimensionCategories().find(function(val) {
                        return val.get("id") === self.$("#periods-date-related-input")[0].value
                    }).attributes;
                    dynamicSelectionBuilder.selectTemporalDimensionCategoriesAfterDate(chosenCategoryAttributes);
                }
            }
            var permalinkContent = DatasetPermalink.buildPermalinkContent(
                this.filterDimensions,
                dynamicSelectionBuilder.build(),
                this.isLastVersionSelected());
            return DatasetPermalink.savePermalink(permalinkContent);
        },

        isLastVersionSelected: function () {
            if (this.areThereVersions()) {
                if (this.isThereTemporalDimension()) {
                    return !this.$("#selected-periods")[0].checked || this.$("#data-review-checkbox")[0].checked;
                } else {
                    return this.$("#version-last")[0].disabled || this.$("#version-last")[0].checked;
                }
            } else {
                return true;
            }
        },

        validateFilter: function () {
            if(this.isThereTemporalDimension() && this.areUpdatePeriodsOptionsNecessary()) {
                if (!this.$("#periods-all")[0].checked && !this.$("#periods-quantity")[0].checked && !this.$("#periods-date")[0].checked) {
                    return I18n.t("modal.permalinkConfig.error.periods");
                } else if (!this.$("#periods-quantity-related-input")[0].disabled) {
                    var value = this.$("#periods-quantity-related-input")[0].valueAsNumber;
                    if (!Number.isInteger(value) || value < 1) {
                        return I18n.t("modal.permalinkConfig.error.quantity");
                    }
                }
            }
        },

        showUpdatePeriodsOptions: function () {
            this.$("#update-periods-options")[0].hidden = false;
            this.$("#selected-periods-options")[0].hidden = true;
        },

        showSelectedPeriodsOptions: function () {
            this.$("#update-periods-options")[0].hidden = true;
            this.$("#selected-periods-options")[0].hidden = false;
        },

        onDataQuantityChosen: function () {
            this.$("#periods-quantity-related-input")[0].disabled = false;
            this.$("#periods-date-related-input")[0].disabled = true;
        },

        onDataDateChosen: function () {
            this.$("#periods-quantity-related-input")[0].disabled = true;
            this.$("#periods-date-related-input")[0].disabled = false;
        },

        onDataAllChosen: function () {
            this.$("#periods-date-related-input")[0].disabled = true;
            this.$("#periods-quantity-related-input")[0].disabled = true;
        },

        hideError: function () {
            var saveErrorElement = this.$("#permalink-config-error")[0];
            if (saveErrorElement) {
                saveErrorElement.innerText = "";
            }
        },

        areThereVersions: function () {
            return App.queryParams.type === "dataset" && this.filterDimensions.metadata.metadata.keepAllData;
        },

        isThereTemporalDimension: function () {
            return !_.isUndefined(this.getTemporalDimension());
        },

        areUpdatePeriodsOptionsNecessary: function () {
            return this.isThereTemporalDimension() && (this.$("#update-periods").length > 0 && this.$("#update-periods")[0].checked);
        },

        getTemporalDimensionCategories: function () {
            var temporalDimension = this.getTemporalDimension();
            return temporalDimension ? temporalDimension.get("representations").models : [];
        },

        getTemporalDimension: function () {
            return this.filterDimensions.models.find(function(dimension) {
                return dimension.isTimeDimension();
            });
        },

        render: function () {
            this.$el.html(this.template({
                thereAreVersions: this.areThereVersions(),
                thereIsTemporalDimension: this.isThereTemporalDimension(),
                defaultCustomQueryName: this.filterDimensions.metadata.getTitle(),
                dimensionCategories: this.getTemporalDimensionCategories().map(function(category) { return category.attributes })
            }));

            this.$el.find("#periods-quantity-related-input").mouseup(e => e.stopPropagation());
        },

        getExtraDataForSubmit: function () {
            return {};
        }
    });

}());