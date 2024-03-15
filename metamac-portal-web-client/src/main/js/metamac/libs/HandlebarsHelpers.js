/**
 * Handlebars Helpers
 */

(function () {
    "use strict";

    function htmlDecode(value) {
        return $('<div/>').html(value).text();
    }

    function safeString(value) {
        return new Handlebars.SafeString(htmlDecode(Handlebars.Utils.escapeExpression(value)));
    }

    Handlebars.registerHelper("safeString", function (value) {
        return safeString(value);
    });

    /**
     * InternationalString
     *
     * usage:
     *    {{iString title}}
     */
    Handlebars.registerHelper("iString", function (iString) {
        if (_.isString(iString) || _.isUndefined(iString)) {
            return iString;
        }

        var localizedLabels;
        if (iString.hasOwnProperty('texts')) {
            localizedLabels = {};
            _.each(iString.texts, function (text) {
                localizedLabels[text.locale] = text.label;
            });
        } else {
            localizedLabels = iString;
        }

        var locale = I18n.locale;
        var defaultLocale = I18n.defaultLocale;

        var result;
        if (!_.isUndefined(localizedLabels[locale])) {
            result = localizedLabels[locale];
        } else if (!_.isUndefined(localizedLabels[defaultLocale])) {
            result = localizedLabels[defaultLocale];
        } else {
            result = _.values(localizedLabels)[0];
        }
        return result;
    });

    /**
     * Format date
     *
     * usage:
     *      {{date lastPublishedDate}}
     */
    Handlebars.registerHelper("date", function (date, options) {
        if (date) {
            return I18n.l("date.formats.default", date);
        } else {
            return "";
        }
    });

    /**
     * Get the application context
     *
     * usage:
     *      <a href="{{context}}/providers/1">
     */
    Handlebars.registerHelper("context", function (url, options) {
        return App.context;
    });

    /**
     * Get the resource context
     *
     * usage:
     *      <a href="{{resourceContext}}/providers/1">
     */
    Handlebars.registerHelper("resourceContext", function (url, options) {
        return App.resourceContext;
    });

    /**
     * Get a translated message
     *
     * usage:
     *      <h1>{{ message "entity.dataset.title" }}</h1>
     */
    Handlebars.registerHelper("message", function (message, options) {
        return safeString(I18n.t(message));
    });

    /**
     * Transforms a string to lowercase
     *
     * usage:
     *      <h1>{{ toLowerCase string }}</h1>
     */
    Handlebars.registerHelper("toLowerCase", function (string) {
        if (_.isString(string)) {
            return string.toLowerCase();
        }
    });

    Handlebars.registerHelper("resourceOutput", function (values) {
        return new Handlebars.SafeString(resourceOutput(values));
    });

    function resourceOutput(values) {
        var result = "";
        if (!(values instanceof Array)) {
            values = [values];
        }

        return _.reduce(values, function (memo, value) {
            var href = Handlebars.Utils.escapeExpression(value.href);
            var name = value.name;
            result = href ? '<a href=' + href + '>' : '';
            result += name;
            result += href ? '</a>' : '';
            memo = memo ? ", " : "";
            return memo + result;
        }, "");
    };

    /**
     * Draw a field with its value
     *
     * usage:
     *      {{ fieldOutput "entity.dataset.title" }}
     */
    Handlebars.registerHelper("fieldOutput", function (label, value, type, localizeLabel, allowEmptyValue, fieldClass) {
        label = Handlebars.Utils.escapeExpression(label);
        localizeLabel = _.isUndefined(localizeLabel) ? true : localizeLabel;
        fieldClass = _.isUndefined(fieldClass) ? "field" : fieldClass;
        var result = '';
        if (value || allowEmptyValue) {
            result +=
                '<div class="' + fieldClass + '" >' +
                '<span class="metadata-title">';
            result += localizeLabel && label ? I18n.t(label) : label;
            result += '</span>';
            result +=
                '<div class="metadata-value">';

            if (type === "date") {
                value = Handlebars.Utils.escapeExpression(value);
                result += I18n.l("date.formats.default", value);
            } else if (type === "resourceNoLink") {
                value.href = null;
                result += resourceOutput(value);
            } else if (type === "resource") {
                result += resourceOutput(value);
            } else {
                value = _.isArray(value) ? value.join(", ") : value;
                value = Handlebars.Utils.escapeExpression(value);
                //result += Handlebars.helpers.iString(value) +
                result += htmlDecode(value);
            }

            result += '</div>';
            result +=
                '</div>';
        }

        return new Handlebars.SafeString(result);
    });

    /**
     * Draw a <ul> with each element of the list
     *
     * usage:
     *      {{#ulList list }}
     *          {{ attr1 }}
     *      {{/ulList}}
     *
     * Notice that each list element must have a iString attribute
     * value
     */
    Handlebars.registerHelper("ulList", function (list, options) {
        var result = '',
            i, item;
        if (list) {
            result += '<ul>';

            for (i = 0; i < list.length; i++) {
                item = list[i];
                result += '<li>' + options.fn(item) + '</li>';
            }

            result += '</ul>';
        }

        return new Handlebars.SafeString(result);
    });

    /**
     * Join
     *
     * usage :
     *      {{#join list}}
     *        s  <span>{{attr1}}</span>
     *      {{/join}}
     *
     *      {{#join list separator="|"}}
     *          <span>{{attr1}}</span>
     *      {{/join}}
     */
    Handlebars.registerHelper('join', function (items, options) {
        var separator = (options.hash.separator || ', '),
            out = "",
            i, item, itemsLength;

        if (items) {
            itemsLength = items.length;

            for (i = 0; i < itemsLength; i++) {
                item = items[i];
                out = out + $.trim(options.fn(item));
                if (i !== (items.length - 1)) {
                    out += separator;
                }
            }
        }

        return out;
    });

    /**
     * iter
     *
     * usage :
     *      {{#iter list}}
     *        {{i}} : {{this}}
     *      {{/iter}}

     */
    Handlebars.registerHelper('iter', function (context, options) {
        var ret = "";

        for (var i = 0, j = context.length; i < j; i++) {
            ret = ret + options.fn(_.extend({}, { value: context[i] }, { i: i }));
        }

        return ret;
    });

    /**
     * Format a date showing the timeago
     *
     * usage :
     *  {{#fromNow date}}
     */
    Handlebars.registerHelper('fromNow', function (date, options) {
        if (date) {
            moment.lang(I18n.currentLocale());
            return moment(date).fromNow();
        } else {
            return "";
        }
    });

    Handlebars.registerHelper('errors', function (errors) {
        var result = [];
        _.each(errors, function (error) {
            result.push(I18n.t('form.validator.' + error));
        });
        return result.join(", ");
    });

    // http://doginthehat.com.au/2012/02/comparison-block-helper-for-handlebars-templates/#comment-44
    Handlebars.registerHelper('compare', function (lvalue, operator, rvalue, options) {
        var operators, result;
        if (arguments.length < 3) {
            throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
        }

        if (options === undefined) {
            options = rvalue;
            rvalue = operator;
            operator = "===";
        }

        operators = {
            '==': function (l, r) { return l == r; },
            '===': function (l, r) { return l === r; },
            '!=': function (l, r) { return l != r; },
            '!==': function (l, r) { return l !== r; },
            '<': function (l, r) { return l < r; },
            '>': function (l, r) { return l > r; },
            '<=': function (l, r) { return l <= r; },
            '>=': function (l, r) { return l >= r; },
            'typeof': function (l, r) { return typeof l == r; }
        };

        if (!operators[operator]) {
            throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);
        }

        result = operators[operator](lvalue, rvalue);
        return operators[operator](lvalue, rvalue) ? options.fn(this) : options.inverse(this);
    });

}());



