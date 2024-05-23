(function () {

    App.namespace("App.VisualElement");

    App.VisualElement.Base = function (options) {
        this.initialize(options);
    };

    App.VisualElement.Base.prototype = {

        _noSelectionTemplate: App.templateManager.get('dataset/dataset-no-selection'),
        _loadingTemplate: App.templateManager.get('dataset/dataset-loading'),

        initialize: function (options) {
            options = options || {};
            this.data = options.data;

            this.filterOptions = options.filterOptions; //deprecated
            this.filterDimensions = options.filterDimensions;
            this.optionsModel = options.optionsModel;

            this.el = options.el;
        },

        getFixedPermutation: function () {
            var fixedPermutation = {};
            var self = this;
            this.filterDimensions.getAllFixedDimensionsCopy().forEach(function (dimension) {
                var selectedRepresentations = self.getDrawableRepresentations(dimension);
                fixedPermutation[dimension.id] = selectedRepresentations[0].id;
            });
            return fixedPermutation;
        },

        getTitle: function () {
            var self = this;
            var fixedLabels = this.filterDimensions
                .getAllFixedDimensionsCopy()
                .sort(function (dimension) {
                    // Put measure dimensions at the beginning of the array
                    return dimension.get('type') == "MEASURE_DIMENSION" ? -1 : 1;
                })
                .filter(function(dimension) {
                    return !dimension.get('singleValue')
                })
                .map(function (dimension) {
                    var selectedRepresentations = self.getDrawableRepresentations(dimension);
                    return selectedRepresentations[0].get('visibleLabel') + ".";
                });
            return fixedLabels.length ? fixedLabels.join(" ") : "";
        },

        load: function () {
        },

        destroy: function () {
        },

        _unbindEvents: function () {
        },

        updatingDimensionPositions: function () {
        },

        resizeFullScreen: function () {
            this.destroy();
            this.load();
        },

        updateTitle: function () {
            var title = this.getTitle();
            this.$title.text(title);
            if (title) {
                this.$title.prepend('<b>' + I18n.t("filter.text.for") + ': ' + '</b>');
            }
        },

        hideTitle: function () {
            if (this.$title) { this.$title.hide(); }
        },

        showTitle: function () {
            if (this.$title) { this.$title.show(); }
        },

        setEl: function (el) {
            this.$el = $(el);
            this.el = this.$el[0];
        },

        _mustApplyVisualizationRestrictions: function () {
            return this.optionsModel.get('mustApplyVisualizationRestrictions');
        },

        _updateMustApplyVisualizationRestrictions: function () {
            // We only ignore the visualization restrictions the first time we load the permalink
            if (!this.optionsModel.get('mustApplyVisualizationRestrictions')) {
                this.optionsModel.set('mustApplyVisualizationRestrictions', true);
            }
        },

        _forceDimensionTypeInZone: function (dimensionType, zone) {
            var dimensions = this.filterDimensions.where({ type: dimensionType });
            if (dimensions.length != 0) {
                var dimension = dimensions[0];
                this.filterDimensions.zones.setDimensionZone(zone, dimension, { force: true });
            }
        },

        _forceDimensionIdInZone: function (dimensionId, zone) {
            var dimension = this.filterDimensions.get(dimensionId);
            this.filterDimensions.zones.setDimensionZone(zone, dimension, { force: true });
        },

        _moveAllDimensionsToZone: function (zone) {
            var self = this;
            this.filterDimensions.each(function (dimension) {
                self.filterDimensions.zones.setDimensionZone(zone, dimension, { force: true });
            });
        },

        _moveAllSingleValueDimensionsToZone: function (zone) {
            var self = this;
            var dimensions = this.filterDimensions.where({ singleValue: true });
            dimensions.forEach(function(dimension) {                
                self.filterDimensions.zones.setDimensionZone(zone, dimension, { force: true });
            });
        },

        _forceGeographicDimensionInZone: function (zone) {
            this._forceDimensionTypeInZone("GEOGRAPHIC_DIMENSION", zone);
        },

        _forceDimensionsByMetadataInfo: function () {
            var self = this;
            _.each(this.data.metadata.getDimensionsPosition(), function (dimensions, zone) {
                _.each(dimensions, function (dimension) {
                    self._forceDimensionIdInZone(dimension, zone);
                });
            });
        },

        _preselectMostRecentTimeRepresentation: function () {
            var fixedTimeDimensions = this.filterDimensions.getAllFixedDimensionsCopyByType("TIME_DIMENSION");
            _(fixedTimeDimensions).each(function (timeDimension) {
                var selectedRepresentations = timeDimension.get('representations').getSelectedRepresentations();
                var mostRecentTimeRepresentation = timeDimension.get('reversed')
                    ? _(selectedRepresentations).last()
                    : _(selectedRepresentations).first();
                mostRecentTimeRepresentation.set({ drawable: true });
            });
        },

        _preselectMostPopulatedGeographicLevelRepresentations: function () {
            var nonFixedGeographicDimensions = this.filterDimensions.getAllNonFixedDimensionsCopyByType("GEOGRAPHIC_DIMENSION");
            _(nonFixedGeographicDimensions).each(function (geographicDimension) {
                geographicDimension.get('representations').updateSelectedGeographicLevelWithMostRepeatedValue();
                geographicDimension.get('representations').updateDrawablesBySelectedLevel();
            });
        },

        resetDimensionsLimits: function () {
            this.filterDimensions.zones.each(function (zone) {
                zone.unset("fixedSize");
                zone.unset("maxSize");
            });
        },

        getRightsHolderText: function () {
            return (this.data && this.data.metadata.getRightsHolder()) || '';
        },

        showRightsHolderText: function () {
            return App.config.widget ? !this._isEmbededOnVisualizerDomain() : App.config.showRightsHolder;
        },

        _isEmbededOnVisualizerDomain: function () {
            return document.referrer && (new URL(document.referrer)).hostname === App.Helpers.getHostname(App.endpoints["statistical-visualizer"]);
        },

        getDrawableRepresentations: function (dimension) {
            return dimension.getDrawableRepresentations();
        },

        allDimensionsHaveSelections: function () {
            return this.filterDimensions.getDimensionsWithoutSelections().length == 0;
        },

        renderNoSelectionView: function () {
            this.setupNoSelectionViewIfNeeded();
            this.$noSelection.html(this._noSelectionTemplate());
            this.hideTitle();
            this.$noSelection.show();
        },

        setupNoSelectionViewIfNeeded: function () {
            if (this.$el.find('.dataset-no-selection').length) { return; }
            this.$noSelection = $('<div class="dataset-no-selection dataset-message"></div>');
            this.$noSelection.hide();
            this.$el.append(this.$noSelection);
        },

        assertAllDimensionsHaveSelections: function () {
            if (this.allDimensionsHaveSelections()) {
                if (this.$noSelection) {
                    this.$noSelection.hide();
                    this.showTitle();
                }
                return true;
            } else {
                this.renderNoSelectionView();
                return false;
            }
        },

        showLoading: function () {
            this.setupLoadingViewIfNeeded();
            this.$loading.html(this._loadingTemplate());
            this.hideTitle();
            this.$loading.show();
        },

        setupLoadingViewIfNeeded: function () {
            if (this.$el.find('.dataset-loading').length) { return; }
            this.$loading = $('<div class="dataset-loading dataset-message"></div>');
            this.$loading.hide();
            this.$el.append(this.$loading);
        },

        hideLoading: function () {
            if (this.$loading) {
                this.$loading.hide();
                this.showTitle();
            }
        }
    };

    _.extend(App.VisualElement.Base.prototype, Backbone.Events);

}());
