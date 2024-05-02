(function () {
    'use strict';

    var GeoJsonConverter = App.Map.GeoJsonConverter;
    var Constants = App.Constants;
    var DATA_SERIE_INDEX = 2;

    App.namespace('App.Map.MapView');

    App.Map.MapView = Backbone.View.extend({
        _defaultSeriesOptions: {
            mapData: null,
            joinBy: ['code', 'code'],
            data: null
        },

        // Esta fontFamily debe ser siempre equivalente a @istacFontFamilySansSerifFamily
        _defaultMapOptions: {
            chart: {
                className: 'map',
                animation: false
            },

            title: {
                text: '',
                floating: false,
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

            legend: {
                enabled: true,
                layout: 'horizontal',
                floating: false,
                // align: 'left', // don't use, bugged
                y: -5,
                x: 0,
                backgroundColor: Constants.colors.istacWhite,
                borderColor: Constants.colors.istacGreyMedium,
                borderWidth: 1,
                borderRadius: 5,
                shadow: true,
                itemStyle: {
                    "fontWeight": "normal",
                    "fontSize": "11px",

                },
                padding: 5,
                margin: 5,
                itemMarginTop: 3,
                itemMarginBottom: 3,
                itemDistance: 6
            },

            colorAxis: {
                minColor: Constants.colors.istacBlueWhite,
                maxColor: Constants.colors.istacBlueDark
            },

            plotOptions: {
                map: {
                    color: Constants.colors.istacYellow,
                    states: {
                        hover: {
                            color: Constants.colors.istacYellow
                        }
                    }
                },
                mapbubble: {
                    color: Constants.colors.istacYellow
                }
            },

            series: [],

            credits: {
                position: {
                    y: -5
                }
            },
            xAxis: {
                minRange: 0.01
            },
            yAxis: {
                minRange: 0.01
            },
            tooltip: {}
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
            this.mapType = options.mapType;
            this.title = options.title;
            this.rightsHolder = options.rightsHolder;
            this.showRightsHolder = options.showRightsHolder;

            this.tooltipDelegate = new App.Map.TooltipDelegate(options);

            this._onResize = _.debounce(_.bind(this._onResize, this), 200);
            this._updateDataClasses = _.debounce(_.bind(this._updateDataClasses, this), 100);

            this._defaultMapOptions.tooltip.formatter = _.partial(function (formatter, mapView) {
                return mapView.tooltipDelegate._getLabelFromNormCode(this.point.code) + ': ' + this.point.label;
            }, _, this);
            this._defaultMapOptions.chart.events = { load: options.callback, redraw: options.callback };

            this._defaultMapOptions.legend.labelFormatter = function () {
                return App.util.NumberFormatter.strNumberToLocalizedString(this.from.toString()) + ' - ' + App.util.NumberFormatter.strNumberToLocalizedString(this.to.toString());
            };
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
            var mapData = this._filterShapesWithoutData(this._getMapDataFromGeoJson(geoJson), data);
            
            // Posible bug detectado
            // Es necesario establecer 'hasDerivedData' a true puesto que si no, la variable 'keepPoints' del método 'update'
            // siempre será verdadero y 'data' y 'mapData' no se actualizarán correctamente
            // Issue creado: https://github.com/highcharts/highcharts/issues/11636
            this.map.series[DATA_SERIE_INDEX].hasDerivedData = true;

            this.map.series[DATA_SERIE_INDEX].update({data: data, mapData: mapData, name: this.title}, redraw);
        },

        render: function () {
            this._createMapContent();
            this.delegateEvents();
        },

        destroy: function () {
            if (this.map && this.map.renderTo) {
                this.map.destroy();
                this.map = null;
            }

            this.undelegateEvents();
        },

        transform: function () {
            var currentScale = this.model.get("currentScale");
            var oldScale = this.model.get("oldScale");
            this.map.mapZoom(oldScale / currentScale);
        },

        _tooltipFormatter: function () {
            return point.properties.label + ':::' + point.value;
        },

        zoomExit: function () {
            this._centerAndZoom();
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

            var mapData = this._filterShapesWithoutData(this._getMapDataFromGeoJson(geoJson), data);
            var baseMapData = this._getMapDataFromGeoJson(baseGeoJson);
            var containerMapData = this._getMapDataFromGeoJson(containerGeoJson);

            var worldContainerSerie = _.defaults(
                {
                    id: "worldContainerSerie",
                    name: "WorldContainer",
                    mapData: containerMapData,
                    nullColor: Constants.colors.istacGreyLight
                },
                this._defaultSeriesOptions);

            var featuresContainerSerie = _.defaults(
                {
                    id: "featuresContainerSerie",
                    name: "FeaturesContainer",
                    mapData: baseMapData,
                    nullColor: Constants.colors.istacGreyMedium
                },
                this._defaultSeriesOptions);

            this._defaultMapOptions.series = [];
            this._defaultMapOptions.series.push(
                worldContainerSerie,
                featuresContainerSerie
            );

            switch (this.mapType) {
                case 'map':
                    var choroplethDataSerie = _.defaults(
                        {
                            id: "choroplethDataSerie",
                            name: this.title,
                            mapData: mapData,
                            data: data
                        },
                        this._defaultSeriesOptions);

                    this._defaultMapOptions.legend.enabled = true;

                    this._defaultMapOptions.series.push(choroplethDataSerie);
                    break;

                case 'mapbubble':
                    var bubbleDataSerie = _.defaults(
                        {
                            id: "bubbleDataSerie",
                            name: this.title,
                            mapData: mapData,
                            data: data,
                            type: 'mapbubble',
                            showInLegend: false
                        },
                        this._defaultSeriesOptions);

                    this._defaultMapOptions.legend.enabled = false;

                    this._defaultMapOptions.series.push(bubbleDataSerie);
                    break;
            }

            this._defaultMapOptions.chart.renderTo = this.el;
            this._defaultMapOptions.colorAxis.dataClasses = this._generateDataClasses();

            this._defaultMapOptions.credits.text = this.rightsHolder;
            if (!this.showRightsHolder) {
                this._defaultMapOptions.credits.style = {
                    color: App.Constants.colors.hiddenText
                }
            }

            this.map = new Highmaps.Map(this._defaultMapOptions);

            this._centerAndZoom();
        },

        _getData: function () {
            var geographicDimension = this._filterDimensions.where({ type: "GEOGRAPHIC_DIMENSION" })[0];
            var self = this;
            return _.map(_.pairs(this._dataJson), function (item) {
                var geographicRepresentationId = geographicDimension.get("representations").where({ normCode: item[0] })[0].id;
                var currentPermutation = self._filterDimensions.models.reduce((dimensionsPermutation, filterDimension) => {
                    dimensionsPermutation[filterDimension.id] = (filterDimension.get("type") === "GEOGRAPHIC_DIMENSION")
                        ? geographicRepresentationId
                        : filterDimension.getDrawableRepresentations()[0].id;
                    return dimensionsPermutation;
                }, {});
                return { "code": item[0], "value": item[1].value, "z": item[1].value, "label": self._data.getStringData({ ids: currentPermutation })};
            });
        },

        _getMapDataFromGeoJson: function (geoJson) {
            var self = this;
            var features = _.map(geoJson.features, function (item) {
                item.properties.code = item.id;
                return item;
            });
            geoJson.features = features;
            return Highmaps.geojson(geoJson);
        },

        _updateDataClasses: function () {
            if (this.model.get('mapType') !== 'map' || !this.map) {
                return;
            }

            var axis = this.map.colorAxis[0];
            axis.update({ dataClasses: this._generateDataClasses() });
        },

        _centerAndZoom: function () {
            if (this.map && this.map.get('featuresContainerSerie')) {
                var featuresContainerSerie = this.map.get('featuresContainerSerie');
                if (featuresContainerSerie.maxX
                    && featuresContainerSerie.maxY
                    && featuresContainerSerie.minX
                    && featuresContainerSerie.minY) {
                    // featuresContainerSerie.points[0].zoomTo();
                    // this.map.redraw();

                    this._zoomToSerie(this.map.get('featuresContainerSerie'));
                }
            }
        },

        _zoomToSerie: function (serie) {
            // IDEA: Eliminate magic number
            serie.xAxis.setExtremes(
                serie.minX - 0.5,
                serie.maxX + 0.5,
                false
            );
            serie.yAxis.setExtremes(
                serie.minY - 0.5,
                serie.maxY + 0.5,
                false
            );
            this.map.redraw();
        },

        _generateDataClasses: function () {
            var dataClasses = [];
            var rangeLimits = this.model.createRangeLimits();
            for (var i = 0; i < rangeLimits.length - 1; i++) {
                dataClasses[i] = { from: rangeLimits[i], to: rangeLimits[i + 1] };
            }
            return dataClasses;
        },

        _redrawLegend: function () {
            this.map.legend.destroy();
            this.map.legend.render();
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
            this.map.reflow();
        },

        _filterShapesWithoutData: function (mapData, data) {
            var dataCodes = _.pluck(data, 'code');
            return _.filter(mapData, function (mapDataEntry) {
                return _.contains(dataCodes, mapDataEntry.properties.code);
            });
        }
    });

}());
