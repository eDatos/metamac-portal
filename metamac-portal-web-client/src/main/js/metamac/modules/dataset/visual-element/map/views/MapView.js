(function () {
    'use strict';

    var GeoJsonConverter = App.Map.GeoJsonConverter;
    var Constants = App.Constants;

    App.namespace('App.Map.MapView');

    App.Map.MapView = Backbone.View.extend(new App.VisualElement.Chart()).extend({

        initialize: function (options) {
            this._initializeChartVisualElement(options);

            this._data = options.data;
            this._filterDimensions = options.filterDimensions;
            this._width = options.width;
            this._height = options.height;
            this._shapeList = options.shapeList;
            this._baseShapeList = options.baseShapeList;
            this._container = options.container;
            this._dataJson = options.dataJson;
            this._callback = options.callback;
            this.mapType = options.mapType;
            this.title = options.title;
            this.metadata = options.metadata;
            this.$title = options.$title;
            this.rightsHolder = options.rightsHolder;
            this.showRightsHolder = options.showRightsHolder;

            this._initializeMapOptions();

            this.tooltipDelegate = new App.Map.TooltipDelegate(options);

            this._onResize = _.debounce(_.bind(this._onResize, this), 200);
        },

        events: {
            "dblclick": "_handleDblclick",
            "resize": "_onResize"
        },

        _initializeMapOptions: function () {
            var self = this;
            this._extendChartOptions({
                animation: false,
                tooltip: {
                    show: false
                },
                legend: {
                    show: false
                },
                xAxis: undefined,
                yAxis: undefined,
                visualMap: (this.mapType === 'mapbubble') ? undefined : {
                    // INFO
                    // The type should be piecewise but with that type the width can't be controlled so it doesn't fit in the container.
                    // Fix when one of theses issues are closed: https://github.com/apache/echarts/issues/13759 , https://github.com/apache/echarts/issues/17659
                    // In order to change it, check the commit in which this comment was added.
                    type: "continuous",
                    realtime: false,
                    min: this.model.get("minValue"),
                    max: this.model.get("maxValue"),
                    calculable: true,
                    hoverLink: false,
                    left: 'center',
                    bottom: Constants.charts.title.fontSize + (Constants.charts.gap * 2),
                    orient: 'horizontal',
                    inRange: {
                        color: [
                            Constants.colors.istacBlueWhite,
                            Constants.colors.istacBlueDark
                        ]
                    },
                    outOfRange: {
                        color: ['transparent']
                    },
                    controller: {
                        outOfRange: {
                            color: [Constants.colors.istacGreyMedium]
                        }
                    },
                    text: null,
                    textStyle: {
                        fontSize: Constants.charts.legend.fontSize,
                        symbolSize: Constants.charts.legend.fontSize
                    },
                    formatter: function (value) {
                        var breaksToShowValueUnderVisualMap = "\n\n\n\n\n\n\n\n";
                        var formattedValue = App.util.NumberFormatter.strNumberToLocalizedString(value.toString(), {decimals: self.metadata.getMaxDecimals()});

                        self.isVisualMapFormattingMin = !self.isVisualMapFormattingMin;
                        return (self.isVisualMapFormattingMin ? breaksToShowValueUnderVisualMap : "") + formattedValue;
                    }
                },
                title: {
                    text: this.rightsHolder,
                    show: this.showRightsHolder,
                    bottom: Constants.charts.gap
                },
                geo: {
                    map: 'map',
                    roam: true,
                    itemStyle: {
                        borderWidth: 0.02,
                        borderColor: Constants.colors.istacWhite
                    },
                    scaleLimit: {
                        min: this.model.get("minScale"),
                        max: this.model.get("maxScale")
                    },
                    emphasis: {
                        disabled: this.mapType === "mapbubble",
                        label: {
                            show: false
                        }
                    },
                    tooltip: this.mapType === "mapbubble" ? {show: false} : {}, // It is not equal to: {show: this.mapType !== "mapbubble"}
                }
            });
        },

        update: function (newDataJson, newShapeList, newTitle) {
            this._dataJson = newDataJson;
            this._shapeList = newShapeList;
            this.title = newTitle;

            var geoJson = GeoJsonConverter.shapeListToGeoJson(this._shapeListOrderByHierarchy());
            var data = this._getData(geoJson);
            // INFO
            // This condition was added because eCharts doesn't need the mapData for the bubble/scatter chart.
            // Also, before this condition we were showing mapData the same color as baseMapData for the bubble chart, so visually it is the same as before.
            // Therefore, we can avoid the additional calculation and simply display the basemap.
            if (this.mapType === "map") {
                this.mapData = this._filterShapesWithoutData(this._getMapDataFromGeoJson(geoJson), data);
                echarts.registerMap('map', GeoJsonConverter.geoJsonListToGeoJson([this.containerMapData, this.baseMapData, this.mapData]));
            } else {
                echarts.registerMap('map', GeoJsonConverter.geoJsonListToGeoJson([this.containerMapData, this.baseMapData]));
            }

            this._extendChartOptions({
                series: this._createMapSeries(data)
            });
            this._getChart().setOption({series: this._chartOptions.series});
        },

        render: function () {
            this._createMapContent();
            this.delegateEvents();
        },

        _onChartDestroy: function () {
            this.undelegateEvents();
        },

        transform: function () {
            if (this.model.get("currentScale") !== this._getChart().getOption().geo[0].zoom) {
                this._extendChartOptions({
                    geo: {
                        zoom: this.model.get("currentScale")
                    }
                });
                this._getChart().setOption({
                    geo: {
                        zoom: this._chartOptions.geo.zoom
                    }
                });
            }
        },

        zoomExit: function () {
            this._extendChartOptions({
                geo: {
                    boundingCoords: this._getCenteredAndZoomedCoords(),
                    center: undefined
                }
            });
            this._getChart().setOption({ geo: this._chartOptions.geo });
        },

        updateRanges: function () {
            this._extendChartOptions({
                visualMap: (this.mapType === 'mapbubble') ? undefined : {
                    min: this.model.get("minValue"),
                    max: this.model.get("maxValue")
                }
            });
            this._getChart().setOption({ visualMap: this._chartOptions.visualMap });
        },

        canRender: function () {
            return this._shapeListOrderByHierarchy().length > 0;
        },

        _shapeListOrderByHierarchy: function () {
            return _.chain(this._shapeList).compact().sortBy(function (shape) {
                return -shape.hierarchy; //reverse order
            }).value();
        },

        _createMapContent: function () {
            var geoJson = GeoJsonConverter.shapeListToGeoJson(this._shapeListOrderByHierarchy());
            var baseGeoJson = GeoJsonConverter.shapeListToGeoJson(this._baseShapeList, { contour: true });
            var containerGeoJson = GeoJsonConverter.shapeListToGeoJson([this._container], { contour: true });

            var data = this._getData(geoJson);

            this.baseMapData = this._getMapDataFromGeoJson(baseGeoJson);
            this.containerMapData = this._getMapDataFromGeoJson(containerGeoJson);
            if (this.mapType === "map") {
                this.mapData = this._filterShapesWithoutData(this._getMapDataFromGeoJson(geoJson), data);
                echarts.registerMap('map', GeoJsonConverter.geoJsonListToGeoJson([this.containerMapData, this.baseMapData, this.mapData]));
            } else {
                echarts.registerMap('map', GeoJsonConverter.geoJsonListToGeoJson([this.containerMapData, this.baseMapData]));
            }

            var self = this;
            this._initializeChart(this.$el, this.$title);
            this._getChart().on('georoam', function (roamParams) {
                if (roamParams.zoom) {
                    self.model.zoomTo(self._getChart().getOption().geo[0].zoom);
                } else {
                    self.$chartContainer.find("canvas").addClass("grabbing");
                }
            });
            this._getChart().getZr().on('mouseup', function () {
                self.$chartContainer.find("canvas").removeClass("grabbing");
            });
            this._getChart().on('finished', function () {
                self._callback();
            });

            this._extendChartOptions({
                series: this._createMapSeries(data),
                geo: {
                    boundingCoords: this._getCenteredAndZoomedCoords(),
                    regions: this._createSpecialRegionsOptions()
                }
            });
            this._getChart().setOption(this._chartOptions, true);
            this._setTooltipObserver();
        },

        _createSpecialRegionsOptions: function () {
            return [
                ...this.containerMapData.features.map(function (feature) {
                    return {
                        name: feature.id,
                        itemStyle: {
                            borderWidth: 0,
                            areaColor: Constants.colors.istacGreyLight
                        },
                        emphasis: {
                            disabled: true
                        },
                        tooltip: {
                            show: false
                        }
                    };
                }),
                ...this.baseMapData.features.map(function (feature) {
                    return {
                        name: feature.id,
                        itemStyle: {
                            borderWidth: 0,
                            areaColor: Constants.colors.istacGreyMedium
                        },
                        emphasis: {
                            disabled: true
                        },
                        tooltip: {
                            show: false
                        }
                    };
                })
            ];
        },

        _createMapSeries: function (data) {
            var series = [];
            var self = this;
            switch (this.mapType) {
                case 'map':
                    var choroplethDataSerie = {
                        id: "choroplethDataSerie",
                        name: this.title,
                        type: 'map',
                        geoIndex: 0,
                        selectedMode: false,
                        emphasis: {
                            itemStyle: {
                                areaColor: Constants.colors.istacYellow
                            },
                            label: {
                                show: false
                            }
                        },
                        data: data
                    };

                    series.push(choroplethDataSerie);
                    break;
                case 'mapbubble':
                    var bubbleDataSerie = {
                        id: "bubbleDataSerie",
                        name: this.title,
                        type: 'scatter',
                        geoIndex: 0,
                        coordinateSystem: 'geo',
                        itemStyle: {
                            color: Constants.colors.istacYellow
                        },
                        symbolSize: function (data) {
                            var maxSymbolSize = 0.2 * Math.min(self.el.clientWidth, self.el.clientHeight);
                            var dataValue = data[2];
                            return (dataValue / self.maxDataValue) * maxSymbolSize;
                        },
                        data: data
                    };

                    series.push(bubbleDataSerie);
                    break;
            }

            return series;
        },

        _geOptimalCoordsForBubble: function (regionFeature) {
            var optimalCoordsForBubble = [];
            var regionCoords = regionFeature.geometry.coordinates;
            if (regionFeature.geometry.type === "Polygon") {
                optimalCoordsForBubble = polylabel(regionCoords);
            } else if (regionFeature.geometry.type === "MultiPolygon" && regionCoords.length > 0) {
                var mostComplexPolygonCoords = regionCoords.reduce(function (mostComplexPolygonCoords, regionPolygonCoords) {
                    return mostComplexPolygonCoords.length > regionPolygonCoords.length ? mostComplexPolygonCoords : regionPolygonCoords[0];
                });
                optimalCoordsForBubble = polylabel(mostComplexPolygonCoords);
            }
            return optimalCoordsForBubble;
        },

        _getData: function (mapData) {
            var geographicDimension = this._filterDimensions.where({ type: "GEOGRAPHIC_DIMENSION" })[0];
            var self = this;
            self.maxDataValue = -Infinity;
            return mapData.features.reduce(function (data, feature) {
                var dataJsonItem = self._dataJson[feature.id];
                if (!dataJsonItem) {
                    return data;
                }

                var dataNormCode = feature.id;
                var dataValue = dataJsonItem.value;
                self.maxDataValue = Math.max(dataValue, self.maxDataValue);
                var geographicRepresentationId = geographicDimension.get("representations").where({ normCode: dataNormCode })[0].id;
                var currentPermutation = self._filterDimensions.models.reduce((dimensionsPermutation, filterDimension) => {
                    dimensionsPermutation[filterDimension.id] = (filterDimension.get("type") === "GEOGRAPHIC_DIMENSION")
                        ? geographicRepresentationId
                        : filterDimension.getDrawableRepresentations()[0].id;
                    return dimensionsPermutation;
                }, {});

                data.push({
                    value: (self.mapType === 'mapbubble') ? [...self._geOptimalCoordsForBubble(feature), dataValue] : dataValue,
                    name: dataNormCode,
                    tooltip: {
                        show: true,
                        showDelay: 250,
                        formatter: function () {
                            var tooltipContent = self.tooltipDelegate._getLabelFromNormCode(dataNormCode) + ': ' + self._data.getStringData({ ids: currentPermutation });
                            return self._getWrappedTooltipContent(tooltipContent);
                        }
                    }
                });
                return data;
            }, []);
        },

        _getMapDataFromGeoJson: function (geoJson) {
            geoJson.features = _.map(geoJson.features, function (item) {
                item.properties.name = item.id;
                return item;
            });
            return geoJson;
        },

        _getCenteredAndZoomedCoords: function () {
            if (!this.boundingCoords) {
                this.boundingCoords = this._getMinMaxCoordinates(this.mapData || this.baseMapData);
            }
            return this.boundingCoords;
        },

        _offsetFromMouseEvent: function (e) {
            var offset = this.$el.offset();
            var xOffset = e.pageX - (offset.left + this._width / 2);
            var yOffset = e.pageY - (offset.top + this._height / 2);
            return { left: xOffset, top: yOffset };
        },

        _handleDblclick: function (e) {
            var offset = this._offsetFromMouseEvent(e);
            this.model.zoomMouseWheel({ delta: 1, xOffset: offset.left, yOffset: offset.top });
        },

        _onResize: function () {
            this._updateSize(this.$el, this.$title);
        },

        _filterShapesWithoutData: function (mapData, data) {
            var dataCodes = _.pluck(data, 'name');
            mapData.features = _.filter(mapData.features, function (mapDataEntry) {
                return _.contains(dataCodes, mapDataEntry.properties.name);
            });
            return mapData;
        },

        _getMinMaxCoordinates: function (geoJson, minX, minY, maxX, maxY) {
            minX = minX || Infinity;
            minY = minY || Infinity;
            maxX = maxX || -Infinity;
            maxY = maxY || -Infinity;

            if (!geoJson) {
                return [[maxX, minY], [minX, maxY]];
            }

            var self = this;
            if (Array.isArray(geoJson)) {
                if ((geoJson.length === 2) && (typeof geoJson[0] === 'number') && (typeof geoJson[1] === 'number')) {
                    minX = Math.min(geoJson[0], minX);
                    minY = Math.min(geoJson[1], minY);
                    maxX = Math.max(geoJson[0], maxX);
                    maxY = Math.max(geoJson[1], maxY);
                } else {
                    geoJson.forEach(function (item) {
                        [[maxX, minY], [minX, maxY]] = self._getMinMaxCoordinates(item, minX, minY, maxX, maxY);
                    });
                }
            } else if (typeof geoJson === 'object') {
                for (const key in geoJson) {
                    if (geoJson.hasOwnProperty(key)) {
                        [[maxX, minY], [minX, maxY]] = this._getMinMaxCoordinates(geoJson[key], minX, minY, maxX, maxY);
                    }
                }
            }
            return [[maxX, minY], [minX, maxY]];
        },

        _getExportChartHeight: function () {
            return this.$chartContainer.height();
        },

        _getExtraExportOptions: function () {
            return {
                geo: this._getChart().getOption().geo,
                visualMap: (this.mapType === "mapbubble") ? undefined : {
                    range: this._getChart().getOption().visualMap[0].range
                },
                title: {
                    top: 'auto'
                },
            };
        }
    });

}());
