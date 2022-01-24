(function () {
    "use strict";

    App.namespace("App.DataSourceDataset");

    App.DataSourceDataset = function (options) {
        this.data = options.data;
        this.filterDimensions = options.filterDimensions;
    };

    App.DataSourceDataset.prototype = {

        leftHeaderColumns: function () {
            return 1;
        },

        leftHeaderValues: function () {
            return this.filterDimensions.getTableInfo().leftHeaderValues;
        },

        leftHeaderValuesByDimension: function () {
            return this.filterDimensions.getTableInfo().left.representationsValues;
        },

        leftHeaderDescriptionsByDimension: function () {
            return this.filterDimensions.getTableInfo().left.representationsDescriptions;
        },

        leftHeaderMeasureUnitsByDimension: function () {
            return this.filterDimensions.getTableInfo().left.representationsMeasureUnits;
        },

        leftHeaderDimensionsLengths: function () {
            return this.filterDimensions.getTableInfo().left.representationsLengths;
        },

        leftHeaderDimensionsElements: function (dimension) {
            return this.filterDimensions.getTableInfo().elementsByLeftDimension(this.leftHeaderDimensionsLengths(), dimension);
        },

        leftHeaderDimensionsBlanks: function (dimension) {
            return this.filterDimensions.getTableInfo().blanksByLeftDimension(this.leftHeaderDimensionsLengths(), dimension);
        },

        topHeaderRows: function () {
            return this.filterDimensions.getTableInfo().top.representationsValues.length;
        },

        topHeaderValues: function () {
            return this.filterDimensions.getTableInfo().top.representationsValues;
        },

        topHeaderDescriptions: function () {
            return this.filterDimensions.getTableInfo().top.representationsDescriptions;
        },

        topHeaderMeasureUnits: function () {
            return this.filterDimensions.getTableInfo().top.representationsMeasureUnits;
        },

        cellAtIndex: function (cell) {
            return this.data.getStringData({ cell: cell });
        },

        valueAtIndex: function (cell) {
            return this.data.getNumberData({ cell: cell });
        },

        cellExists: function (cell) {
            var tableSize = this.filterDimensions.getTableInfo().getTableSize();
            return (cell.y >= 0 && cell.x >= 0) &&
                (tableSize.rows > cell.y && tableSize.columns > cell.x);
        },

        cellHasPrimaryAttributes: function (cell) {
            var cellAttributes = this.data.getAttributes({ cell: cell });
            return !_.isUndefined(cellAttributes)
                && !_.isUndefined(cellAttributes.primaryMeasureAttributes)
                && _.compact(_.pluck(cellAttributes.primaryMeasureAttributes, 'value')).length > 0;
        },

        cellAttributesAtIndex: function (cell) {
            return this.data.getAttributes({ cell: cell });
        },

        cellInfoAtIndex: function (cell) {
            var categoryValues = this.filterDimensions.getTableInfo().getCategoryValuesForCell(cell);
            var formattedCategories = this._formatCategories(categoryValues);
            var permutation = this.filterDimensions.getTableInfo().getCategoryIdsForCell(cell);
            return {
                attributes: this.cellAttributesAtIndex(cell),
                categories: formattedCategories,
                cellValue: this.data.getStringData({ids: permutation}),
                measureUnit: this.data.metadata.measureUnitForSelection(permutation)
            };
        },

        canDrawLineVisualizations: function () {
            return this.filterDimensions.canDrawLineVisualizations();
        },

        getCellTimeSerieAtIndex: function (cell) {
            var permutation = this.filterDimensions.getTableInfo().getCategoryIdsForCell(cell);
            return {
                data: this.data,
                permutation: permutation,
                timeDimension: this.filterDimensions.findWhere({ type: "TIME_DIMENSION" })
            }
        },

        _formatCategories: function (categoryValues) {
            var self = this;
            return _.map(categoryValues, function (value, key) {
                return {
                    dimension: self.filterDimensions.get(key).get('label'),
                    value: value
                };
            });
        },

        datasetAttributes: function () {
            return this.data.getDatasetAttributes();
        },

        rows: function () {
            return this.filterDimensions.getTableInfo().getTableSize().rows;
        },

        columns: function () {
            return this.filterDimensions.getTableInfo().getTableSize().columns;
        },

        isBlankRow: function (row) {
            // leftHeaderDimensionsLenghts and leftHeaderDimensionsElements represent a tree
            // We are looking on the tree. Leaf nodes, are non-blank. Non-leaf nodes, are blank
            var branchsByDimension = this.leftHeaderDimensionsLengths();
            for (var dimension = 0; dimension < branchsByDimension.length - 1; dimension++) {
                var dimensionElements = this.leftHeaderDimensionsElements(dimension + 1);

                if (branchsByDimension[dimension] > 1) {
                    for (var branch = 0; branch < branchsByDimension[dimension]; branch++ ) {
                        var firstNode = branch * dimensionElements + dimension;
                        if (row >= firstNode && row < (firstNode + dimensionElements)) {
                            row = branch > 0 ? (row % firstNode) + dimension : row;
                            break;
                        }
                    }
                }

                if ( row == dimension )
                    return true;
            }
            return false;
        },

        blankRowsOffset: function (row) {
            var dimensionElements = 0;
            var pos = row;
            var blanks = 0;

            // Starts on one because the first one is not nested on another dimension
            var blanksElementsForDimension = 0;
            for (var dimension = 1; dimension < this.leftHeaderDimensionsLengths().length; dimension++) {

                dimensionElements = this.leftHeaderDimensionsElements(dimension);
                blanksElementsForDimension = this.leftHeaderDimensionsBlanks(dimension);

                blanks += Math.floor(pos / dimensionElements) * blanksElementsForDimension;

                pos = pos % dimensionElements;
                if (pos == 0) { // Blank row
                    return blanks;
                } else { // "Enter" next dimension level
                    pos--;
                    blanks++;
                }
            }
            return blanks;
        },

        /**
         * Return top header tooltip values
         * {dimension.label} : {category.label}
         * @returns {Array}
         */
        topHeaderTooltipValues: function () {
            return this._generateTooltipValues(this.topHeaderValues(), this.topHeaderDescriptions(), this.topHeaderMeasureUnits(), this.filterDimensions.getTableInfo().top.ids);
        },

        /**
         * Return left header tooltips values
         * {dimension.label} : {category.label}
         * @returns {Array}
         */
        leftHeaderTooltipValues: function () {
            var leftHeaderTooltipValuesByDimension = this._generateTooltipValues(this.leftHeaderValuesByDimension(), this.leftHeaderDescriptionsByDimension(), this.leftHeaderMeasureUnitsByDimension(), this.filterDimensions.getTableInfo().left.ids);

            return this._compressLeftHeaderValuesByDimension(leftHeaderTooltipValuesByDimension);
        },

        _compressLeftHeaderValuesByDimension: function (valuesByDimension) {
            var memo = [];
            return [_.flatten(_.reduceRight(valuesByDimension, function (memo, values) {
                return _.map(values, function (value) {
                    return [value].concat(memo);
                });
            }, memo, this))];
        },

        _generateTooltipValues: function (titlesByDimension, descriptionsByDimension, measureUnitsByDimension, dimensionIds) {
            var result = [];

            _.each(titlesByDimension, function (titles, dimensionIndex) {
                result.push(
                    _.map(titlesByDimension[dimensionIndex], function (title, titleIndex) {
                        return { 
                            title: title,
                            description: descriptionsByDimension[dimensionIndex][titleIndex],
                            measureUnit: measureUnitsByDimension[dimensionIndex][titleIndex],
                            dimensionId: dimensionIds[dimensionIndex]
                        }
                    })
                );
            });

            return result;
        }

    };

    _.extend(App.DataSourceDataset.prototype, Backbone.Events);

}());
