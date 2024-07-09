describe("MapView", function () {

	// TODO: This test is not being currently called anywhere, and with the change to Highmaps (and after that, to eCharts), probably it won´t be necessary either
    var model = new App.Map.MapModel();
    model.attributes = {
        minScale : 1,
        maxScale : 32,
        scaleFactor : 2,
        currentScale : 1,
        x : 0,
        y : 0,
        animationDelay : 0,
        /* Leyend */
        minValue : 0,
        maxValue : 40,
        minRangesNum : 1,
        maxRangesNum : 10,
        currentRangesNum : 5
    };

    /*NOTE: Using balearsJson (stored in /spec/data)*/
    var eivissaBounds = [
        [1.188226, 38.813712],
        [1.650424, 39.118286]
    ];

    var shapeList = App.Map.GeoJsonConverter.geoJsonToShapeList(balearsJson);
    var mapView = new App.Map.MapView({model : model, width : 1, height : 1, shapeList : shapeList, dataJson : {}});

    mapView._width = 722;
    mapView._height = 500;
    mapView._origin = [2.7580530000000003, 39.367515]; //Eivissa center
    mapView._scale = 17033.98510779658; //Eivissa scale

    mapView._projection = d3.geo.albers()
        .origin(mapView._origin)
        .scale(mapView._scale)
        .translate([0, 0]);

    it("calculateNewOriginAndBounds - Should calculate the new origin coordinates, and the max and min X and Y coordinates", function () {
        var origin = mapView._calculateNewOriginAndBounds();
        /* Max and Mins */
        expect(mapView._maxX).toBe(4.32788);
        expect(mapView._maxY).toBe(40.094568);
        expect(mapView._minX).toBe(1.188226);
        expect(mapView._minY).toBe(38.640462);
        /* Origin (center) */
        expect(origin[0]).toBe(2.7580530000000003);
        expect(origin[1]).toBe(39.367515);
    });

    it("calculateNewScale - Should calculate the biggest scale that keeps the whole map visible", function () {
        var scale = mapView._calculateNewScale({x : 1.188226, y : 38.640462}, {x : 0, y : 0}, [2.7580530000000003, 39.367515]);
        expect(scale).toBe(7406.080481650681);
    });

    it("newCenterOffset - Calculates the offset that must be applied center the map in the center of a figure", function () {
        var offset = mapView._newCenterOffset(eivissaBounds);
        expect(offset).toEqual([306.483509981404, -118.35629816577512]);
    });

    it("newScaleCenteredInObject - Calculates the new scale to center the view in certain object", function () {
        var newScaleFactor = mapView._newScaleCenteredInObject(eivissaBounds);
        expect(newScaleFactor).toBe(2);
    });

    describe("canRender", function () {
        it("should return false if has has shapes to render", function () {
            var mapView = new App.Map.MapView({model : model, width : 1, height : 1, shapeList : [undefined, undefined] });
            expect(mapView.canRender()).toBeFalsy();
        });

        it("should return true if has shapes to render", function () {
            var mapView = new App.Map.MapView({model : model, width : 1, height : 1, shapeList : shapeList });
            expect(mapView.canRender()).toBeTruthy();
        });
    });

    mapView.destroy();
});
