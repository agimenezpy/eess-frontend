/**
 * Distributors Legend view
 * @author agimenez
 */

 /**
  * @class LegendView
  */
define(["jquery", "underscore","backbone"],
function ($, _, Backbone) {
    var LegendView = Backbone.View.extend({
        template: _.template("<div style='background: url(<%- icon %>) no-repeat; height: 40px; padding-left: 35px'><%- value %></div>"),
        initialize: function(options) {
            Backbone.View.prototype.initialize.apply(this, arguments);
            this.distributors = options.distributors;
        },
        render: function() {
            var that = this;
            _.each(this.distributors, function(item) {
                $(that.$el).append(that.template({icon: item.icon, value: item.value}));
            });
            return this;
        }
    });
    return LegendView;
});
