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
            var multidatasetIdentifier = options.multidatasetIdentifier;
            var resourceIdentifier = options.resourceIdentifier;

            attributes.name = App.i18n.localizeText(node.name);
            attributes.description = node.description ? App.i18n.localizeText(node.description) : attributes.name;        

            if (node.query) {
                attributes.type = 'query';
                attributes.urn = node.query.urn;
                var queryIdentifier = _.last(attributes.urn.split('='));
                var urlPartMatches = queryIdentifier.match(/(.*):(.*)/);
                attributes.agency = urlPartMatches[1];
                attributes.identifier = urlPartMatches[2];
                attributes.url = "?agencyId=" + attributes.agency + "&resourceId=" + attributes.identifier + "&resourceType=" + attributes.type;
            }

            if (node.dataset) {
                attributes.type = 'dataset';
                attributes.urn = node.dataset.urn;
                var datasetIdentifier = _.last(attributes.urn.split('='));
                var urlPartMatches = datasetIdentifier.match(/(.*):(.*)\(([^\)]*?)\)/);
                attributes.agency = urlPartMatches[1];
                attributes.identifier = urlPartMatches[2];
                attributes.version = urlPartMatches[3];
                attributes.url = "?agencyId=" + attributes.agency + "&resourceId=" + attributes.identifier + "&version=" + attributes.version + "&resourceType=" + attributes.type;
            }

            attributes.url += "&multidatasetId=" + multidatasetIdentifier + window.location.hash;

            if (node.nodes) {
                this.nodes = App.modules.multidataset.MultidatasetNode.parseNodes(node.nodes);
            }

            attributes.selected = resourceIdentifier.urn === attributes.urn;

            return attributes;
        }

    }, {
            parseNodes: function (nodes, multidatasetIdentifier, resourceIdentifier) {
                var models = _.map(nodes.node, function (node) {
                    return new App.modules.multidataset.MultidatasetNode(node, {
                        parse: true,
                        multidatasetIdentifier: multidatasetIdentifier,
                        resourceIdentifier: resourceIdentifier
                    });
                });
                return new Backbone.Collection(models);
            }
        });

}());