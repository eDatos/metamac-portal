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
            var link = this._linkToDatasetSelection(datasetIdentifier);
            this.router.navigate(link);

            var self = this;
            this._loadMetadataAndData(datasetIdentifier).then(function () {
                self.region.show(self.selectionView);
            });
        },

        showDatasetVisualization: function (options) {
            options = _.defaults(options, {
                visualizationType: "table",
                fullScreen: false
            });
            var link = this._linkToDatasetVisualization(options);
            this.router.navigate(link);

            var self = this;
            var datasetIdentifier = _.pick(options, "type", "agency", "identifier", "version", "permalinkId", "indicatorSystem", "geo", "multidatasetId", "widgetTitle");
            if (this.visualizationView) {
                this.visualizationView.showLoading();
            }
            this._loadMetadataAndData(datasetIdentifier).then(function () {
                if (self.region.currentView !== self.visualizationView) {
                    self.region.show(self.visualizationView);
                }
                self.visualizationView.showChart(options);
            });
        },

        changeDatasetVisualization: function (options) {
            var link = this._linkToDatasetVisualization(options);
            this.router.navigate(link, { replace: true });
            this.visualizationView.showChart(options);
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

            if (datasetIdentifier.permalinkId) {
                loads["permalink"] = _.bind(DatasetPermalink.retrievePermalink, DatasetPermalink, datasetIdentifier.permalinkId)
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

                    self.selectionView = new App.modules.selection.SelectionView({ controller: self, collection: self.filterDimensions, metadata: self.metadata, data: self.data });

                    self.visualizationView = new App.modules.dataset.DatasetView({ controller: self, filterDimensions: self.filterDimensions, metadata: self.metadata, data: self.data });

                    if (result.permalink) {
                        self.filterDimensions.importJSONSelection(self.filterDimensions.preprocessSelectionWithDynamicSelection(result.permalink.selection, result.permalink.dynamicSelection));
                        self.filterDimensions.importJSONState(result.permalink.state);
                        if (!window.location.hash.includes(result.permalink.hash)) {
                            self.visualizationView.optionsModel.set('mustApplyVisualizationRestrictions', true);
                        }
                    } else if (datasetIdentifier.geo && self.filterDimensions.where({ type: "GEOGRAPHIC_DIMENSION" })?.length !== 0) {
                        self.filterDimensions.importGeographicSelection(datasetIdentifier.geo);
                    }
                    deferred.resolve();
                } catch (error) {
                    console.log(error);
                    self.errorView = new App.modules.dataset.ErrorView({ error : I18n.t('exception.common.unknown')});
                    self.region.show(self.errorView);
                    return deferred.promise();
                }
            });
            return deferred.promise();
        }
    });

}());
