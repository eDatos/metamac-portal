(function () {
    "use strict";

    App.namespace('App.modules.multidataset.MultidatasetNode');

    App.modules.multidataset.MultidatasetNode = Backbone.Model.extend({

        defaults: {
            visible: true,
            matchIndexBegin: undefined,
            matchIndexEnd: undefined,
            selected: false
        },

        parse: function (node, options) {
            var attributes = {};
            var resourceIdentifier = options.resourceIdentifier;

            attributes.nodeName = App.InternationalizationUtils.localizeLabel(node.name);
            attributes.description = node.description ? App.InternationalizationUtils.localizeLabel(node.description) : attributes.nodeName;        

            if (node.query) {
                attributes = _.extend({}, node.query, attributes);
                attributes.type = 'query';
                var queryIdentifier = _.last(attributes.urn.split('='));
                var urlPartMatches = queryIdentifier.match(/(.*):(.*)/);
                attributes.agency = urlPartMatches[1];
                attributes.identifier = urlPartMatches[2];
                attributes.url = "?agencyId=" + attributes.agency + "&resourceId=" + attributes.identifier + "&resourceType=" + attributes.type;
            }

            if (node.dataset) {
                attributes = _.extend({}, node.dataset, attributes);
                attributes.type = 'dataset';
                var datasetIdentifier = _.last(attributes.urn.split('='));
                var urlPartMatches = datasetIdentifier.match(/(.*):(.*)\(([^\)]*?)\)/);
                attributes.agency = urlPartMatches[1];
                attributes.identifier = urlPartMatches[2];
                attributes.version = urlPartMatches[3];
                attributes.url = "?agencyId=" + attributes.agency + "&resourceId=" + attributes.identifier + "&version=" + attributes.version + "&resourceType=" + attributes.type;
            }

            attributes.url += "&multidatasetId=" + options.resourceIdentifier.multidatasetId + window.location.hash;

            if (node.nodes) {
                this.nodes = App.modules.multidataset.MultidatasetNode.parseNodes(node.nodes);
            }

            attributes.selected = resourceIdentifier.type === attributes.type &&
                resourceIdentifier.agency === attributes.agency &&
                resourceIdentifier.identifier === attributes.identifier &&
                (attributes.type !== 'dataset' || resourceIdentifier.version === attributes.version);

            return attributes;
        }

    }, {
            parseNodes: function (nodes, resourceIdentifier) {
                var models = _.map(nodes.node, function (node) {
                    return new App.modules.multidataset.MultidatasetNode(node, {
                        parse: true,
                        resourceIdentifier: resourceIdentifier
                    });
                });
                return new Backbone.Collection(models);
            }
        });

}());
