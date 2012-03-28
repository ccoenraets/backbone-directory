window.Employee = Backbone.Model.extend({

    initialize:function () {
        this.reports = new EmployeeCollection();
        this.reports.managerId = this.id;
    }

});

window.EmployeeCollection = Backbone.Collection.extend({

    model:Employee,

    findByName:function (key) {
        this.reset(store.findByName(key));
    }

});