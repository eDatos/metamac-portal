(function () {
    'use strict';

    App.namespace('App.Map.GeoJsonConverter');

    App.Map.GeoJsonConverter = {

        shapeListToGeoJson : function (shapeList, extraProperties) {
            return {
                type: "FeatureCollection",
                features: _.chain(shapeList)
                    .compact()
                    .map(function (item) {
                        var feature = {
                            type : 'Feature',
                            id : item.normCode,
                            properties : {
                                geographicalGranularity : item.granularity
                            },
                            geometry : {
                                type : item.geometryType,
                                coordinates : item.shape
                            }
                        };

                        if (extraProperties) {
                            _.extend(feature.properties, extraProperties);
                        }
                        return feature;
                    })
                    .value()
            };
        },
        
        geoJsonListToGeoJson: function (geoJsonList) {
            return {
                type: "FeatureCollection",
                features: geoJsonList.flatMap(function (geoJson) {
                    return geoJson.features;
                })
            };
        },

        featureHasGeometry : function (feature) {
            return !_.isUndefined(feature.geometry)
        },

        featureToShapeList : function (feature) {
            return {
                normCode : feature.id,
                geometryType : feature.geometry.type,
                shape : feature.geometry.coordinates,
                granularity : feature.properties.geographicalGranularity
            };
        },

        geoJsonToShapeList : function (geoJson) {
            return _.chain(geoJson.features)
                .filter(this.featureHasGeometry)
                .map(this.featureToShapeList, this)
                .value();
        }
    };


}());
