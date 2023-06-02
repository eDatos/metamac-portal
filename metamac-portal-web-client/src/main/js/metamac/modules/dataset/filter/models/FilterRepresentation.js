(function () {
    "use strict";

    App.namespace('App.modules.dataset.filter.models.FilterRepresentation');

    var VISIBLE_LABEL_TYPES = {
        LABEL: "LABEL",
        CODE: "CODE",
        CODE_AND_LABEL: "CODE_AND_LABEL"
    };

    App.modules.dataset.filter.models.FilterRepresentation = Backbone.Model.extend({

        defaults: {
            visible: true,
            open: true,
            selected: true,
            drawable: true,
            childrenSelected: false,
            level: 0,
            matchIndexBegin: undefined,
            matchIndexEnd: undefined,
            visibleLabelType: VISIBLE_LABEL_TYPES.LABEL
        },

        initialize: function () {
            this.children = new Backbone.Collection();
            this.listenTo(this.children, 'change:selected change:childrenSelected reset', this._updateChildrenSelected);
            this.listenTo(this, 'change:open', this._onChangeOpen);
            this.listenTo(this, "change:visibleLabelType", this._updateVisibleLabel);

            this._updateVisibleLabel();
        },

        _updateVisibleLabel: function () {
            var visibleLabelType = this.get("visibleLabelType");
            if (visibleLabelType === VISIBLE_LABEL_TYPES.CODE_AND_LABEL) {
                this.set("visibleLabel", this.id + " - " + this.get("label"));
            } else if (visibleLabelType === VISIBLE_LABEL_TYPES.CODE) {
                this.set("visibleLabel", this.id);
            } else {
                this.set("visibleLabel", this.get("label"));
            }
        },

        initChildren: function(children) {
            this.children.reset(children);
            var open = this.get("open");
            if (!open) {
                this.set("selected", false, { silent: true });
                this.set("drawable", false, { silent: true });
            }
        },

        _updateChildrenSelected: function () {
            var childrenSelected = this.children.any(function (child) {
                return child.get('selected') || child.get('childrenSelected');
            });
            this.set('childrenSelected', childrenSelected);
        },

        _close: function () {
            this.children.each(function (child) {
                child.set('visible', false);
                child._close();
            });
        },
        
        _closeInit: function () {
            this.children.each(function (child) {
                if (!child.get('open')) {
                    child.set('visible', false);
                    child.set("selected", false, { silent: true });
                }
                child._closeInit();
            });
        },

        _open: function () {
            if (this.get('open')) {
                this.children.each(function (child) {
                    child.set('visible', true);
                    child._open();
                });
            } else {
                this.set("selected", false, { silent: true });
            }
        },

        _onChangeOpen: function () {
            if (this.get('open')) {
                this._open();
            } else {
                this._close();
            }
        },

        _onChangeOpenInit: function () {
            if (this.get('open')) {
                this._open();
            } else if (!this.checkAnyChildOpen(this)) {
                this._closeInit();
            }
        },
        
        checkAnyChildOpen(child) {
            var nodos = [];
            this.findOpenedChild(child, nodos)
            return nodos.length > 0;
        },

        findOpenedChild(child, nodos) {
            if (child.get('open')) {
                nodos.push(child.get('id'));
                return nodos;
            }
            if(child.children.length === 0) {
                return nodos;
            }
            if (child.children.length !== 0) {
                child.children.each(function(childAux) {
                    return child.findOpenedChild(childAux, nodos);
                })
            }
        },

        toggleMeAndMyChildren: function (property) {
            var newSelectedValue = !this.get(property);
            this.setMeAndMyChildren(property, newSelectedValue);
        },

        setMeAndMyChildren: function (property, value) {
            this.set(property, value);
            this.children.each(function (child) {
                child.setMeAndMyChildren(property, value);
            });
        },

        checkAnyChildVisible: function () {
            return this.children.findWhere({visible: true});
        }

    });

    _.extend(App.modules.dataset.filter.models.FilterRepresentation.prototype, App.mixins.ToggleModel);

    App.modules.dataset.filter.models.FilterRepresentation.VISIBLE_LABEL_TYPES = VISIBLE_LABEL_TYPES;

}());