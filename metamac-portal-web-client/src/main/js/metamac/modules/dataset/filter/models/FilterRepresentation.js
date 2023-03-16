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
                this.set("selected", false);
                this.set("drawable", false);
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
                var openChild = new Array();
                if (!child.get('open')) {
                    child.checkAnyChildOpen(openChild);
                    if (openChild.length === 0) {
                        child.set('visible', false);
                    }
                }
                child._closeInit();
            });
        },

        checkAnyChildOpen: function(openChilds) {
            if (this.get('open')) {
                openChilds.push(this);
            }
            if (this.children.length > 0) {
                this.children.each(function (child) {
                   child.checkAnyChildOpen(openChilds);
                });
            } else {
                return;
            }
        },

        _open: function () {
            if (this.get('open')) {
                this.children.each(function (child) {
                    child.set('visible', true);
                    child._open();
                });
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
            } else {
                this._closeInit();
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
            var checkAnyChildVisible = false;
            this.children.each(function (child) {
                if(child.get('visible')) {
                    checkAnyChildVisible = true;
                }
            });
            return checkAnyChildVisible;
        }

    });

    _.extend(App.modules.dataset.filter.models.FilterRepresentation.prototype, App.mixins.ToggleModel);

    App.modules.dataset.filter.models.FilterRepresentation.VISIBLE_LABEL_TYPES = VISIBLE_LABEL_TYPES;

}());