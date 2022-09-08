(function () {
    "use strict";

    var Constants = App.Constants;

    App.namespace("App.VisualElement.LineChart");

    App.VisualElement.LineChart = function (options) {
        this.initialize(options);
        this._type = 'line';

        this._masterOptions = {
            chart: {
                animation: false,
                renderTo: '',
                type: 'line',
                borderWidth: 0,
                backgroundColor: null,
                marginLeft: 5,
                marginRight: 5
            },
            credits: {
                enabled: false
            },
            tooltip: {
                formatter: function () {
                    return false;
                }
            },
            xAxis: {
                labels: {
                    formatter: function () {
                        return this.value.substring(0, 8);
                    }
                },
                tickInterval: 1
            },
            yAxis: {
                gridLineWidth: 0,
                labels: {
                    enabled: false
                },
                title: {
                    text: null
                },
                showFirstLabel: false
            },
            title: {
                text: ''
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                series: {
                    animation: false,
                    turboThreshold: 1200
                },
                line: {
                    lineWidth: 1,
                    marker: {
                        enabled: false
                    }
                }
            },
            exporting: {
                enabled: false
            }
        };
        _.extend(this._chartOptions, {
            chart: {
                animation: false,
                renderTo: '',
                type: 'line',
                borderWidth: 0,
                backgroundColor: Constants.colors.istacWhite,
                marginRight: 0
            },
            title: {
                text: '',
                style: {
                    color: App.Constants.colors.hiddenText,
                    fontSize: App.Constants.font.title.size
                }
            },
            subtitle: {
                text: '',
                style: {
                    color: App.Constants.colors.hiddenText
                }
            },
            credits: {
                position: {
                    y: -5,
                    x: -10
                }
            },
            tooltip: {
                formatter: this.tooltipFormatter
            },
            xAxis: {
                labels: {}
            },
            yAxis: {
                title: {
                    text: ""
                },
                plotLines: [
                    {
                        value: 0,
                        width: 1,
                        color: Constants.colors.istacGreyDark
                    }
                ]
            },
            plotOptions: {
                line: {
                    lineWidth: 1.5,
                    marker: {
                        radius: 3
                    }
                },
                series: {
                    animation: false,
                    turboThreshold: 1200
                }
            }
        });

        this._element = null;

        this.config = {
            masterHeight: 80,
            xAxisTicks: 6
        };

        var hasTimeDimensions = this.data.metadata.getTimeDimensions().length > 0;
        var detailZoomModelStart = hasTimeDimensions ? 0 : 0;
        var detailZoomModelStop = hasTimeDimensions ? 1 : 0.48;

        this.detailZoomModel = new App.VisualElement.line.DetailZoomModel({ start: detailZoomModelStart, stop: detailZoomModelStop });
        this.detailZoomModel.on("change", _.debounce(this._updateDetail, 300), this);
    };

    App.VisualElement.LineChart.prototype = new App.VisualElement.Base();

    _.extend(App.VisualElement.LineChart.prototype, {

        load: function () {
            this._bindEvents();
            if (!this.assertAllDimensionsHaveSelections()) {
                return;
            }
            this.render();
            if (!this.colorsLoaded()) {
                this.loadColors();
            }
        },

        destroy: function () {
            this._unbindEvents();

            if (this.masterChart) {
                this.masterChart.destroy();
                this.masterChart = null;
            }
            if (this.detailChart) {
                this.detailChart.destroy();
                this.detailChart = null;
            }
        },

        _bindEvents: function () {
            this.listenTo(this.filterDimensions, "change:drawable change:zone change:visibleLabelType reverse", _.debounce(this.update, 100));

            var resize = _.debounce(_.bind(this._updateSize, this), 200);
            this.$el.on("resize", function (e) {
                e.stopPropagation();
                resize();
            });
        },

        _unbindEvents: function () {
            this.stopListening();
            this.$el.off("resize");
        },

        updatingDimensionPositions: function () {
            this._applyVisualizationRestrictions();
            this.resetDimensionsLimits();

            this.filterDimensions.zones.get('top').set('maxSize', 1); // lines      
            this.filterDimensions.zones.get('left').set('fixedSize', 1); // AxisX
            this.filterDimensions.zones.get('axisy').set('maxSize', 1);
        },

        _applyVisualizationRestrictions: function () {
            if (this._mustApplyVisualizationRestrictions()) {
                this._moveAllDimensionsToZone('top');
                this._moveAllSingleValueDimensionsToZone('fixed');
                                
                this._forceMeasureDimensionInZone('axisy');
                this._forceTimeDimensionInZone('left');
                this._forceGeographicDimensionInZone('fixed');

                this._applyVisualizationPreselections();
            }

            this._updateMustApplyVisualizationRestrictions();
        },

        _applyVisualizationPreselections: function () {
            this._preselectBiggestHierarchyGeographicValue();
            this._preselectMostPopulatedTemporalGranularityRepresentations();
        },

        tooltipFormatter: function () {
            return '<strong>' + this.series.name + ', ' + this.x + '</strong>:<br/>' + this.point.name;
        },

        render: function () {
            this.$el.empty();
            this.$title = $('<h3></h3>');
            this.updateTitle();
            this.$el.append(this.$title);

            this._renderContainers();
            this._renderMaster();
            this._renderDetail();
        },

        _renderContainers: function () {
            var detailHeight = this.$el.height() - this.config.masterHeight - this.$title.height() - this.getRightsHolderHeight();
            this.$detailContainer = $('<div id="detail-container">')
                .css({ height: detailHeight })
                .appendTo(this.$el);

            this.$masterContainer = $('<div id="master-container">')
                .css({ position: 'absolute', bottom: 0, height: this.config.masterHeight, width: '100%' })
                .appendTo(this.$el);
        },

        _renderMaster: function () {
            this.getData();

            this.detailZoomModel.set('step', 1 / this.processedData.xAxis.length);

            this._masterOptions.chart.renderTo = this.$masterContainer[0];
            this._masterOptions.series = this.processedData.series;
            this._masterOptions.xAxis.categories = this.processedData.xAxis;
            this._masterOptions.xAxis.tickInterval = Math.ceil(this.processedData.xAxis.length / this.config.xAxisTicks);
            this.masterChart = new Highcharts.Chart(this._masterOptions);

            this.detailZoomView = new App.VisualElement.line.DetailZoomView({ model: this.detailZoomModel, "$targetEl": this.$masterContainer });
            this.detailZoomView.render();
        },

        _renderDetail: function () {
            var detailData = this.getDetailData();

            this._chartOptions.chart.renderTo = this.$detailContainer[0];
            this._chartOptions.series = detailData.series;
            this._chartOptions.xAxis.categories = detailData.xAxis;
            this._chartOptions.xAxis.min = detailData.min;
            this._chartOptions.xAxis.max = detailData.max;
            this._chartOptions.xAxis.tickInterval = detailData.tickInterval;

            this._chartOptions.credits.text = this.getRightsHolderText();
            if (!this.showRightsHolderText()) {
                this._chartOptions.credits.style = {
                    color: App.Constants.colors.hiddenText
                }
            }

            this.detailChart = new Highcharts.Chart(this._chartOptions);
        },

        _updateSize: function () {
            var detailHeight = this.$el.height() - this.config.masterHeight - this.$title.height();
            this.$detailContainer.css({ height: detailHeight });

            this.detailChart.setSize(this.$detailContainer.width(), this.$detailContainer.height(), false);
            this.masterChart.setSize(this.$masterContainer.width(), this.$masterContainer.height(), false);
            this.detailZoomView.updateSize();
        },

        update: function () {
            if (!this.assertAllDimensionsHaveSelections()) {
                return;
            }

            if (!this.masterChart || !this.detailChart) {
                this.load();
                return;
            }

            this.updateTitle();
            this._updateMaster();
            this._updateDetail();
        },

        _updateMaster: function () {
            var data = this.getData();
            this.replaceSeries(this.masterChart, data.series);
            this.masterChart.xAxis[0].setCategories(data.xAxis, false);
            this.masterChart.redraw();
        },

        _updateDetail: function () {
            if (!this.detailChart) {
                return;
            }
            
            var detailData = this.getDetailData();
            this.replaceSeries(this.detailChart, detailData.series);

            this.detailChart.xAxis[0].update(
                {
                    categories: detailData.xAxis,
                    min: detailData.min,
                    max: detailData.max,
                    tickInterval: detailData.tickInterval
                },
                false
            );

            this.detailChart.redraw(false);
        },

        getData: function () {
            var self = this;

            var result = {};
            var fixedPermutation = this.getFixedPermutation();

            var horizontalDimension = this.filterDimensions.dimensionsAtZone('left').at(0);
            var columnsDimension = this.filterDimensions.dimensionsAtZone('top').at(0);
            if (!columnsDimension) {
                columnsDimension = this.filterDimensions.dimensionsAtZone('fixed').at(0);
            }
            if (!columnsDimension) {
                columnsDimension = this.filterDimensions.dimensionsAtZone('axisy').at(0);
            }

            var selectedTemporalGranularity = horizontalDimension.get("representations").getSelectedTemporalGranularity();
            var horizontalDimensionCategories = horizontalDimension.get('representations').where({ temporalGranularity: selectedTemporalGranularity });
            horizontalDimensionCategories = _.sortBy(horizontalDimensionCategories, function (representation) {
                return representation.normCode;
            }).reverse();
            
            var columnsDimensionSelectedCategories = this.getDrawableRepresentations(columnsDimension);

            var listSeries = [];
            _.each(columnsDimensionSelectedCategories, function (columnCategory) {
                var serie = {};
                serie.data = [];
                serie.name = "";

                _.each(horizontalDimensionCategories, function (horizontalCategory) {
                    var currentPermutation = {};
                    currentPermutation[horizontalDimension.id] = horizontalCategory.id;
                    currentPermutation[columnsDimension.id] = columnCategory.id;
                    _.extend(currentPermutation, fixedPermutation);

                    var y = null;
                    if (horizontalCategory.get("drawable")) {
                        y = self.data.getNumberData({ ids: currentPermutation });
                    }
                    var name = self.data.getStringData({ ids: currentPermutation });
                    serie.data.push({ y: y, name: name });
                });

                serie.name = columnCategory.get('visibleLabel');
                listSeries.push(serie);
            });

            var xaxis = _.invoke(horizontalDimensionCategories, 'get', 'visibleLabel');

            // Changing the options of the chart
            result.series = listSeries;
            result.xAxis = xaxis;

            this.processedData = result;

            return result;
        },

        getDetailData: function () {
            var total = this.processedData.xAxis.length;
            var indexStart = Math.round(total * this.detailZoomModel.get('start'));
            var indexStop = Math.round(total * this.detailZoomModel.get('stop'));

            var marginIndexStart = Math.max(0, indexStart - 1);
            var marginIndexStop = Math.min(total, indexStop + 1);

            var tickInterval = 1;
            if (this.filterDimensions.dimensionsAtZone('left').at(0).isTimeDimension()) {
                var filteredTotal = marginIndexStop - marginIndexStart;
                tickInterval = Math.ceil(filteredTotal / this.config.xAxisTicks);
            }

            var result = {
                series: this.processedData.series,
                xAxis: this.processedData.xAxis,
                min: indexStart,
                max: indexStop - 1,
                tickInterval: tickInterval
            };
            return result;
        }

    });

}());
