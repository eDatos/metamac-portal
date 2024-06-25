(function () {
    'use strict';

    var GeoJsonConverter = App.Map.GeoJsonConverter;
    var Constants = App.Constants;
    var DATA_SERIE_INDEX = 0;

    App.namespace('App.Map.MapView');

    App.Map.MapView = Backbone.View.extend({

        // Esta fontFamily debe ser siempre equivalente a @istacFontFamilySansSerifFamily
        _defaultMapOptions: {
            animation: false,
            tooltip: {
                show: true
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
        },

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

            this._defaultMapOptions.title.text = options.rightsHolder;
            this._defaultMapOptions.title.show = options.showRightsHolder;
            this._defaultMapOptions.visualMap.show = (this.mapType === 'map');
            this._defaultMapOptions.visualMap.formatter = function(min, max) {
                var metadataMaxDecimals = options.metadata.getMaxDecimals();
                var minString = App.util.NumberFormatter.strNumberToLocalizedString(min.toString(), {decimals: metadataMaxDecimals});
                var maxString = App.util.NumberFormatter.strNumberToLocalizedString(max.toString(), {decimals: metadataMaxDecimals});
                return minString + " - " + maxString;
            }
        },

        events: {
            "mousewheel": "_handleMousewheel",
            "dblclick": "_handleDblclick",
            "resize": "_onResize"
        },

        update: function (newDataJson, newShapeList, newTitle, redraw) {
            this._dataJson = newDataJson;
            this._shapeList = newShapeList;
            this.title = newTitle;

            var geoJson = GeoJsonConverter.shapeListToGeoJson(this._shapeListOrderByHierarchy());
            var data = this._getData();
            this.mapData = this._filterShapesWithoutData(this._getMapDataFromGeoJson(geoJson), data);
            echarts.registerMap('map', GeoJsonConverter.geoJsonListToGeoJson([this.containerMapData, this.baseMapData, this.mapData]));

            this._defaultMapOptions.series[DATA_SERIE_INDEX].data = data;
            this._defaultMapOptions.series[DATA_SERIE_INDEX].name = this.title;
            this.map.setOption({series: this._defaultMapOptions.series});
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
            this._defaultMapOptions.geo.boundingCoords = this._getCenteredAndZoomedCoords();
            this.map.setOption(this._defaultMapOptions.geo);
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

            var data = this._getData();

            this.mapData = this._filterShapesWithoutData(this._getMapDataFromGeoJson(geoJson), data);
            this.baseMapData = this._getMapDataFromGeoJson(baseGeoJson);
            this.containerMapData = this._getMapDataFromGeoJson(containerGeoJson);
            echarts.registerMap('map', GeoJsonConverter.geoJsonListToGeoJson([this.containerMapData, this.baseMapData, this.mapData]));

            this._defaultMapOptions.series = [];
            switch (this.mapType) {
                case 'map':
                    var choroplethDataSerie = {
                        id: "choroplethDataSerie",
                        name: this.title,
                        type: 'map',
                        geoIndex: 0,
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

                    this._defaultMapOptions.series.push(choroplethDataSerie);
                    break;
            }

            this._defaultMapOptions.visualMap.pieces = this._generateDataClasses();
            this._defaultMapOptions.geo = {
                map: 'map',
                roam: 'move',
                nameProperty: 'code',
                boundingCoords: this._getCenteredAndZoomedCoords(),
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

            var self = this;
            this.map = echarts.init(this.el, null, { renderer: 'svg' });
            this.map.on('finished', function () {
                self._callback();
            });
            this.map.setOption(this._defaultMapOptions, true);
        },

        _getData: function () {
            var geographicDimension = this._filterDimensions.where({ type: "GEOGRAPHIC_DIMENSION" })[0];
            var self = this;
            return _.map(_.pairs(this._dataJson), function (item) {
                var dataNormCode = item[0];
                var dataValue = item[1].value;
                var geographicRepresentationId = geographicDimension.get("representations").where({ normCode: dataNormCode })[0].id;
                var currentPermutation = self._filterDimensions.models.reduce((dimensionsPermutation, filterDimension) => {
                    dimensionsPermutation[filterDimension.id] = (filterDimension.get("type") === "GEOGRAPHIC_DIMENSION")
                        ? geographicRepresentationId
                        : filterDimension.getDrawableRepresentations()[0].id;
                    return dimensionsPermutation;
                }, {});
                return {
                    value: dataValue,
                    name: dataNormCode,
                    tooltip: {
                        formatter: function () {
                            return self.tooltipDelegate._getLabelFromNormCode(dataNormCode) + ': ' + self._data.getStringData({ ids: currentPermutation });
                        }
                    }
                };
            });
        },

        _getMapDataFromGeoJson: function (geoJson) {
            geoJson.features = _.map(geoJson.features, function (item) {
                item.properties.code = item.id;
                return item;
            });
            return geoJson;
        },

        _updateDataClasses: function () {
            if (this.model.get('mapType') !== 'map' || !this.map) {
                return;
            }

            this._defaultMapOptions.visualMap.pieces = this._generateDataClasses();
            this.map.setOption({
                visualMap: {
                    pieces: this._defaultMapOptions.visualMap.pieces
                }
            });
        },

        _getCenteredAndZoomedCoords: function () {
            if (!this.boundingCoords) {
                this.boundingCoords = this._getMinMaxCoordinates(this.mapData);
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
                return _.contains(dataCodes, mapDataEntry.properties.code);
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
