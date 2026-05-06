(function () {
    "use strict";

    App.namespace('App.components.select.views.SelectView');

    App.components.select.views.SelectView = Backbone.View.extend({

        template : App.templateManager.get('components/select/select'),

        defaults : {
            idAttribute : 'id',
            label : 'title',
            multiple : false,
            blank : true
        },

        initialize : function () {
            _.defaults(this.options, this.defaults);
            _.extend(this, _.pick(this.options, 'selectionModel', 'idAttribute', 'label', 'multiple', 'name', 'dropdownCssClass'));
        },

        destroy : function () {
            this.$('select').select2('destroy');
        },

        events : {
            "change select" : "onChangeSelect"
        },

        bindEvents : function () {
            this.listenTo(this.selectionModel, 'change:' + this.name, this.render);
            this.listenTo(this.collection, 'remove', this.render);
            this.listenTo(this.collection, 'reset', this.render);
        },

        unbindEvents : function () {
            this.stopListening();
        },

        modelIsSelected : function (model) {
            var selection = this.selectionModel.get(this.name);
            return model.id === selection;
        },

        render : function () {
            this.unbindEvents();
            this.bindEvents();

            var options = this.collection.map(function (model) {
                var labelValue = _.isFunction(this.label) ? this.label(model) : model.get(this.label);
                return {
                    value : model.get(this.idAttribute),
                    label : new Handlebars.SafeString(labelValue),
                    selected : this.modelIsSelected(model)
                };
            }, this);

            if (!this.multiple && this.blank) {
                options.unshift({value : '', label : ''});
            }

            var context = {
                multiple : this.multiple,
                name : this.name,
                options : options
            };

            this.$el.html(this.template(context));

            const self = this;
            this.$('select').select2({
                dropdownParent: $('.metamac-container'),
                minimumResultsForSearch: Infinity,
                width: '100%'
            }).on('select2:open', function () {
                App.Select2Utils.onOpen($(this), self.dropdownCssClass, true);
            });
        },

        onChangeSelect : function () {
            var selectedId = this.$('select').val();
            var selectedModel = this.collection.get(selectedId);
            var selectedModelId = selectedModel ? selectedModel.id : undefined;
            this.selectionModel.set(this.name, selectedModelId);
            this.trigger('select', selectedModel);
            this.trigger('changeSelect', this);
        }

    });

}());
