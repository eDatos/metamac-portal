(function () {
    "use strict";

    App.namespace("App.datasource.helper.ApiIndicatorResponseToApiResponse");

    var ATTRIBUTE_OBS_CONF = "OBS_CONF";
    var DEFAULT = "__default__";

    App.datasource.helper.ApiIndicatorResponseToApiResponse = {

        indicatorResponseToResponse: function (response) {
            var parsedResponse = {
                data: {
                    observations: response.observation,
                    attributes: this.indicatorDataAttributesToDataAttributes(response.attribute),
                    dimensions: {
                        dimension: this.indicatorDimensionsToDimensions(response.dimension)
                    }
                }
            }
            return parsedResponse;
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
         * @return {{total: number, attribute: {}}}
         */
        indicatorDataAttributesToDataAttributes: function (attributes) {
            if (!attributes) { return; }
            var self = this;

            const attributesObj = {};
            for (const attribute of attributes) {
                if (attribute) {
                    _.map(attribute, (a) => a.code).forEach((code) => {
                        attributesObj[code] = [];
                    });
                }
            }

            for (const attribute of attributes) {
                for (const code of Object.keys(attributesObj)) {
                    const translatedValue = attribute && attribute[code] ? self.getTranslatedString(attribute[code].value) : "";
                    attributesObj[code].push(translatedValue);
                }
            }

            const mappedAttributes = _.mapObject(attributesObj, (value, key) => {
                return {
                    id: key,
                    value: value.join(" | ")
                };
            });

            return {
                attribute: mappedAttributes,
                total: Object.keys(mappedAttributes).length,
            };
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
            const attributesList = Object.values(_.mapObject(attributes, (attribute, _) => {
                return {
                    id: attribute.code,
                    name: {
                        text: this.localisedStringToInternationalString(attribute.title),
                    },
                    attachmentLevel: this.indicatorAttachmentLevelToDatasetAttachmentLevel(attribute.attachmentLevel)
                }
            }));
            return {
                attribute: attributesList,
                total: attributesList.length
            }
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
            return Object.entries(_.omit(localisedString, "__default__")).map(function([key, value]) {
                return {
                    lang: key,
                    value: value
                }
            });
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
