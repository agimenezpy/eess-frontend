/**
 * Operators Filter view
 * @author agimenez
 */

 /**
  * @class FilterView
  */
define(["jquery", "underscore","backbone"],
function ($, _, Backbone) {

    var FilterView = Backbone.View.extend({
        template: _.template("<option><%- value %></option>"),
        initialize: function(options) {
            Backbone.View.prototype.initialize.apply(this, arguments);
            this.operators = options.operators;
            this.markerView = options.markerView;
        },

        render: function() {
            var that = this;
            _.each(this.operators, function(item) {
                $(that.$el).append(that.template({value: item}));
            });
            $(that.$el).select2({
                placeholder: "Seleccione un operador",
                allowClear: true,
                width: "style"
            }).val(null).trigger("change")
            .on("select2:select", _.bind(that.filterStations, that))
            .on("select2:clear", _.bind(that.filterStations, that));
            return this;
        },

        filterStations: function(evt) {
            var val = [];
            if (evt.params._type !== "clear") {
                val = [evt.params.data.text];
            }

            this.markerView.filterMarkers(val, "operador");
        },

        clear: function(evt) {
            $(this.$el).val(null).trigger("change");
        }
    });
    return FilterView;
});
