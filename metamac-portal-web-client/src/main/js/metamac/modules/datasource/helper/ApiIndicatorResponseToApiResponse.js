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
                self.setGranularityType(parsedRepresentation, representation, dimension.code)
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
                    }
                }
            });
            return parsedDimensions;
        },

        indicatorDataAttributesToDataAttributes: function (attributes) {
            if (!attributes) { return; }
            var self = this;
            var values = _.map(attributes, function (attribute) {
                if (!attribute) {
                    return "";
                } else {
                    return self.getTranslatedString(attribute[ATTRIBUTE_OBS_CONF].value);
                }
            }).join(" | ");
            return {
                attribute: [
                    {
                        value: values,
                        id: ATTRIBUTE_OBS_CONF
                    }
                ],
                total: 1
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

            response.name = response.title;
            response.description = response.conceptDescription;

            response.metadata = {
                version: response.version,
                relatedDsd: {
                    heading: {
                        dimensionId: ["GEOGRAPHICAL", "MEASURE"] // Always this ones
                    },
                    stub: {
                        dimensionId: ["TIME"] // Always this ones
                    },
                    autoOpen: true
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

        indicatorMetadataAttributesToMetadataAttributes: function (attribute) {
            if (!attribute) { return null; }
            return {
                attribute: [
                    {
                        id: attribute[ATTRIBUTE_OBS_CONF].code,
                        name: {
                            text: this.localisedStringToInternationalString(attribute[ATTRIBUTE_OBS_CONF].title)
                        },
                        attachmentLevel: this.indicatorAttachmentLevelToDatasetAttachmentLevel(attribute[ATTRIBUTE_OBS_CONF].attachmentLevel)
                    }
                ],
                total: 1
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
            return _.filter(localisedString, function (value, key) {
                return key != DEFAULT;
            }).map(function (value, key) {
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