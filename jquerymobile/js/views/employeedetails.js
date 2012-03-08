window.EmployeeView = Backbone.View.extend({

    initialize:function () {
        this.template = _.template(tpl.get('employee-details'));
    },

    render:function (eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }

});