(function () {
    "use strict";

    App.namespace("App.datasource.model.MetadataResponse");

    App.datasource.model.MetadataResponse = function (options) {
        this.initialize(options);
    };

    App.datasource.model.MetadataResponse.prototype = {

        initialize: function (options) {
            this.datasourceIdentifier = options.datasourceIdentifier;
            this.datasourceHelper = options.datasourceHelper;
            this.parse(options.response);
        },

        parse: function (response) {
            var metadataResponse = this.datasourceHelper.typedMetadataResponseToMetadataResponse(response);
            this.metadataResponse = _.extend(this.identifier(), metadataResponse);
            this.selectedLanguages = this.metadataResponse.selectedLanguages.language;
            this.metadata = this.metadataResponse.metadata;
            this.initializeLocalesIndex();
            this.initializeCache();
        },

        identifier: function () {
            return this.datasourceIdentifier.getIdentifier();
        },

        urlIdentifierPart: function () {
            return this.datasourceHelper.buildUrlIdentifierPart(this.identifier());
        },

        buildQueryString: function (identifier) {
            var version = identifier.type === "dataset" ? ["version", identifier.version].join('=') : '';
            var agencyId = identifier.agency ? ['agencyId', identifier.agency].join('=') : "";
            var indicatorSystem = identifier.indicatorSystem ? ['indicatorSystem', identifier.indicatorSystem].join('=') : "";
            var permalinkId = identifier.permalinkId ? ['permalinkId', identifier.permalinkId].join('=') : "";
            return _.compact([
                agencyId,
                ['resourceId', identifier.identifier].join('='),
                version,
                ['resourceType', identifier.type].join('='),
                indicatorSystem,
                permalinkId
            ]).join('&');
        },

        hasMultidataset: function () {
            return !!this.identifier().multidatasetId;
        },

        getVisualizerUrlForWidget: function () {
            return [
                this.getSharedVisualizerUrl(),
                '?', this.buildQueryString(this.identifier())
                // Dont include window.location.hash here, the permalink include it
            ].join('');
        },

        getSharedVisualizerUrl: function () {
            if (!_.isEmpty(App.endpoints["sharedVisualizerUrl"])) {
                return App.endpoints["sharedVisualizerUrl"];
            } else {
                return [window.location.protocol, '//', window.location.host, window.location.pathname].join('');
            }
        },

        initializeCache: function () {
            var measureDimension = this.getMeasureDimension() ? this.getMeasureDimension().id : null;
            this.decimalsForSelection = _.memoize(this.decimalsForSelection, function (selection) {
                if (measureDimension) {
                    return selection[measureDimension];
                } else {
                    return JSON.stringify(selection);
                }
            });
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

        getLocalizedLabel: function (label) {
            if (label) {
                return this.localizeLabel(label.text);
            }
        },

        _htmlDecode: function (value) {
            return $('<div/>').html(value).text();
        },

        getIdentifier: function () {
            return this.metadataResponse.id;
        },

        getLanguages: function () {
            if (this.metadata.languages) {
                var self = this;
                var languages = this.metadata.languages.resource;
                var id = _.pluck(languages, 'id');
                var label = _.reduce(languages, function (memo, language) {
                    memo[language.id] = self.localizeLabel(language.name.text);
                    return memo;
                }, {});
                return { id: id, label: label };
            }
        },


        getIdsAndLocalizedLabels: function (from) {
            var result = _.map(from.id, function (id) {
                return { id: id, label: this.localizeLabel(from.label[id]) };
            }, this);
            return result;
        },

        _dimensionHasHierarchy: function (dimension) {
            return _.any(dimension.dimensionValues.value, function (dimensionValue) {
                return _.has(dimensionValue, 'visualisationParent');
            });
        },

        getDimensions: function () {
            var dimensions = this.metadata.dimensions.dimension;
            var result = _.map(dimensions, function (dimension) {
                return {
                    id: dimension.id,
                    label: this.localizeLabel(dimension.name.text),
                    type: dimension.type,
                    hierarchy: this._dimensionHasHierarchy(dimension)
                };
            }, this);
            return result;
        },

        _sortHierarchyRepresentations: function (representations) {
            //group by parents
            var representationsByParent = _.groupBy(representations, function (representation) {
                return representation.parent;
            });


            // recursive depth tree traversal
            var rootRepresentations = representationsByParent["undefined"];
            var sortedRepresentations = [];
            var depthTreeTraversal = function (node) {
                sortedRepresentations.push(node);
                _.each(representationsByParent[node.id], depthTreeTraversal);
            };
            _.each(rootRepresentations, depthTreeTraversal);
            return sortedRepresentations;
        },

        getDefaultDecimals: function () {
            return _.has(this.metadata.relatedDsd, 'showDecimals') ? this.metadata.relatedDsd.showDecimals : App.Constants.metadata.defaultDecimals;
        },

        getGeographicDimensionNormCode: function (dimensionValue) {
            var variableElement = dimensionValue.variableElement;
            if (variableElement) {
                var normCode = variableElement.urn.split("=")[1];
                return normCode;
            }
            return null;
        },

        getRepresentations: function (dimensionId) {
            var self = this;
            var dimensions = this.metadata.dimensions.dimension;
            var dimension = _.findWhere(dimensions, { id: dimensionId });
            var representations = [];

            if (dimension && dimension.dimensionValues) {
                var isMeasureDimension = dimension.type === "MEASURE_DIMENSION";
                var isGeographic = dimension.type === "GEOGRAPHIC_DIMENSION";
                var isTemporal = dimension.type === 'TIME_DIMENSION';
                var dimensionValues = dimension.dimensionValues.value;
                representations = _.map(dimensionValues, function(dimensionValue, index) {
                    var representation = _.pick(dimensionValue, 'id', 'open', 'temporalGranularity');
                    representation.label = self.localizeLabel(dimensionValue.name.text);

                    if (dimensionValue.measureQuantity && dimensionValue.measureQuantity.unitCode) {
                        representation.measureUnit = self.localizeLabel(dimensionValue.measureQuantity.unitCode.name.text);
                    }

                    if (dimensionValue.description && dimensionValue.description.text) {
                        representation.description = self.localizeLabel(dimensionValue.description.text);
                    }

                    if (dimensionValue.visualisationParent) {
                        var parent = _.findWhere(dimensionValues, { urn: dimensionValue.visualisationParent });
                        if (parent) representation.parent = parent.id;
                    }

                    if (isTemporal && dimensionValue.temporalGranularity) {
                        if (index > 0) {
                            var previousIndex = index - 1;
                            var currentPriority = App.TemporalUtils.getTemporalGranularityPriority(dimensionValue.temporalGranularity);

                            while (previousIndex >= 0) {
                                var previousDimensionValue = dimensionValues[previousIndex];
                                var previousPriority = App.TemporalUtils.getTemporalGranularityPriority(previousDimensionValue.temporalGranularity);
                                if (previousPriority > currentPriority && App.TemporalUtils.contains(previousDimensionValue, dimensionValue)) {
                                    representation.parent = previousDimensionValue.id;
                                    break;
                                }

                                previousIndex --;
                            }
                        }
                    }

                    if (isGeographic) {
                        representation.normCode = self.getGeographicDimensionNormCode(dimensionValue);
                    }

                    if (isMeasureDimension) {
                        representation.decimals = _.has(dimensionValue, 'showDecimalsPrecision') ? dimensionValue.showDecimalsPrecision : self.getDefaultDecimals();
                    }
                    return representation;
                });

                //sort
                var hasHierarchy = this._dimensionHasHierarchy(dimension);
                representations = hasHierarchy ? this._sortHierarchyRepresentations(representations) : representations;
            }
            return representations;
        },

        getDimensionsAndRepresentations: function () {
            var self = this;
            var dimensions = this.getDimensions();
            _.each(dimensions, function (dimension) {
                dimension.representations = self.getRepresentations(dimension.id);
            });
            return dimensions;
        },

        getMeasureDimension: function () {
            var dimensions = this.getDimensionsAndRepresentations();
            return _.findWhere(dimensions, { type: 'MEASURE_DIMENSION' });
        },

        getTotalObservations: function () {
            var dimensions = this.getDimensionsAndRepresentations();
            var size = _.chain(dimensions)
                .map(function (dimension) {
                    return dimension.representations.length;
                })
                .reduce(function (mem, value) {
                    return mem * value;
                }, 1)
                .value();
            return size;
        },

        toJSON: function () {
            return {
                title: this.getTitle(),
                description: this.getDescription(),

                hasDescriptors: this.getSubtitle() || this.getAbstract() || this.getStatisticalOperation() || this.getSubjectAreas() || this.getFormatExtentObservations(),
                subtitle: this.getSubtitle(),
                abstract: this.getAbstract(),
                statisticalOperation: this.getStatisticalOperation(),
                subjectAreas: this.getSubjectAreas(),
                formatExtentObservations: this.getFormatExtentObservations(),

                hasPeriods: this.getDates().dateStart || this.getDates().dateEnd,
                dates: this.getDates(),

                hasVersionInfo: this.hasVersionInfo(),
                version: this.getVersion(),
                versionRationale: this.getVersionRationale(),
                replacesVersion: this.getReplacesVersion(),
                isReplacedByVersion: this.getIsReplacedByVersion(),
                replaces: this.getReplaces(),
                isReplacedBy: this.getIsReplacedBy(),
                nextVersion: this.getNextVersion(),
                dateNextUpdate: this.getDateNextUpdate(),
                updateFrequency: this.getUpdateFrequency(),


                publishers: this.getPublishers(),
                contributors: this.getContributors(),
                mediators: this.getMediators(),
                rightsHolder: this.getRightsHolder(),
                copyrightDate: this.getCopyrightDate(),
                license: this.getLicense(),
                accessRights: this.getAccessRights(),

                hasValidity: this.hasValidity(),
                statisticOfficiality: this.getStatisticOfficiality(),

                lastUpdate: this.getLastUpdate(),
                bibliographicCitation: this.getBibliographicCitation(),

                languages: this.getLanguages(),
                measureDimension: this.getMeasureDimension(),
                dimensions: this.getDimensions(),

                apiUrl: this.getApiUrl(),
                apiDocumentationUrl: this.getApiDocumentationUrl(),
                visualizerUrlForWidget: this.getVisualizerUrlForWidget(),
                keepAllData: this.getKeepAllData()
            };
        },

        getApiUrl: function () {
            var apiUrl = this.datasourceHelper.getBaseUrl() + this.urlIdentifierPart();
            if (App.DimensionsUtils.isIndicatorRequest()) {
                apiUrl = apiUrl + "/data";
            }
            return { href: apiUrl, name: apiUrl };
        },

        getApiDocumentationUrl: function () {
            var apiDocumentationUrl = this.datasourceHelper.getBaseUrl();
            return { href: apiDocumentationUrl, name: apiDocumentationUrl };
        },

        hasValidity: function () {
            return this.getDates().validFrom || this.getDates().validTo || this.getStatisticOfficiality();
        },

        hasVersionInfo: function () {
            return this.getVersion() ||
                this.getVersionRationale() ||
                this.getReplacesVersion() ||
                this.getIsReplacedByVersion() ||
                this.getReplaces() ||
                this.getIsReplacedBy() ||
                this.getNextVersion() ||
                this.getDateNextUpdate() ||
                this.getUpdateFrequency();
        },

        getAttributes: function () {
            if (this.metadata.attributes)
                return this.metadata.attributes.attribute;
        },

        getCategoryByNormCode: function (dimensionId, normCode) {
            var representations = this.getRepresentations(dimensionId);
            var selectedCategory = _.find(representations, function (category) {
                return category.normCode === normCode;
            });
            return selectedCategory;
        },

        getTimeDimensions: function () {
            var dimensions = this.getDimensions();
            return _.where(dimensions, { type: 'TIME_DIMENSION' });
        },

        decimalsForSelection: function (selection) {
            var selectedDimValue = this._findSelectedMeasureDimensionValue(selection);
            if (selectedDimValue) {
                return selectedDimValue.decimals;
            }
            return this.getDefaultDecimals();
        },

        measureUnitForSelection: function (selection) {
            var selectedDimValue = this._findSelectedMeasureDimensionValue(selection);
            if (selectedDimValue) {
                return selectedDimValue.measureUnit;
            }
        },

        _findSelectedMeasureDimensionValue: function (selection) {
            var measureDim = this.getMeasureDimension();
            var selectedDimValueId = measureDim ? selection[measureDim.id] : null;
            if (selectedDimValueId) {
                return _.findWhere(measureDim.representations, { id: selectedDimValueId });
            }
        },

        getDimensionsPosition: function () {
            var top = this.metadata.relatedDsd.heading.dimensionId;
            var left = this.metadata.relatedDsd.stub.dimensionId;
            return { top: top, left: left };
        },

        getAutoOpen: function () {
            return this.metadata.relatedDsd.autoOpen || false;
        },

        getMantainer: function () {
            return this.getLocalizedLabel(this.metadata.maintainer.name);
        },

        getStatisticalOperation: function () {
            return this._getResourceName(this.metadata.statisticalOperation);
        },

        getUri: function () {
            return this.metadataResponse.urn;
        },

        getTitle: function () {
            return this.getLocalizedLabel(this.metadataResponse.name);
        },

        getKeepAllData: function() {
            return this.metadata.keepAllData;
        },

        getSubtitle: function () {
            return this.getLocalizedLabel(this.metadata.subtitle);
        },

        getAbstract: function () {
            return this.getLocalizedLabel(this.metadata.abstract);
        },

        getDescription: function () {
            return this.getLocalizedLabel(this.metadataResponse.description);
        },

        getDates: function () {
            return {
                validFrom: this.metadata.validFrom,
                validTo: this.metadata.validTo,
                dateStart: this.metadata.dateStart,
                dateEnd: this.metadata.dateEnd
            };
        },

        getVersion: function () {
            return this.metadata.version;
        },

        getVersionRationale: function () {
            var types = this.metadata.versionRationaleTypes ? _.map(this.metadata.versionRationaleTypes.versionRationaleType, function (versionRationaleType) {
                return I18n.t("entity.dataset.versionRationale.enum." + versionRationaleType, { defaults: [{ message: "" }] });
            }) : [];
            return _.compact([
                types.join(', '),
                this.getLocalizedLabel(this.metadata.versionRationale)
            ]).join('. ');
        },

        getReplacesVersion: function () {
            if (this.metadata.replacesVersion) {
                return this.buildVisualizerUrl(this.metadata.replacesVersion);
            }
        },

        getIsReplacedByVersion: function () {
            if (this.metadata.isReplacedByVersion) {
                return this.buildVisualizerUrl(this.metadata.isReplacedByVersion);
            }
        },

        getReplaces: function () {
            if (this.metadata.replaces) {
                return this.buildVisualizerUrl(this.metadata.replaces);
            }
        },

        getIsReplacedBy: function () {
            if (this.metadata.isReplacedBy) {
                return this.buildVisualizerUrl(this.metadata.isReplacedBy);
            }
        },

        buildVisualizerUrl: function (resource) {
            if (resource.urn) {
                var identifier = this.getIdentifierFromUrn(resource.urn);
                return {
                    href: [
                        location.protocol,
                        '//',
                        location.host,
                        location.pathname,
                        '?', this.buildQueryString(identifier),
                        '#visualization/info'
                    ].join(''),
                    name: this.localizeLabel(resource.name.text)
                }
            }
        },

        getIdentifierFromUrn: function (urn) {
            var splittedUrn = urn.split("=");
            var resourcePrefix = splittedUrn[0];
            var statisticalResource = splittedUrn[1];

            var statisticalResourceRegex = /(\w+):([a-z_0-9]+)\(([0-9\.]+)\)/i;
            var statisticalResourceMatchs = statisticalResourceRegex.exec(statisticalResource);

            return {
                type: _.last(resourcePrefix.split(".")).toLowerCase(),
                agency: statisticalResourceMatchs[1],
                identifier: statisticalResourceMatchs[2],
                version: statisticalResourceMatchs[3]
            }
        },

        getNextVersion: function () {
            return I18n.t("entity.dataset.nextVersion.enum." + this.metadata.nextVersion, { defaultValue: "" });
        },

        getPublishers: function () {
            var self = this;
            if (this.metadata.publishers) {
                return _.map(this.metadata.publishers.resource, function (resource) { return self.localizeLabel(resource.name.text); });
            }
        },

        getContributors: function () {
            var self = this;
            if (this.metadata.contributors) {
                return _.map(this.metadata.contributors.resource, function (resource) { return self.localizeLabel(resource.name.text); });
            }
        },

        getMediators: function () {
            var self = this;
            if (this.metadata.mediators) {
                return _.map(this.metadata.mediators.resource, function (resource) { return self.localizeLabel(resource.name.text); });
            }
        },

        getRightsHolder: function () {
            return this._getResourceName(this.metadata.rightsHolder);
        },

        getCopyrightDate: function () {
            return this.metadata.copyrightDate;
        },

        getLicense: function () {
            return this.getLocalizedLabel(this.metadata.license);
        },

        getAccessRights: function () {
            return this.getLocalizedLabel(this.metadata.accessRights);
        },

        getSubjectAreas: function () {
            var self = this;
            if (this.metadata.subjectAreas) {
                return _.map(this.metadata.subjectAreas.resource, function (resource) { return self.localizeLabel(resource.name.text); });
            }
        },

        getFormatExtentObservations: function () {
            return this.metadata.formatExtentObservations;
        },
        getLastUpdate: function () {
            return this.metadata.lastUpdate;
        },

        getDateNextUpdate: function () {
            return this.metadata.dateNextUpdate;
        },

        getUpdateFrequency: function () {
            return this._getResourceName(this.metadata.updateFrequency);
        },

        getStatisticOfficiality: function () {
            if (this.metadata.statisticOfficiality) {
                return this.getLocalizedLabel(this.metadata.statisticOfficiality.name);
            }
        },

        getBibliographicCitation: function () {
            return this.getLocalizedLabel(this.metadata.bibliographicCitation);
        },

        _getResourceName: function (resource) {
            return resource && this.localizeLabel(resource.name.text);
        }
    };

}());
