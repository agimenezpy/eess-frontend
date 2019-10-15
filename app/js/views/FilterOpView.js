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
            this.setData();
            $(this.$el).on("select2:select", _.bind(that.filterStations, that))
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
        },

        getOpData: function(values) {
            var ops = _.chain(this.operators);

            if (!_.isUndefined(values) && values.length !== 0) {
                ops = ops.pick(function(item, key) {
                    return values.indexOf(key) !== -1;
                });
            }
            return ops.map(function(items, key){
                        return {
                            text: key, 
                            children: _.chain(items)
                                .map(function(item) {
                                    return {id: _.uniqueId(), text: item.operador};
                                })
                                .sortBy("text")
                                .value()
                        }
                    })
                    .sortBy("text")
                    .value();
        },

        setData: function(filters) {
            var data = this.getOpData(filters);

            $(this.$el).empty()
                .select2({placeholder: "Seleccione un operador",
                    allowClear: true,
                    width: "style",
                    data: data
                }).val(null).trigger("change");
        }
    });
    return FilterView;
});
