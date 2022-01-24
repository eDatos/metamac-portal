(function () {
    "use strict";

    App.namespace("App.datasource.model.Attributes");

    var ATTACHMENT_LEVELS = App.Constants.attributes.attachmentLevels;

    App.datasource.model.Attributes = function (options) {
        this.initialize(options);
    };

    App.datasource.model.Attributes.prototype = {

        initialize: function (options) {
            this.response = options.response;
            this.metadata = options.metadata;

            this.initializeLocalesIndex();
            this.attributesValues = !_.isUndefined(this.response.data.attributes) ? this.response.data.attributes.attribute : {};
            this.attributesMetadata = !_.isUndefined(this.metadata) ? this.metadata.getAttributes() : {};

            var attributesMetadataIndexed = _(this.attributesMetadata).indexBy("id");
            this.attributes = _(this.attributesValues).map(function (attributeValue) {
                return _.extend({}, attributesMetadataIndexed[attributeValue["id"]], attributeValue);
            });

            this.primaryMeasureAttributesValues = this.getPrimaryMeasureAttributesValues();
            this.combinatedDimensionsAttributes = this.getCombinatedDimensionsAttributes();
            this.dimensionsAttributes = this.getDimensionsAttributes();
            this.datasetAttributes = this.getDatasetAttributes();
        },

        // Example with attributes http://estadisticas.arte-consultores.com/statistical-resources-internal/apis/statistical-resources-internal/v1.0/datasets/ISTAC/C00031A_000002/001.006.json
        getPrimaryMeasureAttributesValues: function () {
            if (this.hasAttributes()) {
                var primaryMeasureAttributesRawValues = _.where(this.attributes, { attachmentLevel: ATTACHMENT_LEVELS.PRIMARY_MEASURE });
                var primaryMeasureAttributesParsedValues = _.map(primaryMeasureAttributesRawValues, this._parseAttributeValuesList, this);

                return this._combinePrimaryMeasureAttributesValues(primaryMeasureAttributesParsedValues);
            }
        },

        getPrimaryMeasureAttributesByPos: function (pos) {
            var attributeValues = this.primaryMeasureAttributesValues ? (this.primaryMeasureAttributesValues[pos] ? this.primaryMeasureAttributesValues[pos] : []) : [];
            var primaryMeasureAttributes = _.where(this.attributes, { attachmentLevel: ATTACHMENT_LEVELS.PRIMARY_MEASURE });
            var self = this;
            return _.map(attributeValues, function(atributeValue, i) {
                return {
                    value: atributeValue,
                    attribute: self.localizeLabel(primaryMeasureAttributes[i].name.text),
                };
            });
        },

        getCombinatedDimensionsAttributesByDimensionsPositions: function (dimensionsPositions) {
            var self = this;
            return _.map(this.combinatedDimensionsAttributes, function (combinatedDimensionAttribute) {
                self.dimensionsMultiplicators = combinatedDimensionAttribute.dimensionsMultiplicators;
                var pos = 0;
                pos = _.reduceRight(this, function (pos, arrayPosition, index) {
                    return pos += self.dimensionsMultiplicators[index] * arrayPosition;
                }, pos, self);
                return {
                    value: combinatedDimensionAttribute.values[pos],
                    attribute: self.localizeLabel(combinatedDimensionAttribute.attribute.name.text)
                }
            }, dimensionsPositions);
        },

        getCellAttributes: function (observationPosition, dimensionsPositions) {
            return {
                primaryMeasureAttributes: this.getPrimaryMeasureAttributesByPos(observationPosition),
                combinatedDimensionsAttributes: this.getCombinatedDimensionsAttributesByDimensionsPositions(dimensionsPositions),
                dimensionsAttributes: this.getDimensionsAttributesByDimensionsPositions(dimensionsPositions)
            };
        },

        getDimensionsAttributesByDimensionsPositions: function (dimensionsPositions) {
            var self = this;
            return _.map(this.dimensionsAttributes, function (combinatedDimensionAttribute) {
                self.dimensionsMultiplicators = combinatedDimensionAttribute.dimensionsMultiplicators;
                var pos = 0;
                pos = _.reduceRight(this, function (pos, arrayPosition, index) {
                    return pos += self.dimensionsMultiplicators[index] * arrayPosition;
                }, pos, self);
                return {
                    value: combinatedDimensionAttribute.values[pos],
                    dimensionId: combinatedDimensionAttribute.attributeDimensionsIds[0],
                    attribute: self.localizeLabel(combinatedDimensionAttribute.attribute.name.text)
                };
            }, dimensionsPositions);
        },

        getCombinatedDimensionsAttributes: function () {
            if (this.hasAttributes()) {
                var dimensionAttributesRawValues = _.where(this.attributes, { attachmentLevel: ATTACHMENT_LEVELS.DIMENSION });
                var dimensionAttributesRawValuesForCell = this._filterCombinatedDimensionAttributesForCell(dimensionAttributesRawValues);

                return _(dimensionAttributesRawValuesForCell).map(this._parseDimensionAttribute, this);
            }
        },

        getDimensionsAttributes: function () {
            if (this.hasAttributes()) {
                var dimensionAttributesRawValues = _.where(this.attributes, { attachmentLevel: ATTACHMENT_LEVELS.DIMENSION });
                var dimensionAttributesRawValuesForCell = this._filterDimensionAttributesForCell(dimensionAttributesRawValues);

                return _(dimensionAttributesRawValuesForCell).map(this._parseDimensionAttribute, this);
            }
        },

        _parseDimensionAttribute: function (attribute) {
            var attributeDimensionIds = _.pluck(attribute.dimensions.dimension, "dimensionId");
            var dimensionsMultiplicators = this._getDimensionsMultiplicators(attributeDimensionIds);
            var values = this._parseAttributeValuesList(attribute);

            return { values: values, dimensionsMultiplicators: dimensionsMultiplicators, attributeDimensionsIds: attributeDimensionIds, attribute: attribute };
        },

        _getDimensionsMultiplicators: function (attributeDimensionsIds) {
            var self = this;
            self.lastMultiplicator = 1;
            self.attributeDimensionsIds = attributeDimensionsIds;
            var dimensions = Array.prototype.slice.call(this.response.data.dimensions.dimension);

            dimensions.reverse();

            var dimensionsMultiplicators = _.map(dimensions, function (dimension) {
                if (_(self.attributeDimensionsIds).contains(dimension.dimensionId)) {
                    var result = self.lastMultiplicator;
                    self.lastMultiplicator *= dimension.representations.total;
                    return result;
                } else {
                    return 0;
                };
            }, self);

            dimensionsMultiplicators.reverse();

            return dimensionsMultiplicators;
        },

        getDatasetAttributes: function () {
            if (this.hasAttributes()) {
                var datasetAttributesRawValues = _.where(this.attributes, { attachmentLevel: ATTACHMENT_LEVELS.DATASET });
                var datasetAttributesParsedValues = _(datasetAttributesRawValues).map(this._parseDatasetValue, this);

                return this._combineDatasetAttributesValues(datasetAttributesParsedValues);
            }
        },

        getDimensionAttributesById: function (dimensionsIds) {
            if (this.hasAttributes()) {
                var dimensionAttributesRawValues = _.where(this.attributes, { attachmentLevel: ATTACHMENT_LEVELS.DIMENSION });
                var dimensionAttributesRawValuesForHeader = this._filterDimensionAttributesForHeader(dimensionAttributesRawValues, dimensionsIds);
                var dimensionAttributesParsedValues = _(dimensionAttributesRawValuesForHeader).map(this._parseDimensionValue, this);

                return this._combineDimensionAttributesValues(dimensionAttributesParsedValues);
            }
        },

        _filterDimensionAttributesForHeader: function (attributes, dimensionIds) {
            return _.map(dimensionIds, function (dimensionId) {
                return _.filter(attributes, function (item) {
                    return item.dimensions.total == 1 && dimensionId == item.dimensions.dimension[0].dimensionId;
                });
            });
        },

        _filterCombinatedDimensionAttributesForCell: function (attributes) {
            return _.filter(attributes, function (attribute) {
                return attribute.dimensions.total != 1;
            });
        },

        _filterDimensionAttributesForCell: function (attributes) {
            return _.filter(attributes, function (attribute) {
                return attribute.dimensions.total == 1;
            });
        },


        hasAttributes: function () {
            return !_.isEmpty(this.attributesValues) && !_.isEmpty(this.attributesMetadata);
        },

        _parseDimensionValue: function (attributesArray) {
            return _.map(attributesArray, this._parseAttributeValuesList, this);
        },

        _parseAttributeValuesList: function (attribute) {
            var attributeValues = this._splitList(attribute.value);

            var attributeEnumerates = attribute.attributeValues;
            if (attributeEnumerates) { // enumerated resource
                attributeEnumerates = _(attributeEnumerates.value).indexBy("id");
                var self = this;
                attributeValues = _.map(attributeValues, function (attributeRawValue) {
                    return self._getValueForEnumerate(attributeRawValue, attributeEnumerates);
                });
            }

            return attributeValues;
        },

        _splitList: function (list) {
            if (list) {
                var splittedList = list.replace("\\ | \\", " \\| ");
                // The scaped backslash will be processed on levels above for efficiency
                return splittedList = splittedList.split(" | ");
            } else {
                return [];
            }
        },

        _getValueForEnumerate: function (attributeRawValue, attributeEnumerates) {
            if (attributeRawValue != "") {
                if (!_.isUndefined(attributeEnumerates[attributeRawValue])) {
                    return attributeEnumerates[attributeRawValue] ? this.localizeLabel(attributeEnumerates[attributeRawValue].name.text) : null;
                } else {
                    return attributeRawValue;
                }
            } else {
                return "";
            }
        },

        initializeLocalesIndex: function () {
            this.localesIndex = {
                primary: I18n.locale,
                secondary: I18n.defaultLocale
            };
        },

        localizeLabel: function (labels) {
            if (labels) {
                var self = this;
                var label;
                if (this.localesIndex.primary) {
                    label = _.find(labels, function (label) {
                        return label.lang == self.localesIndex.primary;
                    });
                    if (label) label = label.value;
                }
                if (!label && this.localesIndex.secondary) {
                    label = _.find(labels, function (label) {
                        return label.lang == self.localesIndex.secondary;
                    });
                    if (label) label = label.value;
                }
                if (!label) {
                    label = _.first(labels).value
                }

                return label;
            }
        },

        _parseDatasetValue: function (attribute) {
            if (attribute.name.text) {
                attribute.name = this.localizeLabel(attribute.name.text);
            }

            var attributeEnumerates = attribute.attributeValues;
            if (attributeEnumerates) { // enumerated resource
                attributeEnumerates = _(attributeEnumerates.value).indexBy("id");
                attribute.value = this._getValueForEnumerate(attribute.value, attributeEnumerates);
            }

            if (!attribute.value.name) {
                attribute.value = { name: attribute.value, href: "" };
            }

            return attribute;
        },

        _combinePrimaryMeasureAttributesValues: function (primaryMeasureAttributesParsedValues) {
            return _.zip.apply(_, primaryMeasureAttributesParsedValues);
        },

        _combineDatasetAttributesValues: function (datasetAttributesParsedValues) {
            return datasetAttributesParsedValues;
        },

        _combineDimensionAttributesValues: function (dimensionAttributesParsedValues) {
            return dimensionAttributesParsedValues;
            //return _.map(dimensionAttributesParsedValues, function (dim) { return _.zip.apply(_, dim); })
        }
    };

}());
