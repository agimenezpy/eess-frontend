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
            var that = this;
            L.mapbox.featureLayer()
            .loadURL(this.api + "features/estaciones/")
            .on("ready", function(e) {
                var estaciones = e.target;

                that.overlays.clearLayers();
                
                var clusterGroup = new L.MarkerClusterGroup();
                
                estaciones.eachLayer(function(item) {
                    clusterGroup.addLayer(item);
                    var props = item.feature.properties;
                    item.bindPopup(function() {
                        props["marker-url"] = STATIC_DIR + "img/emb/" + props["marker-icon"] + "_64.png";
                        return that.template({model: props});
                    });
                    item.setIcon(
                        L.mapbox.marker.icon({
                            "marker-symbol": props.tipo === "Estación de Servicio" ? "fuel" : "bus", 
                            "marker-color": that.colors[props["marker-icon"] || "#fff"]
                        })
                    );
                });

                estaciones.on("click", function(estacion) {
                    var marker = estacion.layer;
                    that.map.setView(marker.getLatLng(), 
                        _.max([14, that.map.getZoom()]), 
                        {inertia: true}
                    );
                    if (that.circle) {
                        that.map.removeLayer(that.circle);
                    }
                    that.circle = L.circle(marker.getLatLng(), 1000).addTo(that.map);
                });

                that.map.on("click", function(e) {
                    if (that.circle) {
                        that.map.removeLayer(that.circle);
                        that.circle = null;
                    }
                });

                clusterGroup.addTo(that.overlays);

                that.setOperators(estaciones.getLayers());
                that.setDistributors(estaciones.getLayers());
                that.estaciones = estaciones;
            });
        },
        setOperators: function(markers) {
            this.operators = [];
        },

        setDistributors: function(markers) {
            this.distributors = _.uniq(
                _.map(markers, function(item) { 
                    return item.feature.properties.distribuidor; 
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
            var filtered = [];
            for (var i = 0; i < filters.length; i++) {
                if (filters[i].checked) {
                    filtered.push(filters[i].value);
                }
            }
            this.overlays.clearLayers();
            var clusterGroup = new L.MarkerClusterGroup().addTo(this.overlays);
            this.estaciones.eachLayer(function(layer) {
                if (filtered.indexOf(layer.feature.properties.distribuidor) !== -1) {
                    clusterGroup.addLayer(layer);
                }
            });
            if (clusterGroup.getBounds().isValid()) {
                this.map.fitBounds(clusterGroup.getBounds());
            }
            clusterGroup.addTo(this.overlays);
        }
    });
    return MakerView;
 });
