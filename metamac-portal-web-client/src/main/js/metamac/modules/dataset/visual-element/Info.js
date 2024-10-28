(function () {
    "use strict";

    App.namespace("App.VisualElement.Info");

    App.VisualElement.Info = function (options) {
        this.initialize(options);
        this._type = 'info';
        this.api = new App.dataset.StructuralResourcesApi({ metadata: this.data.metadata });
    };

    App.VisualElement.Info.prototype = new App.VisualElement.Base();

    _.extend(App.VisualElement.Info.prototype, {

        template: App.templateManager.get("dataset/dataset-info"),

        load: function () {
            this.getDimensions();
            this.getMeasureConcepts();
            this.getMetadataFromRelatedDataset();
            this.getDatasetAttributes();
            this.getMultidataset();
            this._getSelectionApiUrl();
            this._bindEvents();
            this.render();
        },

        updateMeasureConcepts: function (concepts) {
            this.measureConcepts = concepts;
            this.render();
        },

        updateDimensions: function (dimensions) {
            var self = this;
            self.dimensions = dimensions;
            self.nonMeasureDimensions = _.filter(self.dimensions, function (dimension) { 
                return dimension.type !== "MEASURE_DIMENSION"  && !self.filterDimensions.get(dimension.id).get('singleValue'); 
            });
            self.dimensionLikeAttributes = _.chain(self.dimensions)
                .filter(function (dimension) { 
                    return self.filterDimensions.get(dimension.id).get('singleValue'); 
                })
                .map(function(dimension) {
                    return {
                        name: self.filterDimensions.get(dimension.id).get('label'),
                        value: self.filterDimensions.get(dimension.id).get('representations').getSingleValue().get('label')
                    }
                })
                .value();
            self.render();
        },

        updateMetadataFromRelatedDataset: function (datasetMetadata) {
            this.metadataFromRelatedDataset = datasetMetadata;
            this.render();
        },

        getDatasetAttributes: function () {
            this.datasetAttributes = this.data.getDatasetAttributes();
        },

        getMultidataset: function() {
            var multidatasetId = this.filterDimensions.getMultidatasetId();
            if (!multidatasetId) { return; }
            var self = this;
            self.multidataset = new App.modules.multidataset.Multidataset({
                multidatasetIdentifier: multidatasetId,
                filterDimensions: self.filterDimensions
            });
            self.multidataset.fetch().then(function() {
                self.render();
            })
        },

        _updateSelectionApiUrl: function () {
            this._getSelectionApiUrl();
            this.render();
        },

        _getSelectionApiUrl: function () {
            var apiUrl = this.data.metadata.getApiUrl();
            var dimensionParameter = App.DimensionsUtils.getDimensionsParameterForRequest(this._getDimensionsForApiUrl());
            this.selectionApiUrl = {
                name: apiUrl.name + '?' + dimensionParameter,
                href: apiUrl.href + '?' + dimensionParameter,
                isVisible: !!dimensionParameter
            }
        },

        getDimensions: function () {
            var self = this;
            this.api.getDimensions(function (error, dimensions) {
                self.updateDimensions(dimensions);

                self.api.getDimensionsConcepts(dimensions, function (error, dimensionsConcepts) {
                    var parsedDimensions = _.map(self.dimensions, function (dimension) {
                        var dimensionConcept = _.findWhere(dimensionsConcepts, { id: dimension.conceptIdentity.id });
                        dimension.conceptIdentity = dimensionConcept;
                        dimension.conceptName = App.DimensionsUtils.getDimensionLabel(dimensionConcept);
                        dimension.conceptDescription = App.InternationalizationUtils.localizeLabel(dimensionConcept.description);
                        return dimension;
                    });
                    self.updateDimensions(parsedDimensions);
                });
            });
        },

        getMetadataFromRelatedDataset: function () {
            if (this._isQuery()) {
                var datasourceIdentifier = App.datasource.DatasourceIdentifier.initializeWithUrn(this.data.metadata.metadata.relatedDataset.urn);
                var relatedDatasetMetadataRequest = new App.datasource.MetadataRequest(datasourceIdentifier);

                var self = this;
                relatedDatasetMetadataRequest.fetch(function () {
                    var datasetMetadata = relatedDatasetMetadataRequest.getMetadataResponse();
                    self.updateMetadataFromRelatedDataset(datasetMetadata);
                });
            }
        },

        getMeasureConcepts: function () {
            var self = this;
            this.api.getMeasureConcepts(function (error, concepts) {
                var parsedConcepts = _.map(concepts, function (concept) {
                    concept.name = App.InternationalizationUtils.localizeLabel(concept.name);
                    concept.description = App.InternationalizationUtils.localizeLabel(concept.description);
                    concept.annotations = concept.annotations ? _.map(concept.annotations.annotation, function (annotation) {
                        return {
                            href: annotation.url,
                            name: App.InternationalizationUtils.localizeLabel(annotation.text)
                        };
                    }) : [];
                    return concept;
                });
                self.updateMeasureConcepts(parsedConcepts);
            });
        },

        destroy: function () {
            this._unbindEvents();
        },

        _bindEvents: function () {
            this.listenTo(this.filterDimensions, "change:drawable change:zone change:visibleLabelType reverse", _.debounce(this._updateSelectionApiUrl, 20));
        },

        _unbindEvents: function () {
            this.stopListening();
        },

        updatingDimensionPositions: function () {
            this._applyVisualizationRestrictions();
            this.resetDimensionsLimits();
        },

        // This method must be the same as the one from the table to be able to download the data info in a coherent way with the table visualization
        _applyVisualizationRestrictions: function () {
            if (this._mustApplyVisualizationRestrictions()) {
                this._forceDimensionsByMetadataInfo();                
                this._moveAllSingleValueDimensionsToZone('fixed');
            }

            this._updateMustApplyVisualizationRestrictions();
        },

        render: function () {
            if (!this.$el) { return; }

            var context = {
                relatedResources: {
                    hasAnyRelatedResources: this._getRelatedResources().length || this._getMultidatasetRelatedResources().length,
                    dataset: this._getRelatedResources(),
                    multidataset: this._getMultidatasetRelatedResources()
                },
                metadata: this._getMetadata(),
                datasetAttributes: this.datasetAttributes,
                dimensionLikeAttributes: this.dimensionLikeAttributes,
                hasAttributesOrLikeAttributes: (this.datasetAttributes && this.datasetAttributes.length > 0) || (this.dimensionLikeAttributes && this.dimensionLikeAttributes.length > 0),
                measureConcepts: this.measureConcepts,
                nonMeasureDimensions: this.nonMeasureDimensions,
                urlParametersForDimensionSelection: this.selectionApiUrl,
                rightsHolder: this._getContextRightsHolder(),
                apiDownloadMessage: this._getApiDownloadMessage(),
                selectionApiDownloadMessage: this._getApiDownloadMessage(true)
            };
            this.$el.html(this.template(context));
            var scrollGroup = this.$el.find('.metadata-group');
            scrollGroup.perfectScrollbar();
            this.$el.find('.metadata-accordion').accordion({
                collapsible: true,
                active: this._isIndicator() ? 0 : false,
                heightStyle: "content",
                activate: function () {
                    scrollGroup.perfectScrollbar('update');
                }
            });

            scrollGroup.perfectScrollbar('update');
        },

        _getMetadata: function () {
            var metadata = this.data.metadata.toJSON();
            if (this._isQuery() && this.metadataFromRelatedDataset) {
                var formattedMetadataFromRelatedDataset = this.metadataFromRelatedDataset.toJSON();
                _.extend(metadata, _.pick(formattedMetadataFromRelatedDataset, 'subjectAreas', 'statisticOfficiality', 'dataProviders', 'dataProviderAnnotations',
                    'bibliographicCitation', 'rightsHolder', 'copyrightDate', 'license', 'accessRights', 'publishers', 'contributors', 'mediators'));
                metadata.formatExtentObservations = this.data.observations.length;
                metadata.hasDescriptors = !!metadata.subjectAreas || !!metadata.statisticalOperation || !!metadata.formatExtentObservations;
                metadata.hasValidity = metadata.dates.validFrom || metadata.dates.validTo || metadata.statisticOfficiality;

                if (this.data.metadata.metadata.type === "LATEST_DATA" || this.data.metadata.metadata.type === "AUTOINCREMENTAL") {
                    _.extend(metadata, _.pick(formattedMetadataFromRelatedDataset, 'nextVersion', 'dateNextUpdate', 'updateFrequency'));
                    metadata.hasVersionInfo = !!metadata.nextVersion || !!metadata.dateNextUpdate || !!metadata.updateFrequency;
                } else {
                    var versionProperties = ['version', 'versionRationale', 'keepAllData', 'replacesVersion', 'replaces', 'isReplacedByVersion', 'isReplacedBy', 'dateNextUpdate', 'updateFrequency'];
                    versionProperties.forEach(function (versionPropertyKey) {
                        metadata[versionPropertyKey] = undefined;
                    });
                    metadata.hasVersionInfo = !!metadata.nextVersion;
                }
            }
            return metadata;
        },

        _getContextRightsHolder: function () {
            if (this.showRightsHolderText()) {
                return (this._isQuery() && this.metadataFromRelatedDataset) ? this.metadataFromRelatedDataset.getRightsHolder() : this.getRightsHolderText();
            }
            return '';
        },

        _getDimensionsForApiUrl: function () {
            return _.map(this.filterDimensions.getDimensionsWithSomeRepresentationNotSelected(), function (dimension) {
                var representations = _.map(dimension.get("representations").where({ selected: true}), function(representation) {
                    return representation.id;
                });
                return {
                    id: dimension.id,
                    representations: representations
                };
            });
        },

        _isIndicator: function () {
            return App.Constants.visualization.type.INDICATOR === this.data.metadata.identifier().type || App.Constants.visualization.type.INDICATOR_INSTANCE === this.data.metadata.identifier().type;
        },

        _isQuery: function () {
            return App.Constants.visualization.type.QUERY === this.data.metadata.identifier().type;
        },

        _isDataset: function () {
            return App.Constants.visualization.type.DATASET === this.data.metadata.identifier().type;
        },

        _getApiDownloadMessage: function(selection) {
            var formats = this._getApiDownloadFormats();
            var formatExample = formats.indexOf(",") !== -1 ? formats.substring(0, formats.indexOf(",")) : formats;
            return selection ? 
                I18n.t("entity.dataset.selectionApiUrl.apiDownload", { formats: formats, formatExampleLowercase: formatExample.toLowerCase() }) 
                : I18n.t("entity.dataset.apiUrl.apiDownload", { formats: formats, formatExample: formatExample, formatExampleLowercase: formatExample.toLowerCase() });
        },

        _getApiDownloadFormats: function() {
            if (this._isQuery()) {
                return "XML, JSON, JSONSTAT";
            } else if (this._isIndicator()) {
                return "JSONSTAT";
            } else {
                return "CSV, TSV, XLSX, XML, JSON, JSONSTAT";
            }
        },

        _getRelatedResources: function() {
            var relatedResources = this.data.metadata.getRelatedResources();
            return this._parseRelatedResources(relatedResources);
        },

        _getMultidatasetRelatedResources: function() {
            var relatedResources = [];
            if (this.multidataset) {
                if (this.multidataset.get('nodes')) {
                    relatedResources = relatedResources.concat(this.multidataset.get('nodes').toJSON());
                }
                if (this.multidataset.get('metadata')) {
                    relatedResources = relatedResources.concat(this.multidataset.get('metadata').getRelatedResources());
                }
            };
            return this._parseRelatedResources(relatedResources);
        },
        
        _parseRelatedResources: function(relatedResources) {
            return _.chain(relatedResources)
                .uniq(function(resource) {
                    // This uniq is mainly for queries and collections, that don't keep visible versions to user
                    return resource.urn;
                })
                .map(function (resource) { 
                    var type = resource.kind && resource.kind.split('#').length > 1 ? resource.kind.split('#')[1] : ''; 
                    return {
                        href: resource.visualizerHtmlLink,
                        name: App.InternationalizationUtils.localizeLabel(resource.name),
                        type: type                            
                    }                        
                })
                .groupBy('type')
                .map(function(group, type) {
                    return {
                        label: type ? I18n.t('entity.kind.types.' + type ) : '',
                        group: group,
                    }
                })
                .value();
        },
    });

}());
