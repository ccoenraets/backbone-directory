window.EmployeeView = Backbone.View.extend({

    tagName:"div", // Not required since 'div' is the default if no el or tagName specified

    initialize:function () {
//        this.template = templates['Employee'];
    },

    render: function () {
        $(this.el).html(this.template(this.model.toJSON()));
        $('#details', this.el).html(new EmployeeSummaryView({model:this.model}).render().el);
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

window.EmployeeSummaryView = Backbone.View.extend({

    tagName:"div", // Not required since 'div' is the default if no el or tagName specified

    initialize:function () {
//        this.template = templates['EmployeeSummary'];
        this.model.bind("change", this.render, this);
    },

    render:function () {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }

});