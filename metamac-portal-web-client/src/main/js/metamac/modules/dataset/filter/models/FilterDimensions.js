(function () {
    "use strict";

    App.namespace('App.modules.dataset.filter.models.FilterDimensions');

    var FilterZone = App.modules.dataset.filter.models.FilterZone;

    var zoneOffsets = { left: 0, top: 20, fixed: 40, axisy: 60 };

    App.modules.dataset.filter.models.FilterDimensions = Backbone.Collection.extend({

        model: App.modules.dataset.filter.models.FilterDimension,

        initialize: function (models, options) {
            this.metadata = options.metadata;
            var dimensionsAndRepresentations = this.metadata.getDimensionsAndRepresentations();
            var everyDimensionIsSingleValue = dimensionsAndRepresentations.every(dimension => dimension.representations.length <= 1);
            this.reset(dimensionsAndRepresentations, _.extend({ silent: true, everyDimensionIsSingleValue: everyDimensionIsSingleValue }, options));
            this._initializeZones();

            this.where({ singleValue: false }).at(0).set('open', true); //open the first dimension
            this._bindEvents();

            this.accordion = true; //accordion behaviour
            this.valuesToIgnoreStatus = { ZERO: !this.metadata.metadata.relatedDsd.showZeroValuesByDefault, NULL: !this.metadata.metadata.relatedDsd.showNullValuesByDefault }; 

            this.attributesLikeDimensions = this.metadata.getAttributesLikeDimensions();
        },

        _bindEvents: function () {
            this.listenTo(this, 'change:open', this._onChangeOpen);
            this.listenTo(this, 'change:drawable change:zone change:visibleLabelType', this._invalidateTableInfo);
            this.listenTo(this, 'reverse', this._invalidateTableInfo);
        },

        _initializeZones: function () {
            this.zones = App.modules.dataset.filter.models.FilterZones.initialize(this, this.metadata.getDimensionsPosition());
        },

        dimensionsAtZone: function (zoneId) {
            return this.zones.get(zoneId).get('dimensions');
        },

        isFixedZone: function (zoneId) {
            return this.zones.get(zoneId).isFixed();
        },

        getAllFixedDimensionsCopy: function () {
            var fixedDimensions = [];
            this.zones.getFixedZones().forEach(function (zone) {
                fixedDimensions = fixedDimensions.concat(_.clone(zone.get('dimensions').models));
            });
            return fixedDimensions;
        },

        getAllFixedDimensionsCopyByType: function (type) {
            return _(this.getAllFixedDimensionsCopy()).filter(function (dimension) {
                return dimension.get("type") == type;
            });
        },

        getAllNonFixedDimensionsCopyByType: function (type) {
            return this.filter(function (dimension) {
                return dimension.get("type") == type && !dimension.isFixedDimension();
            });
        },

        getDimensionsWithoutSelections: function () {
            return this.filter(function (dimension) {
                return !dimension.get('singleValue') && dimension.getSelectedRepresentations().length === 0;
            });
        },

        getDimensionsWithSomeRepresentationNotSelected: function () {
            return this.filter(function (dimension) {
                return dimension._getUnselectedRepresentations().length > 0;
            });
        },

        getTableInfo: function () {
            if (!this.tableInfo) {
                this.tableInfo = new App.modules.dataset.filter.models.FilterTableInfo({ filterDimensions: this });
            }
            return this.tableInfo;
        },
        
        getAttributesLikeDimensions: function() {
            return this.attributesLikeDimensions;
        },

        _invalidateTableInfo: function () {
            this.tableInfo = undefined;
        },

        _onChangeOpen: function (model, value) {
            if (value && this.accordion) {
                var openDimensions = this.where({ open: true });
                if (openDimensions.length > 1) {
                    this._closeDimensions(model, openDimensions);
                }
            }
        },

        closeOpenDimensions: function (model) {
            if (this.accordion) { //Accordion behaviour in dimensions
                var openDimensions = this.where({ open: true });
                this._closeDimensions(model, openDimensions);
            }
        },

        _closeDimensions: function (model, dimensions) {
            var otherOpenDimensions = _.find(dimensions, function (openDimension) {
                return !model || openDimension.id !== model.id;
            });
            if (otherOpenDimensions) {
                otherOpenDimensions.set({ open: false });
            }
        },

        _zoneIdFromPosition: function (position) {
            if (position < 20) return 'left';
            if (position < 40) return 'top';
            if (position >= 60 && position < 80) return 'axisy';
            return 'fixed';
        },

        importGeographicSelection: function (selection) {
            var geographicDimension = this.where({ type: "GEOGRAPHIC_DIMENSION" });
            if (!geographicDimension || geographicDimension.length !== 1) {
                console.info("No appropriate geographic dimension, maybe the dataset has attribute dimension instead");
                return;
            }
            geographicDimension = geographicDimension[0];
            var zone = geographicDimension.get('zone');
            var position = zoneOffsets[zone.id] + zone.get('dimensions').indexOf(geographicDimension);

            var selectedVariableElements = selection.split("|");
            var selectedAndValidatedVariableElements = [];
            for (var i = 0; i < selectedVariableElements.length; i++) {
                var representation = geographicDimension.getRepresentationsByVariableElementId(selectedVariableElements[i])[0];
                if (representation) {
                    selectedAndValidatedVariableElements.push(selectedVariableElements[i]);
                    if (representation.get("parent") && App.config["addAncestorsForGeoParam"]) {
                        var representationParent = geographicDimension.getRepresentationsById(representation.get("parent"))[0];
                        selectedVariableElements.push(representationParent.get("variableElementId"));
                    }
                }
            }

            var json = {};
            json[geographicDimension.id] = {
                position: position,
                visibleLabelType: App.modules.dataset.filter.models.FilterRepresentation.VISIBLE_LABEL_TYPES.LABEL,
                categories: geographicDimension.get('representations').models.map(representation => ({
                    id: representation.get("id"),
                    selected: selectedAndValidatedVariableElements.length === 0
                        || selectedAndValidatedVariableElements.includes(representation.get("variableElementId")),
                    drawable: representation.get("drawable")
                }))
            };
            this.importJSONSelection(json);
        },

        canDrawLineVisualizations: function () {
            var timeDimensions = this.where({ type: "TIME_DIMENSION", singleValue: false });
            return timeDimensions && timeDimensions.length > 0;
        },

        canDrawMapVisualizations: function () {
            return this.metadata.identifier().type != App.Constants.visualization.type.INDICATOR
                && this.metadata.identifier().type != App.Constants.visualization.type.INDICATOR_INSTANCE
                && this.checkGeographicDimensionsHaveGranularityWithMultipleElements();
        },

        checkGeographicDimensionsHaveGranularityWithMultipleElements: function() {
            var geoDimensionObject = this.findWhere({ type: "GEOGRAPHIC_DIMENSION" });
            return !!geoDimensionObject && geoDimensionObject.get("representations").hasGeographicGranularityWithMoreThanOneElement();
        },

        checkGeographicDimensionsWithTwoShapedElements: function() {
            var geoDimensionObject = this.findWhere( { type : "GEOGRAPHIC_DIMENSION" } );
            if (geoDimensionObject) {
                var geographicDimensions = geoDimensionObject.get("representations");
                return geographicDimensions.getGeographicRepresentationsWithMoreThanOneShapedElementSelected().length > 0;
            }
            return false;
        },

        checkGeographicDimensionsWithTwoSelectedElements: function() {
            var geoDimensionObject = this.findWhere( { type : "GEOGRAPHIC_DIMENSION" } );
            if (geoDimensionObject) {
                var geographicDimensions = geoDimensionObject.get("representations");
                return geographicDimensions.getGeographicRepresentationsWithMoreThanOneSelectedElement().length > 0;
            }
            return false;
        },

        preprocessSelectionWithDynamicSelection: function(selection, dynamicSelection) {
            if (dynamicSelection) {
                if(!_.isEmpty(dynamicSelection.dimension.type)) {
                    if(dynamicSelection.dimension.type.TIME_DIMENSION) {
                        var self = this;
                        var temporalDimensionId = Object.keys(selection).find(function (key) {
                            return self.get(key).get("type") === 'TIME_DIMENSION';
                        });

                        var selectionCopy = JSON.parse(JSON.stringify(selection));
                        selectionCopy[temporalDimensionId].categories = [];

                        var timeDynamicSelection = dynamicSelection.dimension.type.TIME_DIMENSION;
                        var selectedLeft = timeDynamicSelection.lastNValues;
                        var afterDate = timeDynamicSelection.afterDate;
                        var selectAll = timeDynamicSelection.all;
                        var granularity = timeDynamicSelection.granularity;
                        _.each(this.get(temporalDimensionId).get("representations").models, function (category) {
                            var matchesGranularity = _.isUndefined(granularity) || _.isNull(granularity) || category.get("temporalGranularity") === granularity;

                            var selected = false;
                            if (matchesGranularity) {
                                if (selectAll) {
                                    selected = true;
                                } else if (isNaN(selectedLeft)) {
                                    selected = App.TemporalUtils.isAfter(afterDate, category.attributes);
                                } else {
                                    selected = Boolean(Math.max(0, selectedLeft--));
                                }
                            }

                            selectionCopy[temporalDimensionId].categories.push({
                                id: category.id,
                                selected: selected
                            });
                        });
                        return selectionCopy;
                    }
                }
            }
            return selection;
        },

        importJSONSelection: function (json) {

            var dimensionsToImport = _.chain(json).map(function (value, key) {
                value.id = key;
                return value;
            }).sortBy('position').value();

            _.each(dimensionsToImport, function (dimensionToImport) {
                var dimension = this.get(dimensionToImport.id);
                if (!dimension) throw new Error("invalid dimension");

                // visibleLabelType
                dimension.set('visibleLabelType', dimensionToImport.visibleLabelType);
                if (dimensionToImport.sortBy) { dimension.set('sortBy', dimensionToImport.sortBy); }

                //zone
                var zoneId = this._zoneIdFromPosition(dimensionToImport.position);
                this.zones.setDimensionZone(zoneId, dimension, { force: true });

                //selectedRepresentations
                var representations = dimension.get('representations');
                representations._unbindEvents();

                var mustUpdateDrawables = false;
                _.each(dimensionToImport.categories, function (category) {
                    if (!_.isUndefined(representations.get(category.id))) {
                        representations.get(category.id).set({ selected: category.selected });
                        if (_.isUndefined(category.drawable) || _.isNull(category.drawable)) {
                            mustUpdateDrawables = true;
                        } else {
                            representations.get(category.id).set({ drawable: category.drawable }, { silent: true });
                        }
                    }
                });

                this._calculateSelectedGeographicLevel(dimension, representations);
                this._calculateSelectedTemporalGranularity(dimension, representations);
                
                representations._bindEvents();
                if(mustUpdateDrawables) {
                    representations.trigger("change:selected:immediate");
                } else {
                    representations.trigger("change:drawable");
                }
            }, this);
            this.zones.applyFixedSizeRestriction();
        },

        _calculateSelectedGeographicLevel: function (dimension, representations) {
            var selectedGranularity = _.uniq(_.map(representations.getSelectedAndDrawableRepresentations(), function(representation) {
                return representation.get('geographicGranularityId');
            }));
            if (dimension.get('type') === "GEOGRAPHIC_DIMENSION" && selectedGranularity.length === 1) {
                representations.setSelectedGeographicGranularity(selectedGranularity[0]);
            }
        },

        _calculateSelectedTemporalGranularity: function (dimension, representations) {
            var selectedGranularities = _.uniq(_.map(representations.getSelectedAndDrawableRepresentations(), function(representation) {
                return representation.get('temporalGranularity');
            }));
            if (dimension.get('type') === "TIME_DIMENSION" && selectedGranularities.length === 1) {
                representations.setSelectedTemporalGranularity(selectedGranularities[0]);
            }
        },

        exportJSONSelection: function () {
            var exportResult = {};
            this.each(function (dimension) {
                var zone = dimension.get('zone');
                var position = zoneOffsets[zone.id] + zone.get('dimensions').indexOf(dimension);
                var categories = _.map(dimension.get('representations').models, function(representation) {
                    return { 
                        id: representation.id,
                        selected: representation.get('selected'),
                        drawable: representation.get('drawable')
                    } 
                });
                exportResult[dimension.id] = {
                    position: position,
                    visibleLabelType: dimension.get('visibleLabelType'),
                    categories: categories,
                    sortBy: dimension.get('sortBy'),
                    reversed: dimension.get('reversed'),
                }
            });
            return exportResult;
        },


        hasMultidataset: function () {
            return this.metadata.hasMultidataset();
        },

        getMultidatasetId: function () {
            return this.metadata.identifier().multidatasetId;
        },

        setIgnoranceOfValue: function (value, isIgnored) {
            this.valuesToIgnoreStatus[value] = isIgnored;
            this.trigger('change:valuesToIgnore', this.getValuesToIgnore());
        },

        getValuesToIgnore: function () {
            var self = this;
            return Object.keys(this.valuesToIgnoreStatus || {}).filter(function(value) {return self.valuesToIgnoreStatus[value]})
        },

        getValuesToIgnoreStatus: function() {
            return this.valuesToIgnoreStatus;
        },

        exportJSONState: function () {
            return {
                valuesToIgnore: this.getValuesToIgnore()
            }
        },

        importJSONState: function (state) {
            if (state && Array.isArray(state.valuesToIgnore)) {
                this.valuesToIgnoreStatus = {};
                var self = this;

                state.valuesToIgnore.forEach(function(valueToIgnore) {
                    self.valuesToIgnoreStatus[valueToIgnore] = true;
                });

                this.trigger('change:valuesToIgnoreStatus');
            }
        }

    }, {
            initializeWithMetadata: function (metadata) {
                return new App.modules.dataset.filter.models.FilterDimensions(undefined, { metadata: metadata, parse: true });
            }
        });

}());
