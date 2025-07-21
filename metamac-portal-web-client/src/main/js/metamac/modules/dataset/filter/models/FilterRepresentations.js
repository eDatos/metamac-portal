(function () {
    "use strict";

    App.namespace('App.modules.dataset.filter.models.FilterRepresentations');

    App.modules.dataset.filter.models.FilterRepresentations = Backbone.Collection.extend({

        model: App.modules.dataset.filter.models.FilterRepresentation,

        initialize: function () {
            this.drawableLimit = Infinity;

            this.selectedGeographicalGranularity = null;
            this.selectedTemporalGranularity = null;
            this._bindEvents();
        },

        _bindEvents: function () {
            this.listenTo(this, 'change:selected', _.debounce(this._onChangeSelected, 100));
            this.listenTo(this, 'change:selected:immediate', _.debounce(this._onChangeSelected, 100, true));
            this.listenTo(this, 'change:drawable', this._onChangeDrawable);
        },

        _unbindEvents: function () {
            this.stopListening();
        },

        initializeHierarchy: function () {
            this.hasHierarchy = false;
            let originalLevel = this.models[0]?.get('level');

            const self = this;
            const modelsSortedByLevelReversed = _.sortBy(this.models, function (representation) {
                // updating this here is ugly, but efficient
                self.hasHierarchy = originalLevel !== representation.get('level') || self.hasHierarchy;
                return representation.get('level');
            }).reverse();

            _.each(modelsSortedByLevelReversed, function (parent) {
                if (self.hasHierarchy) {
                    const children = this.filter(representation => representation.get("parent") === parent.id);
                    if (children.length) {
                        parent.initChildren(children);
                        parent._onChangeOpenInit();
                    }
                } else {
                    parent.initNodesWithoutChildren();
                }
            }, this);
        },

        _updateDrawables: function () {
            var modelsToDraw = this._getModelsToDraw();

            _.invoke(this.models, 'set', { drawable: false }, { silent: true });
            _.invoke(modelsToDraw, 'set', { drawable: true }, { silent: true });
            this.trigger("change:drawable");
        },

        _getModelsToDraw: function () {
            var nModelsSelected = this.getSelectedRepresentations().length;
            var nModelsToDraw = this.drawableLimit - nModelsSelected;
            if (this.drawableLimit == nModelsSelected) {
                nModelsToDraw += 1; // Draw at least one model
            }
            return this.getSelectedRepresentations().slice(0, nModelsToDraw);
        },

        selectAll: function () {
            _.invoke(this.models, 'set', { selected: true });
        },

        selectVisible: function () {
            var visibleModels = this.filter(representation => representation.get("visible") && !representation.get("selected"));
            _.invoke(visibleModels, 'set', { selected: true });
        },

        deselectVisible: function () {
            var visibleModels = this.filter(representation => representation.get("visible") && representation.get("selected"));
            _.invoke(visibleModels, 'set', { selected: false });
        },

        setDrawableLimit: function (drawableLimit) {
            this.drawableLimit = drawableLimit;
            this._updateDrawables();
        },

        toggleRepresentationsVisibleRange: function (start, end, state) {
            var visibleModels = this.filter(representation => representation.get("visible"));
            var modelsToChange = visibleModels.slice(start, end + 1);
            _.invoke(modelsToChange, 'set', { selected: state });
        },

        _onChangeSelected: function (model) {
            this._updateDrawables();
        },

        _onChangeDrawable: function (model) {
            if (!model) { return; }

            var drawableModels = this.getDrawableRepresentations();
            if (!model.get('drawable') && drawableModels.length === 0) {
                model.set('drawable', true);
            }

            if (model.get('drawable') && drawableModels.length > this.drawableLimit) {
                var otherModel = _.find(drawableModels, function (drawableModel) {
                    return drawableModel.id !== model.id;
                });
                otherModel.set('drawable', false);
            }
        },

        parse: function (representations) {
            //group by parents
            var representationsByParent = _.groupBy(representations, function (representation) {
                return representation.parent;
            });

            //sort by levels
            for (var parent in representationsByParent) {
                representationsByParent[parent] = _.sortBy(representationsByParent[parent], 'order');
            }

            // recursive depth tree traversal for hierarchy order
            var rootRepresentations = representationsByParent["undefined"];
            var sortedRepresentations = [];
            var depthTreeTraversal = function (level, node) {
                node.level = level;
                sortedRepresentations.push(node);
                _.each(representationsByParent[node.id], _.partial(depthTreeTraversal, level + 1));
            };
            _.each(rootRepresentations, _.partial(depthTreeTraversal, 0));

            return sortedRepresentations;
        },

        reverse: function () {
            this.reset(this.last(this.length).reverse());
            this.trigger("reverse");
        },

        getSelectedRepresentations: function () {
            return this.filter(representation => representation.get("selected"));
        },

        getSelectedAndDrawableRepresentations: function () {
            return this.filter(representation => representation.get("selected") && representation.get("drawable"));
        },

        _getUnselectedRepresentations: function () {
            return this.filter(representation => !representation.get("selected"));
        },

        getRepresentationsByLevel: function (level) {
            return this.filter(representation => representation.get("level") === level);
        },

        getRepresentationsByNormCode: function (normCode) {
            return this.filter(representation => representation.get("normCode") === normCode);
        },

        getRepresentationsByVariableElementId: function (variableElementId) {
            return this.filter(representation => representation.get("variableElementId") === variableElementId);
        },

        getRepresentationsById: function (id) {
            return this.filter(representation => representation.get("id") === id);
        },

        getGeographicRepresentationsWithMoreThanOneElementSelected : function() {
            return this.filter(item => {
                // Filter selected elements
                if (item.get('selected')) {
                  // check that there are more items selected in your level
                  return this.filter(subItem => subItem.get('level') === item.get('level') && subItem.get('selected')).length > 1;
                }
                return false;
              });
        },

        updateSelectedGeographicLevelIfNoElementsInLevel: function() {
            //take the actual SelectedGeographicalLevel
            var level = this.getSelectedGeographicGranularity();
            //take the representations of the current level that have more than one element selected
            var filterRepresentations = this.getGeographicRepresentationsWithMoreThanOneElementSelected().filter(item => item.get('level').toString() === level);
            //If there are no elements selected, then we perform the update
            if (filterRepresentations.length == 0) {
                this.updateSelectedGeographicGranularityWithMostRepeatedValue();
            }
        },

        getDrawableRepresentations: function () {
            return this.filter(representation => representation.get("drawable"));
        },

        updateDrawablesBySelectedGeographicGranularity: function () {
            if (this.getSelectedRepresentationsByCurrentGeographicGranularity().length === 0) {
                this.updateSelectedGeographicGranularityWithMostRepeatedValue();
            }

            _.invoke(this.models, 'set', { drawable: false }, { silent: true });
            _.invoke(this.getSelectedRepresentationsByCurrentGeographicGranularity(), 'set', { drawable: true });
            this.trigger("change:drawable");
        },

        getSelectedRepresentationsByCurrentGeographicGranularity: function () {
            return this.filter(representation => representation.get("geographicGranularityId") === this.selectedGeographicalGranularity && representation.get("selected"));
        },

        updateDrawablesBySelectedGranularity: function () {
            if (this.getSelectedRepresentationsByCurrentGranularity().length === 0) {
                this.updateSelectedTemporalGranularityWithMostRepeatedValue();
            }

            _.invoke(this.models, 'set', { drawable: false }, { silent: true });
            _.invoke(this.getSelectedRepresentationsByCurrentGranularity(), 'set', { drawable: true }, { silent: true });
            this.trigger("change:drawable");
        },

        getSelectedRepresentationsByCurrentGranularity: function () {
            return this.filter(representation => representation.get("temporalGranularity") === this.selectedTemporalGranularity && representation.get("selected"));
        },

        getRepresentationsByTemporalGranularity: function (temporalGranularity) {
            return this.filter(representation => representation.get("temporalGranularity") === temporalGranularity);
        },

        setSelectedGeographicGranularity: function (geographicalGranularity) {
            this.selectedGeographicalGranularity = geographicalGranularity;
        },

        getSelectedGeographicGranularity: function () {
            if (this.selectedGeographicalGranularity == null) {
                this.updateSelectedGeographicGranularityWithMostRepeatedValue();
            }
            return this.selectedGeographicalGranularity;
        },

        updateSelectedGeographicGranularityWithMostRepeatedValue: function () {
            this.selectedGeographicalGranularity = this._getMostRepeatedValue(this.getSelectedGeographicGranularities());
        },

        getSelectedGeographicGranularities: function () {
            return _(this.getGeographicRepresentationsWithMoreThanOneElementSelected()).invoke("get", "geographicGranularityId");
        },

        setSelectedTemporalGranularity: function(temporalGranularity) {
            this.selectedTemporalGranularity = temporalGranularity;
        },

        getSelectedTemporalGranularity: function () {
            if (this.selectedTemporalGranularity == null) {
                this.updateSelectedTemporalGranularityWithMostRepeatedValue();
            }
            return this.selectedTemporalGranularity;
        },

        updateSelectedTemporalGranularityWithMostRepeatedValue: function () {
            this.selectedTemporalGranularity = this._getMostRepeatedValue(this.getSelectedTemporalGranularities());
        },

        getSelectedTemporalGranularities: function () {
            return _(this.getSelectedRepresentations()).invoke("get", "temporalGranularity");
        },

        getAllTemporalGranularities: function () {
            return this.invoke("get", "temporalGranularity");
        },

        _getMostRepeatedValue: function (collection) {
            var countedBy = _(collection).countBy();
            var maxPopulation = _(countedBy).max();
            return _.invert(countedBy)[maxPopulation];
        },

        getSingleValue: function() {
            return this.models[0];
        }
    }, {
        initializeWithRepresentations: function (representations, singleValue) {
            var filterRepresentations = new App.modules.dataset.filter.models.FilterRepresentations(representations, {parse: true});
            if (!singleValue) {
                filterRepresentations.initializeHierarchy();
            }

            return filterRepresentations;
        }
    });

}());
