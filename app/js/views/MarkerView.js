/**
 * Marker view
 * @author agimenez
 */

 /**
  * @class MarkerView
  */
 define(["jquery", "underscore","backbone", "leaflet",
 "app/js/views/FilterView",
 "app/js/views/FilterOpView",
 "text!app/js/templates/popup.html"],
 function ($, _, Backbone, L, FilterView, FilterOpView, template) {
    var MakerView = Backbone.View.extend({
        template: _.template(template),
        circle: null,
        activeCircle: false,
        initialize: function(options) {
            Backbone.View.prototype.initialize.apply(this, arguments);
            this.api = options.api;
            this.map = options.map;
            this.circle = null;
            this.colors = {
                "AXN": "e20079",
                "BR": "fef766",
                "COR": "22409a",
                "CPA": "ee1f29",
                "CPG": "ee332a",
                "CPT": "09008b",
                "ECO": "008432",
                "FLP": "fb0201",
                "FRT": "214f99",
                "GSR": "fdd800",
                "HDN": "021235",
                "INT": "f5a603",
                "PUM": "007143",
                "PSR": "69bd44",
                "PMX": "d30613",
                "PCH": "466096",
                "PTBR": "81a83e",
                "PTN": "d82d2e",
                "TMG": "81a83e", 
                "NIN": "000000",
                "PURPLE": "B10DC9"
            };
        },
        render: function() {
            this.overlays = L.layerGroup().addTo(this.map);
            var that = this;
            var loader = $("#loader");
            loader.attr('class', '');
    
            var endLoading = function() {
                loader.attr('class','done');
                setTimeout(function() {
                    loader.attr('class', 'hide');
                }, 500);
            };

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
                    if (that.activeCircle) {
                        that.circle = L.circle(marker.getLatLng(), 1000).addTo(that.map);
                    }
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
                endLoading();
            });
        },
        setOperators: function(markers) {
            this.operators = _.sortBy(
                _.uniq(
                    _.map(markers, function(item) { 
                        return item.feature.properties.operador; 
                    })
                ), _.iteratee()
            );

            this.opFilterView = new FilterOpView({
                el: $("#operator"),
                operators: this.operators,
                markerView: this
            });
            this.opFilterView.render();
        },

        setDistributors: function(markers) {
            this.distributors = _.uniq(
                _.map(markers, function(item) { 
                    return item.feature.properties.distribuidor; 
                })
            );

            this.disFilterView = new FilterView({
                el: $("#distributor"),
                distributors: this.distributors,
                markerView: this
            });
            this.disFilterView.render();
        },

        filterMarkers: function(filtered, prop) {
            if (prop === "operador") {
                this.disFilterView.clear();
            }
            else if (prop === "distribuidor") {
                this.opFilterView.clear();
            }
            if (this.circle) {
                this.map.removeLayer(this.circle);
            }
            this.overlays.clearLayers();
            var clusterGroup = new L.MarkerClusterGroup().addTo(this.overlays);
            this.estaciones.eachLayer(function(layer) {
                if (filtered.length === 0 || filtered.indexOf(layer.feature.properties[prop]) !== -1) {
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
