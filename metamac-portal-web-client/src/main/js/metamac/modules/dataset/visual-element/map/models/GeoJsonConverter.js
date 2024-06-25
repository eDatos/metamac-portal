(function () {
    'use strict';

    App.namespace('App.Map.GeoJsonConverter');

    App.Map.GeoJsonConverter = {

        shapeListToGeoJson : function (shapeList, extraProperties) {

            var result = {
                type : "FeatureCollection"
            };

            result.features = _.chain(shapeList)
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
                .value();

            return result;
        },
        
        geoJsonListToGeoJson: function (geoJsonList) {
            var result = {
                type : "FeatureCollection"
            };

            result.features = geoJsonList.flatMap(function (geoJson) { return geoJson.features; });
            return result;
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
        },

        _hierarchyByNormCode : function (normCode) {
            var hierarchy = -1;
            if (normCode) {
                var hierarchies = ["WORLD", "CONTINENT", "COUNTRY", "ADM-LEVEL-1", "ADM-LEVEL-2", "ISLAND", "ADM-LEVEL-3"];
                var hierarchyCode = normCode.substring(normCode.lastIndexOf("_") + 1);
                hierarchy = _.indexOf(hierarchies, hierarchyCode);
            }
            return hierarchy;
        }

    };


}());
