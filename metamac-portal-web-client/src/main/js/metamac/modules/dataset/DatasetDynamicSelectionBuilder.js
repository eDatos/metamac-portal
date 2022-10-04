(function () {
    "use strict";

    App.namespace('App.modules.dataset.DatasetDynamicSelectionBuilder');

    App.modules.dataset.DatasetDynamicSelectionBuilder = function() {
        return {
            dynamicSelection: {
                dimension: {
                    type: {}
                }
            },

            selectTemporalDimensionCategoriesAfterDate: function (value) {
                this.dynamicSelection.dimension.type.TIME_DIMENSION = {
                    afterDate: _.pick(value, "id", "temporalGranularity")
                };
                return this;
            },

            selectNLastTemporalDimensionCategories: function (value) {
                this.dynamicSelection.dimension.type.TIME_DIMENSION = {
                    lastNValues: value
                };
                return this;
            },

            selectAllTemporalDimensionCategories: function () {
                this.dynamicSelection.dimension.type.TIME_DIMENSION = {
                    all: true
                };
                return this;
            },

            build: function () {
                return this.dynamicSelection;
            }
        }
    };

}());