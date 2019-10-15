/**
 * Directions Filter view
 * @author agimenez
 */

 /**
  * @class FilterView
  */
define(["jquery", "underscore", "backbone"],
function ($, _, Backbone) {

    var FilterView = Backbone.View.extend({
        initialize: function(options) {
            Backbone.View.prototype.initialize.apply(this, arguments);
            this.directions = options.directions;
            this.markerView = options.markerView;
        },

        render: function() {
            var that = this;
            $(this.$el).empty()
                .select2({placeholder: "Busque una direccion",
                    allowClear: true,
                    width: "style",
                    data: this.directions
                }).val(null).trigger("change");
            $(this.$el).on("select2:select", _.bind(that.filterStations, that))
                       .on("select2:clear", _.bind(that.filterStations, that));
            return this;
        },

        filterStations: function(evt) {
            var val = [];
            if (evt.params._type !== "clear") {
                val = [evt.params.data.text];
            }

            this.markerView.filterMarkers(val, "direccion");
        },

        clear: function(evt) {
            $(this.$el).val(null).trigger("change");
        }
    });
    return FilterView;
});
