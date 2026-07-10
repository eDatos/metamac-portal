(function (v) {
    "use strict";

    App.namespace("App.modules.dataset");

    App.modules.dataset.DatasetVisualizationView = Backbone.View.extend({

        template: App.templateManager.get("dataset/dataset-visualization"),

        initialize: function (options) {
            this.container = options.container;
            this.data = options.data;
            this.dataSource = options.dataSource;
            this.metadata = options.metadata;
            this.data.colors = {};

            this.filterDimensions = options.filterDimensions;
            this.multidataset = options.multidataset;

            this.optionsModel = options.optionsModel;
            this.veElements = options.veElements;
            this.veWithCustomColors = ['line', 'column', 'bar'];

            this._initializeVisualElements();
        },

        _initializeVisualElements: function () {
            var options = {
                data: this.data,
                filterDimensions: this.filterDimensions,
                animation: this.options.animation,
                optionsModel: this.optionsModel,
                metadata: this.metadata,
                dataSource: this.dataSource,
                multidataset: this.multidataset
            };

            this.ve = {};
            _.each(this.veElements, function (element) {
                switch (element) {
                    case 'selection':
                        this.ve.selection = new App.VisualElement.Selection(options);
                        break;
                    case 'apiEndpoints':
                        this.ve.apiEndpoints = new App.VisualElement.ApiEndpoints(options);
                        break;
                    case 'info':
                        this.ve.info = new App.VisualElement.Info(options);
                        break;
                    case 'column':
                        this.ve.column = new App.VisualElement.ColumnChart(options);
                        break;
                    case 'bar':
                        this.ve.bar = new App.VisualElement.BarChart(options);
                        break;
                    case 'line':
                        this.ve.line = new App.VisualElement.LineChart(options);
                        break;
                    case 'table':
                        this.ve.table = new App.VisualElement.Table(options);
                        break;
                    case 'map':
                        this.ve.map = new App.VisualElement.Map(_.extend(options, {mapType: 'map'}));
                        this.ve.map.on('didLoadVe', this._hideSpinner, this);
                        break;
                    case 'mapbubble':
                        this.ve.mapbubble = new App.VisualElement.Map(_.extend(options, {mapType: 'mapbubble'}));
                        this.ve.mapbubble.on('didLoadVe', this._hideSpinner, this);
                        break;
                }
            }, this);

            var self = this;
            this.loadColors(function () {
                if (self.currentVeNeedsColors()) {
                    self._getCurrentVe().update();
                    self.hideLoading();
                }
            });
        },

        anyVeNeedsColors: function () {
            return _.intersection(this.veElements, this.veWithCustomColors).length > 0;
        },

        currentVeNeedsColors: function () {
            return this.veWithCustomColors.includes(this.currentElement);
        },

        colorsLoaded: function() {
            return this.data._colorsLoaded;
        },

        graphColorsEnabled: function () {
            return this.data && App.config["enableGraphColors"];
        },

        loadColors: function (callback) {
            if (this.graphColorsEnabled() && this.anyVeNeedsColors()) {
                var self = this;

                var api = new App.dataset.StructuralResourcesApi(self.data);
                api.getCodelists(function (codelists) {
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
                        api.getVariableElements(variableUrls, function (variableElements) {
                            var flattenedCodelists = _.flatten(filteredCodelistsWithVariableElements);
                            var flattenedVariableElements = _.flatten(_.map(variableElements, function (variab) {
                                return variab.variableElement;
                            }));

                            for (var code of flattenedCodelists) {
                                self.data.colors[code.urn] = flattenedVariableElements.find(elem => elem.urn === code.variableElement.urn).renderingColor;
                            }

                            self.data._colorsLoaded = true;
                            if (callback) {
                                callback();
                            }
                        });
                    } else {
                        self.data._colorsLoaded = true;
                        if (callback) {
                            callback();
                        }
                    }
                });
            }
        },

        _initializeFullScreen: function () {
        },

        _showSpinner: function () {
            var img = App.resourceContext + "images/loadingSpinner.gif";
            this.$dataSpinner = $("<div class='spinner'><img src='" + img + "'/></div>");

            var $container = this.$el;
            var top = $container.height() / 2 - this.$dataSpinner.height() / 2;
            var left = $container.width() / 2 - this.$dataSpinner.width() / 2;

            this.$dataSpinner.css({top: top, left: left});
            $container.prepend(this.$dataSpinner);
        },

        _hideSpinner: function () {
            if (this.$dataSpinner) {
                this.$dataSpinner.remove();
                this.$dataSpinner = null;
            }
        },

        activeVisualElement: function (element) {
            var oldElement = this._getCurrentVe();
            this._removeCurrentElement();
            this.currentElement = element;
            this.ve[this.currentElement].updatingDimensionPositions(oldElement);
        },

        load: function () {
            this.ve[this.currentElement].load();
            if (this.graphColorsEnabled() && this.currentVeNeedsColors() && !this.colorsLoaded()) {
                this.showLoading();
            }
        },

        showLoading: function () {
            if (this._getCurrentVe()) {
                this._getCurrentVe().showLoading();
            }
        },

        hideLoading: function () {
            if (this._getCurrentVe()) {
                this._getCurrentVe().hideLoading();
            }
        },

        _removeCurrentElement: function () {
            var currentVe = this._getCurrentVe();
            if (currentVe) {
                currentVe.destroy();
                this.$(".dataset-visualization-visual-element").empty();
            }
        },

        _getCurrentVe: function () {
            if (this.currentElement) {
                return this.ve[this.currentElement];
            }
        },

        _willEnterFullScreen: function () {
            this.trigger('willEnterFullScreen');
        },

        _didEnterFullScreen: function () {
            var currentVe = this._getCurrentVe();
            currentVe.resizeFullScreen();
            this.trigger('didEnterFullScreen');
        },

        _willExitFullScreen: function () {
            this.trigger('willExitFullScreen');
        },

        _didExitFullScreen: function () {
            var currentVe = this._getCurrentVe();
            currentVe.resizeFullScreen();
            this.trigger('didExitFullScreen');
        },

        render: function () {
            var context = {};
            this.$el.html(this.template(context));

            var veEl = this.$(".dataset-visualization-visual-element");
            _.each(this.ve, function (ve) {
                ve.setEl(veEl);
            });
        }

    });

}());
