(function () {
    "use strict";
    var QueryParamsUtils = App.QueryParamsUtils;

    App.namespace("App.widget.filter.sidebar");

    App.widget.filter.sidebar.FilterSidebarMultidatasetNodeView = Backbone.View.extend({

        template: App.templateManager.get('dataset/filter/sidebar/filter-sidebar-multidataset-node'),

        className: "filter-sidebar-multidataset-node",

        events: {
            'click .multidataset-link': 'onMultidatasetClick'
        },

        onMultidatasetClick: function (event) {
            if (this.multidatasetNode.get('selected')) {
                return false;
            }

            var target = event.currentTarget;
            var newPath = target.pathname + target.search + target.hash;
            
            // Cambia la URL sin realizar ninguna petición
            window.history.pushState("", "", newPath);

            var queryParams = QueryParamsUtils.getQueryParamsFromQuery(target.search);

            App.queryParams.agency = queryParams.agencyId;
            App.queryParams.identifier = queryParams.resourceId;
            App.queryParams.type = queryParams.resourceType;
            App.queryParams.version = queryParams.resourceType === 'query' ? undefined : queryParams.version;

            // Refresca la ruta actual: https://stackoverflow.com/a/25777550
            Backbone.history.loadUrl(Backbone.history.fragment);
            
            return false;
        },

        initialize: function (options) {
            this.multidatasetNode = options.multidatasetNode;
        },

        _bindEvents: function () {
            var renderEvents = 'change:selected change:visible change:matchIndexBegin change:matchIndexEnd';
            //debounce for multiple changes when searching
            this.listenTo(this.multidatasetNode, renderEvents, _.debounce(this.render, 15));
        },

        _unbindEvents: function () {
            this.stopListening();
        },

        destroy: function () {
            this._unbindEvents();
            this.remove();
        },

        _stateClass: function () {
            return this.multidatasetNode.get('selected') ?
                'filter-sidebar-multidataset-node-icon-check' :
                'filter-sidebar-multidataset-node-icon-unchecked';
        },

        _strongZone: function (str, begin, end) {
            if (begin >= 0 && end > begin) {
                var p1 = str.substring(0, begin);
                var p2 = str.substring(begin, end);
                var p3 = str.substring(end);
                return p1 + "<strong>" + p2 + "</strong>" + p3;
            } else {
                return str;
            }
        },

        render: function () {
            this._unbindEvents();
            this._bindEvents();

            var visible = this.multidatasetNode.get('visible');

            if (visible) {
                this.$el.removeClass('hide');
                var stateClass = this._stateClass();
                var multidatasetNode = this.multidatasetNode.toJSON();
                var label = this._strongZone(multidatasetNode.nodeName, multidatasetNode.matchIndexBegin, multidatasetNode.matchIndexEnd);

                var context = {
                    multidatasetNode: multidatasetNode,
                    label: new Handlebars.SafeString(label),
                    stateClass: stateClass,
                    title: _.compact([App.InternationalizationUtils.localizeLabel(multidatasetNode.name), this._getTextFromHTML(multidatasetNode.description)]).join(" - ")
                };
                this.$el.html(this.template(context));
            } else {
                this.$el.addClass('hide');
                this.$el.html('');
            }

            return this.el;
        },

        _getTextFromHTML: function (html) {
            return $('<div/>').html(html).text();
        }

    });
}());
