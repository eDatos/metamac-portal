(function () {
    "use strict";

    App.namespace('App.modules.dataset.filter.models.FilterTableInfo');

    var DIMVAL_INDENT = "  ";

    var combineExpanding = function (arr1, arr2) {
        if (arr1.length === 0) return arr2;
        if (arr2.length === 0) return arr1;
        return _.reduce(arr1, function (memo, elem1) {
            memo.push(elem1);
            var clonedArr2 = _.map(arr2, _.clone);
            return memo.concat(clonedArr2);
        }, []);
    };

    var repeatStr = function (str, n) {
        return (new Array(n + 1)).join(str)
    };

    var incrementArray = function (arr, prop, value) {
        _.each(arr, function (e) {
            e[prop] += value;
        });
        return arr;
    };

    App.modules.dataset.filter.models.FilterTableInfo = Backbone.Model.extend({

        initialize: function (attributes) {
            this.filterDimensions = attributes.filterDimensions;
            this._initializeTableInfo();
            this._initializeLeftHeaderValues();
        },

        _initializeTableInfo: function () {
            this.top = this._initializeTableInfoForDimensions(this.filterDimensions.dimensionsAtZone('top'));
            this.left = this._initializeTableInfoForDimensions(this.filterDimensions.dimensionsAtZone('left'));
            this.fixed = this._initializeTableInfoForDimensions(this.filterDimensions.dimensionsAtZone('fixed'));
        },

        _initializeTableInfoForDimensions: function (dimensions) {
            if (dimensions.length > 0) {
                var result = {
                    ids: [],
                    representationsValues: [],
                    representationsDescriptions: [],
                    representationsMeasureUnits: [],
                    representationsIds: [],
                    representationsLengths: []
                };

                dimensions.each(function (dimension) {
                    result.ids.push(dimension.id);
                    var representations = dimension.get('representations').where({ drawable: true });

                    if (dimension.get('type') === "TIME_DIMENSION") {
                        var group = _.groupBy(representations, function (representation) {
                            return representation.has('normCode') ? 'hasNormCode' : 'dontHasNormCode';
                        });
                        representations = _.sortBy(group.hasNormCode, function (representation) {
                            return representation.get('normCode');
                        }).reverse();
                        representations.push.apply(representations, group.dontHasNormCode);
                    }

                    result.representationsValues.push(_.invoke(representations, 'get', 'visibleLabel'));
                    result.representationsDescriptions.push(_.invoke(representations, 'get', 'description'));
                    result.representationsMeasureUnits.push(_.invoke(representations, 'get', 'measureUnit'));
                    result.representationsIds.push(_.invoke(representations, 'get', 'id'));
                    result.representationsLengths.push(representations.length);
                });

                result.representationsMult = App.Table.Utils.rightProductAcumulate(result.representationsLengths);
                return result;
            } else {
                // Empty header should have at least an empty element
                return {
                    ids: [undefined],
                    representationsValues: [
                        [""]
                    ],
                    representationsDescriptions: [
                        [""]
                    ],
                    representationsMeasureUnits: [
                        [""]
                    ],
                    representationsIds: [
                        [undefined]
                    ],
                    representationsLengths: [1],
                    representationsMult: [1]
                };
            }
        },

        _initializeLeftHeaderValues: function () {
            var headerValuesGroupByDimension = this.filterDimensions.zones.get('left').get('dimensions').map(function (dimension) {
                var selectedRepresentations = dimension.get('representations').where({ drawable: true });
                return _.invoke(selectedRepresentations, 'pick', 'visibleLabel', 'level');
            });

            // plain update of nested dimensions and levels
            var headerValues = _.reduceRight(headerValuesGroupByDimension, function (memo, headerValuesInDimension) {
                var levels = _.pluck(headerValuesInDimension, 'level');
                
                // if not specify a function for sort, the elements are sorted in ascending, ASCII character order.
                //   example: [1, 11, 10, 2].sort() returns [1, 10, 11, 2]
                var orderedLevels = _.uniq(levels)
                    .map(function(level) { return parseInt(level); })
                    .sort(function(a, b) { return a - b; });
                incrementArray(memo, 'level', orderedLevels.length);
                var normalizedHeaderValuesInDimension = _.map(headerValuesInDimension, function (headerValue) {
                    headerValue.level = _.indexOf(orderedLevels, headerValue.level);
                    return headerValue;
                });
                return combineExpanding(normalizedHeaderValuesInDimension, memo);
            }, []);
            // indent using level
            var labels = _.map(headerValues, function (headerValue) {
                return {
                    level: headerValue.level,
                    label: repeatStr(DIMVAL_INDENT, headerValue.level) + headerValue.visibleLabel
                };
            });
            this.leftHeaderValues = [labels];
        },

        getCategoryForCell: function (cell, representationType) {
            var permutation = {},
                i, index, representation, dimensionId;

            for (i = 0; i < this.left.ids.length; i++) {
                index = (Math.floor(cell.y / this.left.representationsMult[i])) % this.left.representationsLengths[i];
                representation = this.left[representationType][i][index];
                dimensionId = this.left.ids[i];
                if (dimensionId) {
                    permutation[dimensionId] = representation;
                }
            }

            for (i = 0; i < this.top.ids.length; i++) {
                index = (Math.floor(cell.x / this.top.representationsMult[i])) % this.top.representationsLengths[i];
                representation = this.top[representationType][i][index];
                dimensionId = this.top.ids[i];
                if (dimensionId) {
                    permutation[dimensionId] = representation;
                }
            }

            // Fixed dimensions has one single value by definition
            for (i = 0; i < this.fixed.ids.length; i++) {
                representation = this.fixed[representationType][i][0];
                dimensionId = this.fixed.ids[i];
                if (dimensionId) {
                    permutation[dimensionId] = representation;
                }
            }

            return permutation;
        },

        /**
         *  @param {Number} cell.x
         *  @param {Number} cell.y
         *
         *  @return { dim1 : ['cat1', 'cat2'], dim2 : ['cat1'] }
         */
        getCategoryIdsForCell: function (cell) {
            return this.getCategoryForCell(cell, "representationsIds");
        },

        getCategoryValuesForCell: function (cell) {
            return this.getCategoryForCell(cell, "representationsValues");
        },

        getCellForCategoryIds: function (ids) {
            var self = this;
            var result = { x: 0, y: 0 };
            _.each(ids, function (categoryId, dimensionId) {
                var dimension = self.filterDimensions.get(dimensionId);
                if (dimension) {
                    var zone = dimension.get('zone').get('id');
                    if (zone === "left" || zone === "top") {
                        var dimensionIndex = _.indexOf(self[zone].ids, dimension.id);
                        var representationIndex = _.indexOf(self[zone].representationsIds[dimensionIndex], categoryId);
                        var mult = self[zone].representationsMult[dimensionIndex];

                        if (zone === "left") {
                            result.y = result.y + mult * representationIndex;
                        } else if (zone === "top") {
                            result.x = result.x + mult * representationIndex;
                        }
                    }

                }
            });
            return result;
        },

        /**
         *  @param {Number} region.left.begin
         *  @param {Number} region.left.end
         *  @param {Number} region.top.begin
         *  @param {Number} region.top.end
         *
         *  @return { dim1 : ['cat1', 'cat2'], dim2 : ['cat1'] }
         */
        getCategoryIdsForRegion: function (region) {
            var permutations = [];
            for (var x = region.left.begin; x < region.left.end; x++) {
                for (var y = region.top.begin; y < region.top.end; y++) {
                    permutations.push(this.getCategoryIdsForCell({ x: x, y: y }));
                }
            }

            var result = {};
            _.each(permutations, function (permutation) {
                _.each(permutation, function (representation, dimension) {
                    if (!result[dimension]) {
                        result[dimension] = [];
                    }
                    result[dimension].push(representation);
                });
            });

            result = _.map(result, function (representation, dimension) {
                return { id: dimension, representations: _.unique(representation) };
            });

            return result;
        },

        _dimensionsTotalSize: function (representationsLength) {
            var size = _.reduce(representationsLength, function (mem, value) {
                return mem * value;
            }, 1);
            return size;
        },

        _dimensionsLeftTotalSize: function (representationsLength) {
            var size = _.reduceRight(representationsLength, function (mem, value) {
                return value + value * mem;
            }, 0);
            return size;
        },

        // How many rows are in dimension, included the empty one with its name. Used to calculate the blank rows on the table
        elementsByLeftDimension: function (representationsLengths, dimension) {
            representationsLengths = representationsLengths.slice(dimension);
            var size = _.reduceRight(representationsLengths, function (mem, value) {
                return value + value * mem;
            }, 0);
            return size + 1;
        },

        blanksByLeftDimension: function (representationsLengths, dimension) {
            representationsLengths = representationsLengths.slice(dimension);
            var size = _.reduceRight(representationsLengths, function (mem, value) {
                return 1 + value * mem;
            }, 0);
            return size;
        },

        /**
         * @return {columns : {Number}, rows : {Number}} Table size
         */
        getTableSize: function () {
            return {
                columns: this._dimensionsTotalSize(this.top.representationsLengths),
                rows: this._dimensionsLeftTotalSize(this.left.representationsLengths)
            };
        }

    });

}());