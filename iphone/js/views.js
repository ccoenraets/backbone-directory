window.SearchPage = Backbone.View.extend({

    initialize:function () {
        this.template = _.template(tpl.get('search-page'));
    },

    render:function (eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        this.listView = new EmployeeListView({el: $('ul', this.el), model: this.model});
        this.listView.render();
        return this;
    },

    events:{
        "keyup .search-key":"search"
    },

    search:function (event) {
        var key = $('.search-key').val();
        this.model.findByName(key);
    }
});

window.DirectReportPage = Backbone.View.extend({

    initialize:function () {
        this.template = _.template(tpl.get('report-page'));
    },

    render:function (eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        this.listView = new EmployeeListView({el: $('ul', this.el), model: this.model});
        this.listView.render();
        return this;
    }

});

window.EmployeeListView = Backbone.View.extend({

    initialize:function () {
        this.model.bind("reset", this.render, this);
    },

    render:function (eventName) {
        $(this.el).empty();
        _.each(this.model.models, function (employee) {
            console.log('rendering ' + employee);
            $(this.el).append(new EmployeeListItemView({model:employee}).render().el);
        }, this);
        return this;
    }

});

window.EmployeeListItemView = Backbone.View.extend({

    tagName:"li",

    initialize:function () {
        this.template = _.template(tpl.get('employee-list-item'));
    },

    render:function (eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }

});

window.EmployeePage = Backbone.View.extend({

    initialize:function () {
        this.template = _.template(tpl.get('employee-page'));
    },

    render:function (eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }

});