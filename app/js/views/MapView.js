/**
 * Map view
 * @author agimenez
 */

 /**
  * @class MapView
  */
define(["jquery", "underscore","backbone", "leaflet",
"app/js/controls/CircleControl"],
function ($, _, Backbone, L, CircleControl) {

    var MapView = Backbone.View.extend({
        initialize: function(options) {
            Backbone.View.prototype.initialize.apply(this, arguments);
            this.zoomRange = options.zoomRange || [0, 17];
            this.lat = options.lat || -53;
            this.lon = options.lon || -25;
            this.zoom = options.zoom || 0;
            this.layer = options.api || "mapbox-default";
        },

        render: function() {
            this.map = L.mapbox.map(this.$el[0], this.layer, {
                minZoom: this.zoomRange[0],
                maxZoom: this.zoomRange[1],
                measureControl: true
            })
            .addControl(L.mapbox.legendControl())
            .addControl(
                L.control.measure({ 
                    position: "bottomright",
                    primaryLengthUnit: "meters", 
                    secondaryLengthUnit: "kilometers", 
                    primaryAreaUnit: "sqmeters",
                    activeColor: "#3c8dfd",
                    completedColor: "#3c8dfd"
                })
            )
            /*.addControl(L.mapbox.geocoderControl("mapbox.places", {
                autocomplete: true
            }))*/
            .addControl(new CircleControl())
            .setView([this.lat, this.lon], this.zoom);

            var searchControl = L.esri.Geocoding.geosearch({
                expanded: true, collapseAfterResult: false, zoomToResult: false,
                searchBounds: new L.latLngBounds(new L.LatLng(-27.586842, -62.650357), 
                                                 new L.LatLng(-19.286729, -54.245289)),
                useMapBounds: false, title: "Buscador de ubicacion", placeholder: "Busca lugares o direcciones"                                             
            }).addTo(this.map);
            var that = this;
            searchControl.on("results", function(data){ 
                if (data.results.length > 0) {
                    L.popup()
                        .setLatLng(data.results[0].latlng)
                        .setContent(data.results[0].text)
                        .openOn(that.map);
                    that.map.setView(data.results[0].latlng, 14);
                }
            });
            this.setBasemap("OpenStreetMap");
            return this;
        },

        setBasemap: function(basemap) {
            var layer = this.baseLayer || this.map.tileLayer;
            if (layer) {
                this.map.removeLayer(layer);
            } 
            layer = this.layerLabels;
            if (layer) {
                this.map.removeLayer(layer);
            } 
            if (basemap === "OpenStreetMap") {
                layer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");
                this.layerLabels = null;
            }
            else if (basemap === "Imagery") {
                layer  = L.esri.basemapLayer(basemap);
            }
            else {
                layer = L.mapbox.tileLayer(this.layer);
                this.layerLabels = null;
            }

            this.map.addLayer(layer);
            this.baseLayer = layer;

            if (basemap === "ShadedRelief" || basemap === "Oceans" || basemap === "Gray" || basemap === "DarkGray" || basemap === "Imagery" || basemap === "Terrain") {
                this.layerLabels = L.esri.basemapLayer(basemap + "Labels");
                this.map.addLayer(this.layerLabels);
            }
          }
    });
    return MapView;
});
