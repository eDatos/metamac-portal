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

            var self = this;
            this.$('select').select2({
                dropdownParent: $('.metamac-container'),
                minimumResultsForSearch: Infinity,
                width: 'auto'
            }).on('select2:open', function () {
                setTimeout(function () {
                    var $dropdown = $('.select2-dropdown');
                    if (self.dropdownCssClass) {
                        $dropdown.addClass(self.dropdownCssClass);
                    }

                    $dropdown.css('width', '');
                    var dropdownWidth = $dropdown[0].getBoundingClientRect().width;
                    var selectionWidth = self.$('.select2-selection')[0].getBoundingClientRect().width;

                    if (dropdownWidth > selectionWidth) {
                        $dropdown.addClass('select2-dropdown--wider-than-trigger');
                        $dropdown.css('transform', 'translateX(-' + (dropdownWidth - selectionWidth) + 'px)');
                    } else {
                        $dropdown.css('width', selectionWidth);
                    }
                });
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
