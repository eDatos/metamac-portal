(function () {
    "use strict";

    var DatasetPermalink = App.modules.dataset.DatasetPermalink;

    App.namespace('App.modules.dataset.DatasetController');

    App.modules.dataset.DatasetController = App.Controller.extend({

        initialize: function (options) {
            this.region = options.region;
        },

        showError: function () {
            this.errorView = new App.modules.dataset.ErrorView({ error: I18n.t('exception.common.unknown') });
            this.region.show(this.errorView);
        },

        showDataset: function (datasetIdentifier) {
            var self = this;
            this._loadMetadataAndData(datasetIdentifier).then(function () {
                var routeParts = [];

                if (self.metadata.getAutoOpen()) {
                    routeParts.push("visualization");
                } else {
                    routeParts.push("selection");
                }

                var route = routeParts.join("/");
                Backbone.history.navigate(route, { trigger: true, replace: true });
            });
        },

        showDatasetSelection: function (datasetIdentifier) {
            datasetIdentifier = _.defaults(datasetIdentifier, {
                visualizationType: "selection"
            });
            var link = this._linkToDatasetSelection(datasetIdentifier);
            this.router.navigate(link, { replace: true });

            var self = this;
            this._loadMetadataAndData(datasetIdentifier).then(function () {
                self.region.show(self.selectionView);
                self.selectionView.showVisualizationType(datasetIdentifier);
            });
        },

        showDatasetVisualization: function (options) {
            options = _.defaults(options, {
                visualizationType: "table",
                fullScreen: false
            });
            var link = this._linkToDatasetVisualization(options);
            this.router.navigate(link, { replace: true });

            var self = this;
            var datasetIdentifier = _.pick(options, "type", "agency", "identifier", "version", "permalinkId", "indicatorSystem", "geo", "multidatasetId", "widgetTitle");
            if (this.visualizationView) {
                this.visualizationView.showLoading();
            }
            this._loadMetadataAndData(datasetIdentifier).then(function () {
                if (self.region.currentView !== self.visualizationView) {
                    self.region.show(self.visualizationView);
                }
                self.visualizationView.showVisualizationType(options);
            });
        },

        changeDatasetVisualization: function (options) {
            var link = this._linkToDatasetVisualization(options);
            this.router.navigate(link, { replace: true });
            this.visualizationView.showVisualizationType(options);
        },

        changeSelectionVisualization: function (options) {
            const link = this._linkToDatasetSelection(options);
            this.router.navigate(link, { replace: true });
            this.selectionView.showVisualizationType(options);
        },

        _linkToDatasetVisualization: function (options) {
            var routeName = "visualization";
            if (options.visualizationType) {
                routeName = routeName + "Type";
            }
            if (options.permalinkId) {
                routeName = routeName + "Permalink";
            }
            return this.router.linkTo(routeName, options);
        },

        _linkToDatasetSelection: function (options) {
            var routeName = "selection";
            if (options.visualizationType && options.visualizationType !== "selection") {
                routeName = routeName + "Type";
            }
            if (options.permalinkId) {
                routeName = routeName + "Permalink";
            }
            return this.router.linkTo(routeName, options);
        },

        _loadMetadataAndData: function (datasetIdentifier) {
            var deferred = $.Deferred();
            var datasourceIdentifier = new App.datasource.DatasourceIdentifier(datasetIdentifier);

            if (datasourceIdentifier.equals(this.datasourceIdentifier)) {
                deferred.resolve();
                return deferred.promise();
            }

            this.datasourceIdentifier = datasourceIdentifier;
            this.metadataRequest = new App.datasource.MetadataRequest(this.datasourceIdentifier);
            this.dataRequest = new App.datasource.DataRequest(this.datasourceIdentifier);

            var loads = {
                metadata: _.bind(this.metadataRequest.fetch, this.metadataRequest),
                data: _.bind(this.dataRequest.fetch, this.dataRequest)
            };

            if (datasetIdentifier.multidatasetId) {
                if (this.multidataset && this.multidataset.resourceIdentifier.multidatasetId === datasetIdentifier.multidatasetId) {
                    this.multidataset.updateResourceIdentifier(datasetIdentifier);
                } else {
                    var multidatasetModel = new App.modules.multidataset.Multidataset({
                        resourceIdentifier: datasetIdentifier
                    });
                    loads["multidataset"] = function (callback) {
                        multidatasetModel.fetch()
                            .done(function () {
                                callback(null, multidatasetModel);
                            }).fail(function () {
                                callback(null, null);
                            });
                    };
                }
            }

            if (datasetIdentifier.permalinkId) {
                loads["permalink"] = _.bind(DatasetPermalink.retrievePermalink, DatasetPermalink, datasetIdentifier.permalinkId);
            }

            var self = this;
            async.parallel(loads, function (err, result) {
                try {
                    if (err) { 
                        self.errorView = new App.modules.dataset.ErrorView({ error : err });
                        self.region.show(self.errorView);
                        return deferred.promise();
                    }
                    
                    self.metadata = self.metadataRequest.getMetadataResponse();

                    self.filterDimensions = App.modules.dataset.filter.models.FilterDimensions.initializeWithMetadata(self.metadata);
                    self.data = self.dataRequest.getDataResponse(self.metadata, self.filterDimensions);

                    self.multidataset = result.multidataset || self.multidataset;

                    var layoutParams = { controller: self, filterDimensions: self.filterDimensions, metadata: self.metadata, data: self.data, multidataset: self.multidataset };
                    self.selectionView = new App.modules.selection.SelectionView(layoutParams);
                    self.visualizationView = new App.modules.dataset.DatasetView(layoutParams);

                    if (result.permalink) {
                        self.filterDimensions.importJSONSelection(self.filterDimensions.preprocessSelectionWithDynamicSelection(result.permalink.selection, result.permalink.dynamicSelection));
                        self.filterDimensions.importJSONState(result.permalink.state);
                        if (!window.location.hash.includes(result.permalink.hash)) {
                            self.visualizationView.optionsModel.set('mustApplyVisualizationRestrictions', true);
                        }
                    } else if (datasetIdentifier.geo) {
                        self.filterDimensions.importGeographicSelection(datasetIdentifier.geo);
                    }

                    var metadataForDates = self.multidataset ? self.multidataset.get('metadata') : self.metadata;
                    App.Helpers.createUpdateDatesSection({
                        lastUpdate: metadataForDates.getLastUpdate(),
                        nextUpdate: metadataForDates.getDateNextUpdate()
                    });

                    deferred.resolve();
                } catch (error) {
                    console.log(error);
                    self.errorView = new App.modules.dataset.ErrorView({ error : I18n.t('exception.common.unknown')});
                    self.region.show(self.errorView);
                    return deferred.promise();
                }
            });
            return deferred.promise();
        },

    });

}());
