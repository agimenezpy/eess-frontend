"use strict";

define(["jquery", "leaflet"], function($, L) {
	return L.Control.extend({
		active: false,
		circle: null,
		options: {
			position: 'bottomleft',
			latitudeText: 'lat.',
			longitudeText: 'lon.',
			promptText: 'Haga click en el mapa para dibujar un circulo',
			precision: 4
		},

		initialize: function(options)
		{
			L.Control.prototype.initialize.call(this, options);
		},

		onAdd: function(map)
		{
			var className = 'leaflet-control-circle',
				that = this,
				container = this._container = L.DomUtil.create('div', className);
			this.visible = false;
			$(container).attr({"title":  this.options.promptText }); 

			L.DomEvent.disableClickPropagation(container);

			map.on('click', function(e) {
				that.setCircle(e, map);
			});

			L.DomEvent.addListener(container, 'click', function() {
				if (that.circle) {
					map.removeLayer(that.circle);
				}
				if (!that.active) {
					that.active = true;
					L.DomUtil.addClass(container, 'active');
				}
				else {
					that.active = false;
					L.DomUtil.removeClass(container, 'active');
				}
			}, this);

			return container;
		},
		setCircle: function(obj, map)
		{
			if (!this.active) {
				return;
			}
			if (this.circle) {
				map.removeLayer(this.circle);
			}
			this.circle = L.circle(obj.latlng, 1000, {color: 'orange'}).addTo(map);
		}
	})
});