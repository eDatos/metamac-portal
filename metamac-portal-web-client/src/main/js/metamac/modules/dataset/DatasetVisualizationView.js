(function (v) {
    "use strict";

    App.namespace("App.modules.dataset");

    App.modules.dataset.DatasetVisualizationView = Backbone.View.extend({

        template: App.templateManager.get("dataset/dataset-visualization"),

        initialize: function (options) {
            this.container = options.container;
            this.data = options.data;
            this.data.colors = {};

            this.filterDimensions = options.filterDimensions;

            this.optionsModel = options.optionsModel;
            this.veElements = options.veElements;
            options.optionsView.on("enterFullScreen", this.enterFullScreen, this);
            options.optionsView.on("exitFullScreen", this.exitFullScreen, this);

            this.colors = {};
            if (options.data && App.config["enableGraphColors"] === "true") {
                this.api = new App.dataset.StructuralResourcesApi(options.data);

                var self = this;

                this.api.getCodelists(function (codelists) {
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
                            var flattenedVariableElements = _.flatten(_.map(variableElements, function(variab) {
								return variab.variableElement;
							}));

                            for (var code of flattenedCodelists) {
                                self.data.colors[code.urn] = flattenedVariableElements.find(elem => elem.urn === code.variableElement.urn).renderingColor;
                            }

                            if (self.ve[self.currentElement]) {
                                self.ve[self.currentElement].update();
                            }
                        });
                    }
                });
            }

            this._initializeVisualElements();
        },

        _initializeVisualElements: function () {
            var options = {
                data: this.data,
                filterDimensions: this.filterDimensions,
                animation: this.options.animation,
                optionsModel: this.optionsModel
            };
            this.ve = {
                info: new App.VisualElement.Info(options),
                column: new App.VisualElement.ColumnChart(options),
                line: new App.VisualElement.LineChart(options),
                table: new App.VisualElement.Table(options),
                map: new App.VisualElement.Map(_.extend(options, {mapType: 'map'})),
                mapbubble: new App.VisualElement.Map(_.extend(options, {mapType: 'mapbubble'}))
            };
            this.ve.map.on('didLoadVe', this._hideSpinner, this);
            this.ve.mapbubble.on('didLoadVe', this._hideSpinner, this);
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
        },

        showLoading: function () {
            if (this._getCurrentVe()) {
                this._getCurrentVe().showLoading();
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

        enterFullScreen: function () {
            this.trigger("enterFullScreen");
        },

        exitFullScreen: function () {
            this.trigger("exitFullScreen");
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
