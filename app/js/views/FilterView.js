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
        template: _.template(" <div><input type='checkbox' name='filters' value='<%- key %>' checked><%- value %></div>"),
        initialize: function(options) {
            Backbone.View.prototype.initialize.apply(this, arguments);
            this.distributors = options.distributors;
            this.markerView = options.markerView;
        },

        render: function() {
            var self = this;
            _.each(this.distributors, function(item) {
                $(self.$el).append(self.template({key: item, value: item}));
            });
            return this;
        },

        filterStations: function(evt) {
            if ($(evt.target).val() == "Todos") {
                $("[name='filters']", this.$el).each(function(o,i){i.checked = evt.target.checked;});
            }
            else {
                $("#chkTodos", this.$el).checked = false;
            }
            this.markerView.filterMarkers(this.$el[0].filters);
        }
    });
    return FilterView;
});
