(function () {
    "use strict";

    App.namespace('App.modules.multidataset.Multidataset');

    App.modules.multidataset.Multidataset = Backbone.Model.extend({

        defaults: {
            filterQuery: '',
            open: true
        },

        initialize: function (attributes) {
            this.multidatasetIdentifier = attributes.multidatasetIdentifier;
            this.filterDimensions = attributes.filterDimensions;
            var identifiers = this.multidatasetIdentifier.split(":");
            if (identifiers.length != 2) {
                throw new Error("Error parsing multidataset identifier: ", this.multidatasetIdentifier);
            }

            this.agency = identifiers[0];
            this.identifier = identifiers[1];

            this._bindEvents();
        },

        _bindEvents: function () {
            this.listenTo(this, 'change:filterQuery', this._onChangeFilterQuery);
        },

        _cleanFilterQuery: function (query) {
            return s.trim(s.cleanDiacritics(query).toLowerCase());
        },

        _onChangeFilterQuery: function () {
            var filterQuery = this._cleanFilterQuery(this.get('filterQuery'));
            var filterQueryLength = filterQuery.length;

            var nodes = this.get('nodes');
            nodes.each(function (model) {
                model.set({ open: false }, { trigger: false });
            });

            nodes.each(function (model) {
                var matchIndex = this._cleanFilterQuery(model.get('name')).indexOf(filterQuery);
                var match = matchIndex !== -1;
                if (match) {
                    model.set({ visible: true, matchIndexBegin: matchIndex, matchIndexEnd: matchIndex + filterQueryLength });
                } else {
                    model.set({ visible: false, matchIndexBegin: undefined, matchIndexEnd: undefined });
                }
            }, this);
        },

        url: function () {
            return App.endpoints["statistical-resources"] + '/multidatasets/' + this.agency + '/' + this.identifier + '?_type=json';
        },

        parse: function (response) {
            var attributes = {};
            this.set('nodes', App.modules.multidataset.MultidatasetNode.parseNodes(response.data.nodes, this.multidatasetIdentifier, this.filterDimensions.metadata.identifier()));
            attributes.name = App.InternationalizationUtils.localizeLabel(response.metadata.filteringDimension);
            attributes.description = App.InternationalizationUtils.localizeLabel(response.description);
            return attributes;
        },

        equals: function (multidataset) {
            if (_.isUndefined(multidataset)) return false;

            var self = this;
            var idProperties = ["agency", "identifier"];
            var equals = _.reduce(idProperties, function (equals, property) {
                return equals && self.get(property) === multidataset.get(property);
            }, true);
            return equals;
        }

    });

    _.extend(App.modules.multidataset.Multidataset.prototype, App.mixins.ToggleModel);

}());