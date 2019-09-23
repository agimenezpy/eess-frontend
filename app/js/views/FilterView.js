/**
 * Filter view
 * @author agimenez
 */

 /**
  * @class FilterView
  */
define(["jquery", "underscore","backbone"],
function ($, _, Backbone) {

    var FilterView = Backbone.View.extend({
        events: {
            "click input": "filterStations"
        },
        template: _.template("<option><%- value %></option>"),
        initialize: function(options) {
            Backbone.View.prototype.initialize.apply(this, arguments);
            this.distributors = options.distributors;
            this.markerView = options.markerView;
        },

        render: function() {
            var that = this;
            _.each(this.distributors, function(item) {
                $(that.$el).append(that.template({key: item, value: item}));
            });
            $(that.$el).select2({
                placeholder: "Seleccione un distribuidor",
                allowClear: true,
                multiple: true,
                width: "style"
            }).val(null).trigger("change")
            .on("select2:select", _.bind(that.filterStations, that))
            .on("select2:clear", _.bind(that.filterStations, that));
            this.filtered = [];
            return this;
        },

        filterStations: function(evt) {
            if (evt.params._type === "clear") {
                this.filtered = [];
            }
            else {
                this.filtered.push(evt.params.data.text);
            }
            this.markerView.filterMarkers(this.filtered, "distribuidor");
        },
        clear: function(evt) {
            this.filtered = [];
            $(this.$el).val(null).trigger("change");
        }
    });
    return FilterView;
});
