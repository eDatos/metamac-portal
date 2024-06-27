(function () {
    'use strict';

    var GeoJsonConverter = App.Map.GeoJsonConverter;
    var Constants = App.Constants;
    var DATA_SERIE_INDEX = 0;

    App.namespace('App.Map.MapView');

    App.Map.MapView = Backbone.View.extend({

        initialize: function (options) {
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

            this.tooltipDelegate = new App.Map.TooltipDelegate(options);

            this._onResize = _.debounce(_.bind(this._onResize, this), 200);
            this._updateDataClasses = _.debounce(_.bind(this._updateDataClasses, this), 100);

            this.mapOptions = this._initializeMapOptions();
            this.mapOptions.title.text = options.rightsHolder;
            this.mapOptions.title.show = options.showRightsHolder;
            if (this.mapType === 'map') {
                this.mapOptions.visualMap.formatter = function (min, max) {
                    var metadataMaxDecimals = options.metadata.getMaxDecimals();
                    var minString = App.util.NumberFormatter.strNumberToLocalizedString(min.toString(), {decimals: metadataMaxDecimals});
                    var maxString = App.util.NumberFormatter.strNumberToLocalizedString(max.toString(), {decimals: metadataMaxDecimals});
                    return minString + " - " + maxString;
                }
            } else {
                this.mapOptions.visualMap = undefined;
            }
        },

        events: {
            "mousewheel": "_handleMousewheel",
            "dblclick": "_handleDblclick",
            "resize": "_onResize"
        },

        _initializeMapOptions: function () {
            return {
                animation: false,
                    tooltip: {
                    show: false
                },
                visualMap: {
                    type: "piecewise",
                        showLabel: true,
                        hoverLink: false,
                        left: 'center',
                        bottom: 5,
                        orient: 'horizontal',
                        inRange: {
                        color: [
                            Constants.colors.istacBlueWhite,
                            Constants.colors.istacBlueDark
                        ]
                    },
                    text: null,
                        itemSymbol: 'circle',
                        borderColor: Constants.colors.istacGreyMedium,
                        borderWidth: 1,
                        textStyle: {
                        fontSize: Constants.charts.legend.fontSize,
                            symbolSize: Constants.charts.legend.fontSize
                    },
                    backgroundColor: Constants.colors.istacWhite,
                        padding: Constants.charts.legend.padding,
                        textGap: Constants.charts.legend.gap,
                        itemGap: Constants.charts.legend.gap
                },
                title: {
                    right: Constants.charts.title.marginRight,
                        padding: 0,
                        textStyle: {
                        fontSize: Constants.charts.title.fontSize,
                            color: Constants.colors.istacGreyDark
                    }
                }
            };
        },

        update: function (newDataJson, newShapeList, newTitle, redraw) {
            this._dataJson = newDataJson;
            this._shapeList = newShapeList;
            this.title = newTitle;

            var geoJson = GeoJsonConverter.shapeListToGeoJson(this._shapeListOrderByHierarchy());
            var data = this._getData(geoJson);
            if (this.mapType === "map") {
                this.mapData = this._filterShapesWithoutData(this._getMapDataFromGeoJson(geoJson), data);
                echarts.registerMap('map', GeoJsonConverter.geoJsonListToGeoJson([this.containerMapData, this.baseMapData, this.mapData]));
            } else {
                echarts.registerMap('map', GeoJsonConverter.geoJsonListToGeoJson([this.containerMapData, this.baseMapData]));
            }

            this.mapOptions.series[DATA_SERIE_INDEX].data = data;
            this.mapOptions.series[DATA_SERIE_INDEX].name = this.title;
            this.map.setOption({series: this.mapOptions.series});
        },

        render: function () {
            this._createMapContent();
            this.delegateEvents();
        },

        destroy: function () {
            if (this.map) {
                this.map.dispose();
                this.map = null;
            }

            this.undelegateEvents();
        },

        transform: function () {
            this.map.setOption({
                geo: {
                    zoom: this.model.get("currentScale")
                }
            });
        },

        zoomExit: function () {
            this.mapOptions.geo.boundingCoords = this._getCenteredAndZoomedCoords();
            this.map.setOption(this.mapOptions.geo);
        },

        updateRanges: function () {
            this._updateDataClasses();
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

            this.mapOptions.series = [];
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

                    this.mapOptions.series.push(choroplethDataSerie);
                    break;
                case 'mapbubble':
                    var bubbleDataSerie = {
                        id: "bubbleDataSerie",
                        name: this.title,
                        type: 'scatter',
                        geoIndex: 0,
                        coordinateSystem: 'geo',
                        symbolSize: function (data) {
                            var maxSymbolSize = 0.2 * Math.min(self.el.clientWidth, self.el.clientHeight);
                            var dataValue = data[2];
                            return (dataValue / self.maxDataValue) * maxSymbolSize;
                        },
                        data: data
                    };

                    this.mapOptions.series.push(bubbleDataSerie);
                    break;
            }

            if (this.mapOptions.visualMap) {
                this.mapOptions.visualMap.pieces = this._generateDataClasses();
            }
            this.mapOptions.geo = {
                map: 'map',
                roam: 'move',
                boundingCoords: this._getCenteredAndZoomedCoords(),
                emphasis: {
                    disabled: this.mapType === "mapbubble",
                    label: {
                        show: false
                    }
                },
                tooltip: this.mapType === "mapbubble" ? {show: false} : {}, // It is not equal to: {show: this.mapType !== "mapbubble"}
                regions: [
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
                ]
            };

            this.map = echarts.init(this.el, null, { renderer: 'svg' });
            this.map.on('finished', function () {
                self._callback();
            });
            this.map.setOption(this.mapOptions, true);
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
            return mapData.features.reduce(function (data, feature) {
                var dataJsonItem = self._dataJson[feature.id];
                if (!dataJsonItem) {
                    return data;
                }

                var dataNormCode = feature.id;
                var dataValue = dataJsonItem.value;
                self.maxDataValue = self.maxDataValue ? Math.max(dataValue, self.maxDataValue) : dataValue;
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
                        formatter: function () {
                            return self.tooltipDelegate._getLabelFromNormCode(dataNormCode) + ': ' + self._data.getStringData({ ids: currentPermutation });
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

        _updateDataClasses: function () {
            if (this.model.get('mapType') !== 'map' || !this.map || !this.mapOptions.visualMap) {
                return;
            }

            this.mapOptions.visualMap.pieces = this._generateDataClasses();
            this.map.setOption({
                visualMap: {
                    pieces: this.mapOptions.visualMap.pieces
                }
            });
        },

        _getCenteredAndZoomedCoords: function () {
            if (!this.boundingCoords) {
                this.boundingCoords = this._getMinMaxCoordinates(this.mapData || this.baseMapData);
            }
            return this.boundingCoords;
        },

        _generateDataClasses: function () {
            var dataClasses = [];
            var rangeLimits = this.model.createRangeLimits(this.metadata.getMaxDecimals());
            for (var i = 0; i < rangeLimits.length - 1; i++) {
                dataClasses[i] = { min: rangeLimits[i], max: rangeLimits[i + 1] };
            }
            return dataClasses;
        },

        _offsetFromMouseEvent: function (e) {
            var offset = this.$el.offset();
            var xOffset = e.pageX - (offset.left + this._width / 2);
            var yOffset = e.pageY - (offset.top + this._height / 2);
            return { left: xOffset, top: yOffset };
        },

        _handleMousewheel: function (e, delta, deltaX, deltaY) {
            var offset = this._offsetFromMouseEvent(e);
            this.model.zoomMouseWheel({ delta: deltaY, xOffset: offset.left, yOffset: offset.top });
            return false;
        },

        _handleDblclick: function (e) {
            var offset = this._offsetFromMouseEvent(e);
            this.model.zoomMouseWheel({ delta: 1, xOffset: offset.left, yOffset: offset.top });
        },

        _onResize: function () {
            this.map.resize({
                width: this.el.clientWidth,
                height: this.el.clientHeight
            });
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
        }
    });

}());
