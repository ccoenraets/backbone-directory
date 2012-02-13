window.EmployeeFullView = Backbone.View.extend({

    tagName:"div", // Not required since 'div' is the default if no el or tagName specified

    initialize:function () {
        this.template = _.template(tpl.get('employee-full'));
    },

    render:function (eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        $('#details', this.el).html(new EmployeeView({model:this.model}).render().el);
        this.model.reports.fetch({
            success:function (data) {
                if (data.length == 0)
                    $('.no-reports').show();
            }
        });
        $('#reports', this.el).append(new EmployeeListView({model:this.model.reports}).render().el);
        return this;
    }
});


window.EmployeeView = Backbone.View.extend({

    tagName:"div", // Not required since 'div' is the default if no el or tagName specified

    initialize:function () {
        this.template = _.template(tpl.get('employee-details'));
        this.model.bind("change", this.render, this);
    },

    render:function (eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }

});