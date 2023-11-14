(function () {

    var Constants = App.Constants;

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

            this._initializeChartOptions();
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

        updatingDimensionPositions: function () {
        },

        resizeFullScreen: function () {
            this.destroy();
            this.load();
        },

        _initializeChartOptions: function () {
            this._chartOptions = {
                animation: false,
                backgroundColor: Constants.colors.istacWhite,
                grid: {
                    left: Constants.charts.grid.margin,
                    right: Constants.charts.grid.margin,
                    containLabel: true
                },
                legend: {
                    show: true,
                    selectedMode: false,
                    type: 'scroll',
                    width: '90%',
                    backgroundColor: Constants.colors.istacWhite,
                    left: 'center',
                    top: null,
                    borderWidth: 1,
                    borderColor: Constants.colors.istacGreyMedium,
                    pageIconColor: Constants.colors.istacBlueMedium,
                    pageIconInactiveColor: Constants.colors.istacGreyMedium,
                    pageIconSize: Constants.charts.legend.fontSize,
                    animation: true,
                    orient: 'horizontal',
                    pageTextStyle: {
                        color: Constants.colors.istacBlack,
                        fontSize: Constants.charts.legend.fontSize,
                        fontWeight: 'bold'
                    },
                    itemHeight: Constants.charts.legend.itemHeight,
                    padding: Constants.charts.legend.padding,
                    textStyle: {
                        fontSize: Constants.charts.legend.fontSize
                    }
                },
                xAxis: {
                    axisTick: {
                        show: false
                    }
                },
                yAxis: {
                    axisTick: {
                        show: false
                    }
                },
                title: {
                    text: this.getRightsHolderText(),
                    right: 10,
                    padding: 0,
                    show: !!this.getRightsHolderText(),
                    textStyle: {
                        fontSize: Constants.charts.title.fontSize,
                        color: Constants.colors.istacGreyDark
                    }
                },
                tooltip: {
                    formatter: this.getTooltipFormatterFunction(),
                    confine: true
                }
            };
        },

        getTooltipFormatterFunction: function () {
            var self = this;
            return function (tooltipFormatterParams) {
                var seriesName = tooltipFormatterParams.seriesName ? (tooltipFormatterParams.seriesName + ', ') : '';
                var axisCategoryName = self._chartOptions[self._dataAxis || 'xAxis'].data[tooltipFormatterParams.dataIndex];
                return '<strong>' + seriesName + axisCategoryName + '</strong>:<br/>' + tooltipFormatterParams.name;
            }
        },

        _getLegendHeight: function () {
            return Constants.charts.legend.itemHeight + Constants.charts.legend.padding * 2;
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

        _forceMeasureDimensionInZone: function (zone) {
            this._forceDimensionTypeInZone("MEASURE_DIMENSION", zone);
        },

        _forceTimeDimensionInZone: function (zone) {
            this._forceDimensionTypeInZone("TIME_DIMENSION", zone);
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

        _preselectBiggestHierarchyGeographicValue: function () {
            var fixedGeographicDimensions = this.filterDimensions.getAllFixedDimensionsCopyByType("GEOGRAPHIC_DIMENSION");
            _(fixedGeographicDimensions).each(function (geographicDimension) {
                var selectedRepresentations = geographicDimension.get('representations').getSelectedRepresentations();
                var biggestHierarchyGeographicValue = _(selectedRepresentations).min(function (representation) {
                    return representation.get("level");
                });
                if (biggestHierarchyGeographicValue != Infinity) {
                    biggestHierarchyGeographicValue.set({ drawable: true });
                }
            });
        },

        _preselectBiggestHierarchyGeographicValue: function () {
            var fixedGeographicDimensions = this.filterDimensions.getAllFixedDimensionsCopyByType("GEOGRAPHIC_DIMENSION");
            _(fixedGeographicDimensions).each(function (geographicDimension) {
                var selectedRepresentations = geographicDimension.get('representations').getSelectedRepresentations();
                var biggestHierarchyGeographicValue = _(selectedRepresentations).min(function (representation) {
                    return representation.get("level");
                });
                if (biggestHierarchyGeographicValue != Infinity) {
                    biggestHierarchyGeographicValue.set({ drawable: true });
                }
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

        _preselectMostPopulatedTemporalGranularityRepresentations: function () {
            var fixedTimeDimensions = this.filterDimensions.getAllNonFixedDimensionsCopyByType("TIME_DIMENSION");
            _(fixedTimeDimensions).each(function (timeDimension) {
                timeDimension.get('representations').updateSelectedTemporalGranularityWithMostRepeatedValue();
                timeDimension.get('representations').updateDrawablesBySelectedGranularity();
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

        getDataAxisDimension: function () {
            return this.filterDimensions.dimensionsAtZone('left').at(0);
        },

        getSeriesDimension: function () {
            var seriesDimension = this.filterDimensions.dimensionsAtZone('top').at(0);
            if (!seriesDimension) {
                seriesDimension = this.filterDimensions.dimensionsAtZone('fixed').at(0);
            }
            if (!seriesDimension) {
                seriesDimension = this.filterDimensions.dimensionsAtZone('axisy').at(0);
            }
            return seriesDimension;
        },

        getDrawableRepresentations: function (dimension) {
            return dimension.getDrawableRepresentations();
        },

        getRightsHolderHeight: function () {
            return 30;
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
        },

        loadColors: function () {
            if (this.graphColorsEnabled()) {
                var self = this;

                self.showLoading();
                self.api = new App.dataset.StructuralResourcesApi(self.data);
                self.api.getCodelists(function (codelists) {
                    var filteredCodelistsWithVariableElements = [];
                    for (var codelist of codelists) {
                        var filteredCodelist = codelist.code.filter((item) => item.hasOwnProperty("variableElement"))
                        if (filteredCodelist.length > 0) {
                            filteredCodelistsWithVariableElements.push(filteredCodelist);
                        }
                    }

                    if (filteredCodelistsWithVariableElements.length > 0) {
                        var variableUrls = _.map(filteredCodelistsWithVariableElements, function (codelist) {
                            return codelist[0].variableElement.selfLink.href.replace(/\/[^\/]*$/, ".json?fields=+renderingColor");
                        });
                        self.api.getVariableElements(variableUrls, function (variableElements) {
                            var flattenedCodelists = _.flatten(filteredCodelistsWithVariableElements);
                            var flattenedVariableElements = _.flatten(_.map(variableElements, function (variab) {
                                return variab.variableElement;
                            }));

                            for (var code of flattenedCodelists) {
                                self.data.colors[code.urn] = flattenedVariableElements.find(elem => elem.urn === code.variableElement.urn).renderingColor;
                            }

                            self.update();
                            self.hideLoading();
                        });
                    } else {
                        self.hideLoading();
                    }
                });
            }
        },

        colorsLoaded: function() {
            return this.data && this.data.colors && !_.isEmpty(this.data.colors);
        },

        graphColorsEnabled: function () {
            return this.data && App.config["enableGraphColors"];
        },

        _extendChartOptions: function (options) {
            this._deepObject(this._chartOptions, options);
        },

        _deepObject: function (target, source) {
            for (const key in source) {
                if ($.isPlainObject(source[key]) && key in target && $.isPlainObject(target[key])) {
                    this._deepObject(target[key], source[key]);
                } else {
                    target[key] = source[key];
                }
            }
        }

    };

    _.extend(App.VisualElement.Base.prototype, Backbone.Events);

}());
