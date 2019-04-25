define(["jquery", "underscore", 
        "app/js/views/MapView",
        "app/js/views/MarkerView"],
    function($, _, MapView, MarkerView) {
        var App = function() {
            var mapView = new MapView({
                el: $("#map"),
                api: "agimenez.map-eb2q2546",
                lat: -25.2888,
                lon: -57.5029,
                zoom: 12,
                zoomRange: [7, 18]
            });
            mapView.render();

            var markerView = new MarkerView({
                api: "/",
                map: mapView.map
            });
            markerView.render();

           $("#selectStandardBasemap").on("change", function(e) {
                mapView.setBasemap($(this).val());
            });

        };

        return App;
    }
);