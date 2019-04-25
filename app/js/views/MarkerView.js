/**
 * Marker view
 * @author agimenez
 */

 /**
  * @class MarkerView
  */
 define(["jquery", "underscore","backbone", "leaflet",
 "app/js/views/FilterView",
 "text!app/js/templates/popup.html"],
 function ($, _, Backbone, L, FilterView, template) {
    var MakerView = Backbone.View.extend({
        template: _.template(template),
        initialize: function(options) {
            Backbone.View.prototype.initialize.apply(this, arguments);
            this.api = options.api;
            this.map = options.map;
            this.circle = null;
            this.colors = {
                "INT": "f5a603",
                "PUM": "007143",
                "PSR": "69bd44",
                "PMX": "d30613",
                "PCH": "466096",
                "CPT": "09008b",
                "COR": "22409a",
                "TMG": "81a83e", 
                "CPG": "ee332a",
                "NIN": "000000",
                "PTBR": "81a83e",
                "BR": "fef766",
                "PURPLE": "B10DC9"
            };
        },
        render: function() {
            this.overlays = L.layerGroup().addTo(this.map);
            var self = this;
            L.mapbox.featureLayer()
            .loadURL(this.api + 'features/estaciones/')
            .on('ready', function(e) {
                var layers = e.target;

                self.overlays.clearLayers();
                
                var clusterGroup = new L.MarkerClusterGroup().addTo(self.overlays);
                
                layers.eachLayer(function(item) {
                    clusterGroup.addLayer(item);
                    var props = item.toGeoJSON().properties;
                    item.bindPopup(function() {
                        props["marker-url"] = STATIC_DIR + "img/emb/" + props["marker-icon"] + "_64.png";
                        return self.template({model: props});
                    });
                    item.setIcon(
                        L.mapbox.marker.icon({'marker-symbol': props["tipo"] === "Estación de Servicio" ? 'fuel' : 'bus', 
                        'marker-color': self.colors[props["marker-icon"] || "#fff"]})
                    );
                });

                layers.on('click', function(e) {
                    self.map.setView(e.layer.getLatLng(), 
                        _.max([14, self.map.getZoom()]), 
                        {inertia: true}
                    );
                    if (self.circle) {
                        self.map.removeLayer(self.circle);
                    }
                    self.circle = L.circle(e.layer.getLatLng(), 1000).addTo(self.map);
                });

                self.setOperators(layers.getLayers());
                self.setDistributors(layers.getLayers());
                self.markers = layers;
            });
        },
        setOperators: function(layers) {
            this.operators = [];
        },

        setDistributors: function(layers) {
            this.distributors = _.uniq(
                _.map(layers, function(item) { 
                    return item.toGeoJSON().properties["distribuidor"]; 
                })
            );

            var filterView = new FilterView({
                el: $("#distributor"),
                distributors: this.distributors,
                markerView: this
            });
            filterView.render();
        },

        filterMarkers: function(filters) {
            if (this.circle) {
                this.map.removeLayer(this.circle);
            }
            var list = [];
            for (var i = 0; i < filters.length; i++) {
                if (filters[i].checked) list.push(filters[i].value);
            }
            this.overlays.clearLayers();
            var clusterGroup = new L.MarkerClusterGroup().addTo(this.overlays);
            var self = this;
            this.markers.eachLayer(function(layer) {
                if (list.indexOf(layer.feature.properties.distribuidor) !== -1) {
                    clusterGroup.addLayer(layer);
                }
            });
            if (clusterGroup.getBounds().isValid()) {
                this.map.fitBounds(clusterGroup.getBounds());
            }
        }
    });
    return MakerView;
 });
