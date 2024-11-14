(function () {
    "use strict";

    App.namespace('App.modules.dataset.filter.models.FilterDimension');

    var FilterRepresentation = App.modules.dataset.filter.models.FilterRepresentation;

    App.modules.dataset.filter.models.FilterDimension = Backbone.Model.extend({

        defaults: {
            zone: undefined,
            filterQuery: '',
            filterLevel: undefined,
            open: false,
            visibleLabelType: FilterRepresentation.VISIBLE_LABEL_TYPES.LABEL,
            reversed: false,
            representations: undefined,
            singleValue: false
        },

        initialize: function () {
            this._bindEvents();
            this.set('sortBy', this.isTimeDimension() ? App.Constants.dimension.sortBy.REPRESENTATION : App.Constants.dimension.sortBy.OBSERVATION);
            this.set('singleValue', this.get('representations').length == 1);
        },

        isFixedDimension: function () {
            if (this.get('zone')) {
                return this.get('zone').isFixed();
            } else {
                return false;
            }
        },

        isTimeDimension: function () {
            return this.get("type") === "TIME_DIMENSION";
        },

        _bindEvents: function () {
            this.listenTo(this, 'change:filterQuery', this._onChangeFilterQuery);
            this.listenTo(this, 'change:filterLevel', this._onChangeFilterLevel);
            this.listenTo(this, "change:visibleLabelType", this._onChangeVisibleLabelType);
            this.listenTo(this.get("representations"), "reverse", this._onReverse);
        },

        _unbindEvents: function () {
            this.stopListening();
        },

        _onReverse: function () {
            this.toggle('reversed');
            this.trigger("reverse");
        },

        removeFromZone: function () {
            var zone = this.get('zone');
            if (zone) {
                zone.remove(this);
            }
        },

        parse: function (attributes) {
            attributes.representations = App.modules.dataset.filter.models.FilterRepresentations.initializeWithRepresentations(attributes.representations);
            this.listenTo(attributes.representations, 'change:drawable', this._onRepresentationDrawableEvent);
            return attributes;
        },

        _onRepresentationDrawableEvent: function (model, collection, options) {
            this.trigger("change:drawable", model, collection, options);
        },

        _cleanFilterQuery: function (query) {
            return s.trim(s.cleanDiacritics(query).toLowerCase());
        },

        _onChangeFilterQuery: function () {
            this.set('filterLevel', this.defaults.filterLevel, { silent: true });

            var filterQuery = this._cleanFilterQuery(this.get('filterQuery'));
            var filterQueryLength = filterQuery.length;

            var representations = this.get('representations');
            representations.each(function (model) {
                model.set({ open: false }, { trigger: false });
            });

            var setObject = {};
            var visibleModels = [];
            representations.each(function (model) {
                var matchIndex = this._cleanFilterQuery(model.get('visibleLabel')).indexOf(filterQuery);
                var match = matchIndex !== -1;

                if (match) {
                    setObject[model.id] = { id: model.id, visible: true, matchIndexBegin: matchIndex, matchIndexEnd: matchIndex + filterQueryLength };
                    visibleModels.push(model);
                } else {
                    setObject[model.id] = { id: model.id, visible: false, matchIndexBegin: undefined, matchIndexEnd: undefined };
                }
            }, this);

            _.each(visibleModels, function (model) {
                var parentId = model.get('parent');
                while (parentId) {
                    var parent = representations.get(parentId);
                    setObject[parent.id].open = true;
                    setObject[parent.id].visible = true;
                    parentId = parent.get('parent');
                }
            }, this);

            representations.each(function (model) {
                model.set(setObject[model.id]);
            });
        },

        _onChangeFilterLevel: function () {
            this.stopListening(this, 'change:filterQuery', this._onChangeFilterQuery); //unbind to not trigger _onChangeFilterQuery
            this.set('filterQuery', this.defaults.filterQuery);
            this.listenTo(this, 'change:filterQuery', this._onChangeFilterQuery);

            var filterLevel = this.get('filterLevel');
            var representations = this.get('representations');
            if (_.isUndefined(filterLevel)) {
                representations.invoke('set', { visible: true, open: true })
            } else {
                if (this.isTimeDimension()) {
                    const granularities = this.getGranularities();
                    representations.each(function (model) {
                        const showAll = filterLevel === -1;
                        const temporalGranularityLevel = granularities.indexOf(model.get('temporalGranularity'));
                        const visible = showAll || temporalGranularityLevel === filterLevel;
                        let level = model.get('level');
                        let originalLevel = model.get('originalLevel');
                        // values are to be shown with hierarchy levels, unless some granularity is selected (in which case all are shown at the same level)
                        if (showAll) {
                            level = originalLevel || level;
                        } else {
                            originalLevel = originalLevel || level;
                            level = temporalGranularityLevel - filterLevel;
                        }
                        model.set({
                            visible: visible,
                            open: false,
                            matchIndexBegin: undefined,
                            matchIndexEnd: undefined,
                            level,
                            originalLevel
                        });
                    });
                } else {
                    representations.each(function (model) {
                        var level = model.get('level');
                        var visible = filterLevel === -1 || filterLevel === level;
                        model.set({
                            visible: visible,
                            open: false,
                            matchIndexBegin: undefined,
                            matchIndexEnd: undefined,
                        });
                    });
                }
            }
        },

        getMaxHierarchyLevel: function () {
            var maxLevelModel = this.get('representations').max(function (model) {
                return model.get('level');
            });
            return maxLevelModel.get('level');
        },

        getGranularities: function () {
            return  _.uniq(this.get('representations').getAllTemporalGranularities());
        },

        _onChangeVisibleLabelType: function () {
            var visibleLabelType = this.get("visibleLabelType");
            var representations = this.get("representations");
            representations.each(function (representation) {
                representation.set("visibleLabelType", visibleLabelType);
            });
        },

        getSelectedRepresentations: function () {
            return this.get('representations').getSelectedRepresentations();
        },

        getUnelectedRepresentations: function () {
            return this.get('representations').getUnelectedRepresentations();
        },

        getDrawableRepresentations: function () {
            return this.get('representations').getDrawableRepresentations();
        },

        getRepresentationsByTemporalGranularity: function (temporalGranularity) {
            return this.get('representations').getRepresentationsByTemporalGranularity(temporalGranularity);
        },

        getRepresentationsByLevel: function (level) {
            return this.get('representations').getRepresentationsByLevel(level);
        },

        getRepresentationsByNormCode: function (normCode) {
            return this.get('representations').getRepresentationsByNormCode(normCode);
        },

        getRepresentationsByVariableElementId: function (variableElementId) {
            return this.get('representations').getRepresentationsByVariableElementId(variableElementId);
        },

        getRepresentationsById: function (id) {
            return this.get('representations').getRepresentationsById(id);
        }
    });

    _.extend(App.modules.dataset.filter.models.FilterDimension.prototype, App.mixins.ToggleModel);

}());
