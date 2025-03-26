(function () {
    'use strict';

    App.namespace('App.VisualElement.Map');

    App.VisualElement.Map = function (options) {
        this.initialize(options);
        this._type = "map";
        this.mapType = options.mapType;
        this.shapes = new App.Map.Shapes();
    };

    App.VisualElement.Map.prototype = new App.VisualElement.Base();

    _.extend(App.VisualElement.Map.prototype, {

        _granularitiesWithNoSelection: App.templateManager.get('dataset/granuralities-with-no-selection'),
        _errorTemplate: App.templateManager.get('dataset/map/map-error'),

        load: function () {
            this._unbindEvents();
            this._bindEvents();
            if (!this.assertAllDimensionsHaveSelections() || !this.assertGeographicDimensionsHaveTwoElements()) {
                return;
            }

            this.showLoading();
            var self = this;
            this._loadShapes().then(function () {
                self._getBaseShapes();
                self._getDrawableShapes();
                self._getData();

                self._initModel();
                self._initTitleView();
                self._initContainerView();

                self.showTitle();
                self.render();
            });
        },

        destroy: function () {
            this._unbindEvents();

            if (this._mapContainerView) {
                this._mapContainerView.destroy();
            }
        },

        _bindEvents: function () {
            this.listenTo(this.filterDimensions, "change:drawable change:zone", _.debounce(this.update, 20));
        },

        _unbindEvents: function () {
            this.stopListening();

            if (this._mapModel) {
                this._mapModel.off('change', this._handleTransform);
                this._mapModel.off('zoomExit', this._handleZoomExit);
            }
        },

        _loadShapes: function() {
            var deferred = $.Deferred();

            var actions = {};
            if (!this._allGeoJson) {
                var allNormCodes = this._getAllGeographicDimensionNormCodes();
                actions["allShapes"] = _.bind(this.shapes.fetchShapes, this.shapes, allNormCodes);
            }
            
            if (!this._container) {
                actions["container"] = _.bind(this.shapes.fetchContainer, this.shapes);
            }            

            var self = this;
            async.parallel(actions, function (err, result) {
                if (err) {
                    deferred.resolve();
                    return;
                }
                if (result.allShapes) {
                    self._allGeoJson = result.allShapes;
                }
                if (result.container) {
                    self._container = result.container;
                }
            
                deferred.resolve();
            });
            
            return deferred.promise();
        },

        _getBaseShapes: function () {
            var normCodes = this._getBaseRepresentationNormCodes();
            this._baseShapes = _.filter(this._allGeoJson, function(shape) {
                return shape && _.contains(normCodes, shape.normCode);
            });
        },

        _getBaseRepresentationNormCodes: function () {
            var levelZeroRepresentations = this._getGeographicDimension().getRepresentationsByLevel(0);
            return _.invoke(levelZeroRepresentations, "get", "normCode");
        },

        _getDrawableShapes: function () {
            var normCodes = this._getGeographicDimensionNormCodes();
            this._geoJson = _.filter(this._allGeoJson, function(shape) {
                return shape && _.contains(normCodes, shape.normCode);
            });
        },

        _getData: function () {
            var fixedPermutation = this.getFixedPermutation();
            var geographicDimension = this._getGeographicDimension();
            var geographicDimensionSelectedRepresentations = this._getGeographicSelectedRepresentations();

            var result = {};
            var self = this;
            _.each(geographicDimensionSelectedRepresentations, function (geographicRepresentation) {
                var normCode = geographicRepresentation.get("normCode");
                if (normCode) {
                    var currentPermutation = {};
                    currentPermutation[geographicDimension.id] = geographicRepresentation.id;
                    _.extend(currentPermutation, fixedPermutation);

                    var value = self.data.getNumberData({ ids: currentPermutation });
                    if (_.isNumber(value)) {
                        result[normCode] = { value: value };
                    }
                }
            });
            this._dataJson = result;
        },

        _initModel: function () {
            this._mapModel = new App.Map.MapModel();
            this._mapModel.on('change:currentScale', this._handleTransform, this);
            this._mapModel.on('zoomExit', this._handleZoomExit, this);
            this._calculateAndSetRanges();
        },

        _calculateAndSetRanges: function () {
            var values = _.map(this._dataJson, function (value) {
                return value.value;
            });
            this._mapModel.set("values", values);
            this._mapModel.set("minValue", values.length > 0 ? _.min(values): 0);
            this._mapModel.set("maxValue", values.length > 0 ? _.max(values): 0);
        },

        _initContainerView: function () {
            this._mapContainerView = new App.Map.MapContainerView({
                el: this.el,
                data: this.data,
                filterDimensions: this.filterDimensions,
                mapModel: this._mapModel,
                geoJson: this._geoJson,
                baseGeoJson: this._baseShapes,
                container: this._container,
                dataJson: this._dataJson,
                width: $(this.el).width(),
                height: $(this.el).height(),
                mapType: this.mapType,
                title: this.getTitle(),
                rightsHolder: this.getRightsHolderText(),
                showRightsHolder: this.showRightsHolderText(),
                callback: _.bind(this.hideLoading, this),
                metadata: this.metadata,
                $title: this.$title
            });
        },

        _initTitleView: function () {
            this.$title = $('<h3></h3>').prependTo(this.$el);
            this.updateTitle();
        },

        render: function () {
            if (this.assertMapAvailable()) {
                this._mapContainerView.render();
            }
        },

        update: function () {
            if (!this.assertAllDimensionsHaveSelections() || !this.assertGeographicDimensionsHaveTwoElements()) {
                return;
            }

            if (!this._mapExists()) {
                this.load();
                return;
            }
            
            this.showLoading();
            this._getDrawableShapes();
            this._getData();
            this._calculateAndSetRanges();

            this.updateTitle();
            this._mapContainerView.update(this._dataJson, this._geoJson, this.getTitle());
        },

        assertGeographicDimensionsHaveTwoElements: function () {
            if (this.filterDimensions.checkGeographicDimensionsWithTwoElements()) {
                this.hideWrongSelectionView();
                return true;
            } else {
                this.renderWrongSelectionView(this._granularitiesWithNoSelection());
                return false;
            }
        },

        assertMapAvailable: function () {
            if (this._mapContainerView.canRender()) {
                this.hideWrongSelectionView();
                return true;
            } else {
                this.renderWrongSelectionView(this._errorTemplate());
                return false;
            }
        },

        _mapExists: function() {
            return this._mapContainerView && this._mapContainerView.mapView && this._mapContainerView.mapView._getChart();
        },

        updatingDimensionPositions: function (oldElement) {
            if (!oldElement || oldElement._type !== "map") {
                this._applyVisualizationRestrictions();
                this.resetDimensionsLimits();

                this.filterDimensions.zones.get('left').set('fixedSize', 1);
                this.filterDimensions.zones.get('top').set('fixedSize', 0);
            }
        },

        _applyVisualizationRestrictions: function () {
            if (this._mustApplyVisualizationRestrictions()) {
                this._moveAllDimensionsToZone('fixed');
                // Here we would normally do a this._moveAllSingleValueDimensionsToZone('fixed'); but we have already move them all

                this._forceGeographicDimensionInZone('left');

                this._applyVisualizationPreselections();
            }

            this._updateMustApplyVisualizationRestrictions();
        },

        _applyVisualizationPreselections: function () {
            this._preselectMostRecentTimeRepresentation();
            this._preselectMostPopulatedGeographicLevelRepresentations();
        },

        _getGeographicDimension: function () {
            return this.filterDimensions.dimensionsAtZone('left').at(0);
        },

        _getGeographicSelectedRepresentations: function () {
            return this._getGeographicDimension().get('representations').getSelectedRepresentationsByCurrentLevel();
        },

        _getGeographicDimensionNormCodes: function () {
            var selectedRepresentations = this._getGeographicSelectedRepresentations();
            return _.invoke(selectedRepresentations, "get", "normCode");
        },

        _getAllGeographicDimensionNormCodes: function () {
            return _.invoke(this._getGeographicDimension().get('representations').models, "get", "normCode");
        },

        _handleTransform: function () {
            this._mapContainerView.transform();
        },

        _handleZoomExit: function () {
            this._mapContainerView.zoomExit();
        },

        getExportChartSvg: function () {
            return this._mapContainerView.getExportChartSvg();
        }
    });

}());
