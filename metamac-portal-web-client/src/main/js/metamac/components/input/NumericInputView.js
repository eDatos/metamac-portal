(function () {
    "use strict";

    App.namespace('App.components.input.NumericInputView');

    App.components.input.NumericInputView = Backbone.View.extend({

        tagName: 'span',
        className: 'numeric-input',

        events: {
            "click .numeric-input-up":   "onNumberUp",
            "click .numeric-input-down": "onNumberDown"
        },

        initialize: function () {
            this.min = this.options.min !== undefined ? this.options.min : 1;
        },

        render: function () {
            this.$el.html(`
                <input type="number" min="${this.min}">
                <button type="button" class="numeric-input-up"></button>
                <button type="button" class="numeric-input-down"></button>
            `);
            this.$input = this.$el.find('input');
            return this;
        },

        onNumberUp: function () {
            const currentValue = Number.isSafeInteger(this.getValue()) ? this.getValue() : 0;
            this.$input.val(currentValue + 1);
        },

        onNumberDown: function () {
            const currentValue = Number.isSafeInteger(this.getValue()) ? this.getValue() : 0;
            this.$input.val(Math.max(+this.$input.attr('min'), currentValue - 1));
        },

        getValue: function () {
            return this.$input[0].valueAsNumber;
        },

        isDisabled: function () {
            return this.$input.prop('disabled');
        },

        setDisabled: function (disabled) {
            this.$el.find('input, button').prop('disabled', disabled);
        }
    });

}());
