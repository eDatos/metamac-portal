(function () {
    "use strict";

    App.namespace('App.modules.dataset.DatasetDynamicSelectionBuilder');

    var PERIOD_KEYS = ["afterDate", "lastNValues", "all"];

    App.modules.dataset.DatasetDynamicSelectionBuilder = function() {
        return {
            dynamicSelection: {
                dimension: {
                    type: {}
                }
            },

            selectTemporalDimensionCategoriesAfterDate: function (value) {
                this._setPeriod("afterDate", _.pick(value, "id", "temporalGranularity"));
                return this;
            },

            selectNLastTemporalDimensionCategories: function (value) {
                this._setPeriod("lastNValues", value);
                return this;
            },

            selectAllTemporalDimensionCategories: function () {
                this._setPeriod("all", true);
                return this;
            },

            _setPeriod: function (key, value) {
                var timeDimension = this._timeDimension();
                _.each(PERIOD_KEYS, function (periodKey) {
                    delete timeDimension[periodKey];
                });
                timeDimension[key] = value;
            },

            filterTemporalDimensionCategoriesByGranularity: function (granularity) {
                var timeDimension = this._timeDimension();
                if (_.isUndefined(granularity) || _.isNull(granularity)) {
                    delete timeDimension.granularity;
                } else {
                    timeDimension.granularity = granularity;
                }
                return this;
            },

            _timeDimension: function () {
                var type = this.dynamicSelection.dimension.type;
                type.TIME_DIMENSION = type.TIME_DIMENSION || {};
                return type.TIME_DIMENSION;
            },

            build: function () {
                return this.dynamicSelection;
            }
        };
    };

}());
