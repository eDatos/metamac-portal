(function () {
    "use strict";

    App.namespace("App.datasource.helper.ApiIndicatorResponseToApiResponse");

    var DEFAULT = "__default__";

    App.datasource.helper.ApiIndicatorResponseToApiResponse = {

        indicatorResponseToResponse: function (response) {
            return {
                data: {
                    observations: response.observation,
                    attributes: this.indicatorAttributesToDataAttributes(response.attributes, response.attribute),
                    dimensions: {
                        dimension: this.indicatorDimensionsToDimensions(response.dimension)
                    }
                }
            };
        },

        indicatorAttributesToDataAttributes: function (attributes, attribute) {
            var observationAttributes = this.indicatorObservationAttributesToDataAttributes(attribute);
            var datasetAndDimensionAttributes = this.indicatorDatasetAndDimensionAttributesToDataAttributes(attributes);
            var internationalAttribute = datasetAndDimensionAttributes.concat(observationAttributes);

            return {
                attribute: [],
                internationalAttribute: internationalAttribute,
                total: internationalAttribute.length
            };
        },

        indicatorObservationAttributesToDataAttributes: function (observationAttribute) {
            if (!observationAttribute) {
                return [];
            }

            var self = this;
            var valuesById = {};

            _.each(observationAttribute, function (attributesAtObservation, observationIndex) {
                _.each(attributesAtObservation, function (attributeValue, attributeCode) {
                    if (!valuesById[attributeCode]) {
                        valuesById[attributeCode] = new Array(observationAttribute.length).fill(null);
                    }
                    valuesById[attributeCode][observationIndex] = self.indicatorAttributeValueToInternationalText(attributeValue.value);
                });
            });

            return _.map(valuesById, function (values, id) {
                return { id: id, values: values };
            });
        },

        indicatorDimensionsToDimensions: function (dimensions) {
            var self = this;
            var parsedDimensions = _.map(dimensions, function (dimension, index) {
                return {
                    dimensionId: index,
                    representations: {
                        representation: self.indicatorRepresentationsToRepresentations(dimension.representation.index),
                        total: dimension.representation.size
                    }
                }
            });
            return parsedDimensions;
        },

        indicatorRepresentationsToRepresentations: function (representations) {
            // Probably inefficient because later we are going to use representationsIndex with this format so we are converting to and back
            return _.map(representations, function (value, index) {
                return {
                    code: index,
                    index: value
                }
            });
        },

        indicatorResponseToObservations: function (response) {
            return response.data.observations;
        },

        // ********* Metadata requests ************

        indicatorMetadataRepresentationsToMetadataRepresentations: function (dimension) {
            var self = this;
            return _.map(dimension.representation, function (representation) {
                var parsedRepresentation = representation;
                parsedRepresentation.id = representation.code;
                parsedRepresentation.name = {
                    text: self.indicatorInternationalTextToInternationalText(representation.title)
                };
                if (dimension.code === "MEASURE" && _.has(representation, 'quantity') && _.has(representation.quantity, 'decimalPlaces')) {
                    parsedRepresentation.showDecimalsPrecision = representation.quantity.decimalPlaces;
                }
                self.setGranularityType(parsedRepresentation, representation, dimension.code);
                if (representation.quantity) {
                    parsedRepresentation.measureQuantity = {
                        unitCode: {
                            name: {
                                text: self.indicatorInternationalTextToInternationalText(representation.quantity.unit)
                            }
                        }
                    };
                    if (representation.quantity.unitMultiplier) {
                        parsedRepresentation.measureQuantity.unitMultiplier = {
                            name: {
                                text: self.indicatorInternationalTextToInternationalText(representation.quantity.unitMultiplier)
                            },
                            // This is necessary because in the getUnitMultiplierAndUnitMeasureLabel method of DimensionsUtils.js it is checked
                            // that the urn ends with ".0" to know that the multiplier is "units". The condition is the same as the one in the
                            // getUnit method of Dataset.js in the indicator's repository.
                            // Take into account that unitMultiplier is one of the resources that indicator won't link with the SRM resource, so
                            // is not planned to have the resource URN here
                            urn: representation.quantity.unitMultiplier["es"] === "Unidades" ? ".0" : ""
                        };
                    }

                }
                return parsedRepresentation;
            });
        },

        setGranularityType: function (parsedRepresentation, representation, dimensionType) {
            switch (dimensionType) {
                case "TIME":
                    parsedRepresentation.temporalGranularity = representation.granularityCode;
                    break;
                case "GEOGRAPHICAL":
                    parsedRepresentation.geographicGranularity = {
                        id: representation.granularityCode
                    };
                    break;
                case "MEASURE":
                    break;
                default:
                    throw Error("Unsupported granularity type" + dimensionType)
            }
        },

        indicatorInternationalTextToInternationalText: function (text) {
            return _.map(text, function (value, key) {
                return {
                    value: value,
                    lang: key
                }
            });
        },

        indicatorMetadataDimensionsToMetadataDimensions: function (dimensions) {
            var self = this;
            var parsedDimensions = _.map(dimensions, function (dimension, index) {
                return {
                    id: index,
                    name: self._buildLocalizedText(I18n.t("indicator.dimension.name." + index), I18n.locale),
                    type: self.indicatorDimensionTypeToDimensionType(dimension.code),
                    dimensionValues: {
                        value: self.indicatorMetadataRepresentationsToMetadataRepresentations(dimension),
                        total: dimension.representation.length
                    },
                    showCode: dimension.showCode
                }
            });
            return parsedDimensions;
        },

        /**
         * @param attributes {Array} Array of attributes, each value in the array corresponds to the attributes of a value
         * of the indicator
         * @return {Array}
         */
        indicatorDatasetAndDimensionAttributesToDataAttributes: function (attributes) {
            var self = this;

            return _.map(attributes, function (attribute) {
                return {
                    id: attribute.id,
                    values: _.map(attribute.value, function (value) {
                        return self.indicatorAttributeValueToInternationalText(value);
                    })
                };
            });
        },

        indicatorAttributeValueToInternationalText: function (value) {
            if (!value) {
                return null;
            }

            var text = this.localisedStringToInternationalString(value);
            return text.length ? { text: text } : null;
        },

        indicatorDimensionTypeToDimensionType: function (dimensionType) {
            switch (dimensionType) {
                case "GEOGRAPHICAL":
                    return "GEOGRAPHIC_DIMENSION";
                case "MEASURE":
                    return "MEASURE_DIMENSION";
                case "TIME":
                    return "TIME_DIMENSION";
                default:
                    console.warn("Unsupported type for indicator dimension");
                    return dimensionType;
            }
        },

        getTranslatedString: function (localisedString) {
            return localisedString[I18n.locale] || localisedString[I18n.defaultLocale] || localisedString[DEFAULT];
        },

        indicatorMetadataResponseToMetadataResponse: function (response) {
            response.selectedLanguages = { // TODO revisar si esta property es necesaria
                language: [],
                total: 0
            };

            response.name = this.localisedStringToInternationalString(response.title);
            response.description = this.localisedStringToInternationalString(response.conceptDescription);

            response.metadata = {
                version: response.version,
                lastUpdate: response.lastUpdate,
                relatedDsd: {
                    heading: {
                        dimensionId: ["GEOGRAPHICAL", "MEASURE"] // Always this ones
                    },
                    stub: {
                        dimensionId: ["TIME"] // Always this ones
                    },
                    autoOpen: true,
                    showNullValuesByDefault: true,
                    showZeroValuesByDefault: true
                },
                dimensions: {
                    dimension: this.indicatorMetadataDimensionsToMetadataDimensions(response.dimension),
                    total: 3 // Always 3 for indicators
                },
                attributes: this.indicatorMetadataAttributesToMetadataAttributes(response.attribute)
                // We can´t simply translate them, we need a well formed resource
                // ,subjectAreas: {
                //     resource: [{
                //         name: self._buildLocalizedSpanishText(I18n.t("indicator.subjectAreas.name." + response.subjectCode, { defaultValue: response.subjectCode }))
                //     }]
                // }
            };
            if (_.has(response, 'decimalPlaces')) {
                response.metadata.relatedDsd.showDecimals = response.decimalPlaces;
            }
            this.getRightsHolder(response.metadata);
            return response;
        },

        indicatorMetadataAttributesToMetadataAttributes: function (attributes) {
            if (!attributes) { return null; }
            const attributesList = _.compact(Object.values(_.mapObject(attributes, (attribute, _) => {
                var attachmentLevel = this.indicatorAttachmentLevelToDatasetAttachmentLevel(attribute.attachmentLevel);

                if (attachmentLevel === App.Constants.attributes.attachmentLevels.DIMENSION && !(attribute.dimensions && attribute.dimensions.dimension)) {
                    console.error('Indicator attribute "' + attribute.code + '" has DIMENSION attachmentLevel but no dimensions info; skipping it.');
                    return null;
                }

                return {
                    id: attribute.code,
                    name: {
                        text: this.localisedStringToInternationalString(attribute.title),
                    },
                    attachmentLevel: attachmentLevel,
                    dimensions: attribute.dimensions
                };
            })));
            return {
                attribute: attributesList,
                total: attributesList.length
            };
        },

        indicatorAttachmentLevelToDatasetAttachmentLevel: function (indicatorAttachmentLevel) {
            switch (indicatorAttachmentLevel) {
                case "OBSERVATION":
                    return App.Constants.attributes.attachmentLevels.PRIMARY_MEASURE;
                case "DATASET":
                    return App.Constants.attributes.attachmentLevels.DATASET;
                case "DIMENSION":
                    return App.Constants.attributes.attachmentLevels.DIMENSION;
                default:
                    break;
            }
        },

        localisedStringToInternationalString: function (localisedString) {
            if (!localisedString) {
                return [];
            }

            var text = Object.entries(_.omit(localisedString, DEFAULT)).map(function ([key, value]) {
                return {
                    lang: key,
                    value: value
                };
            });

            if (!text.length && !_.isUndefined(localisedString[DEFAULT])) {
                text.push({ lang: I18n.defaultLocale, value: localisedString[DEFAULT] });
            }

            return text;
        },

        getRightsHolder: function (metadata) {
            if (!App.config["organisationUrn"]) return null;
            var api = new App.dataset.StructuralResourcesApi();
            api.getOrganisation(function (error, response) {
                metadata.rightsHolder = response;
            });
        },

        _buildLocalizedText: function (value, lang) {
            if (value == null) { return value };
            return {
                text: [{
                    value: value,
                    lang: lang
                }]
            };
        }

    };

}());
