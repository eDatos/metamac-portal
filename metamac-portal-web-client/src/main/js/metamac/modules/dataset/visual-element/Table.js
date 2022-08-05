(function () {
    "use strict";

    App.namespace("App.VisualElement.Table");

    App.VisualElement.Table = function (options) {
        this.initialize(options);
        this._type = 'table';

        this._chartOptions = {
            title: {

            },
            columnTop: {
                dimensions: []
            },
            columnLeft: {
                dimensions: []
            },
            fixedDimensions: {}
        };
    };

    App.VisualElement.Table.prototype = new App.VisualElement.Base();

    _.extend(App.VisualElement.Table.prototype, {

        load: function () {
            this._bindEvents();
            if (!this.assertAllDimensionsHaveSelections()) {
                return;
            }
            this.render();
        },

        destroy: function () {
            if (this.tableScrollManager) { this.tableScrollManager.destroy(); }
            if (this.keyboardManager) { this.keyboardManager.destroy(); }

            this.tableScrollManager = null;
            this.keyboardManager = null;

            this.dataSource = null;
            this.delegate = null;

            if (this.view) { this.view.destroy(); }
            this.view = null;

            this._unbindEvents();
        },

        _bindEvents: function () {
            var debouncedUpdate = _.debounce(_.bind(this.update, this), 20);
            this.listenTo(this.filterDimensions, "change:drawable change:zone change:visibleLabelType reverse", debouncedUpdate);
            this.listenTo(this.filterDimensions, "change:valuesToIgnore", this._filterDimensionsByValues);

            var resize = _.debounce(_.bind(this._updateSize, this), 200);
            this.$el.on("resize", function (e) {
                e.stopPropagation();
                resize();
            });
        },

        _filterDimensionsByValues: function(values) {
            this.view.filterDimensionsByValues(values);
        },
        _unbindEvents: function () {
            this.stopListening();
            this.$el.off("resize");
        },

        updatingDimensionPositions: function () {
            this._applyVisualizationRestrictions();
            this.resetDimensionsLimits();
        },

        _applyVisualizationRestrictions: function () {
            if (this._mustApplyVisualizationRestrictions()) {
                this._forceDimensionsByMetadataInfo();                
                this._moveAllSingleValueDimensionsToZone('fixed');
            }

            this._updateMustApplyVisualizationRestrictions();
        },

        render: function () {
            this.dataSource = new App.DataSourceDataset({ data: this.data, filterDimensions: this.filterDimensions });
            this.delegate = new App.Table.Delegate();

            this.$el.empty();

            var containerDimensions = this.containerDimensions();

            this.$canvas = $('<canvas width="' + containerDimensions.width + '" height="' + containerDimensions.height + '"></canvas>');

            this.$el.append(this.$canvas);

            this.view = new App.Table.View({
                canvas: this.$canvas[0],
                dataSource: this.dataSource,
                delegate: this.delegate
            });

            this.tableScrollManager = new App.Table.ScrollManager(this.view);
            this.keyboardManager = new App.Table.KeyboardManager({ view: this.view });

            var rightsHolder = this.showRightsHolderText() ? this.getRightsHolderText() : '';
            this.$rightsHolder = $('<div class="rights-holder">' + rightsHolder + '</div>');
            this.$el.append(this.$rightsHolder);

            this._filterDimensionsByValues(this.filterDimensions.getValuesToIgnore());
            this.view.repaint();
        },

        update: function () {
            if (!this.assertAllDimensionsHaveSelections()) {
                return;
            }
            if (!this.view) {
                this.load();
            } else {
                this.view.update();
                this._updateSize();
            }
        },

        containerDimensions: function () {
            return {
                width: this.$el.width(),
                height: this.$el.height()
            };
        },

        resizeFullScreen: function () {
            this._updateSize();
        },

        _updateSize: function () {
            var containerDimensions = this.containerDimensions();
            this.view.resize(containerDimensions);
        }

    });

}());
