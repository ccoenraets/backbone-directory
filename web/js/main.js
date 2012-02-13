var AppRouter = Backbone.Router.extend({

    routes:{
        "":"home",
        "contact":"contact",
        "employees/:id":"employeeDetails"
    },

    initialize:function () {
        this.headerView = new HeaderView();
        $('.header').html(this.headerView.render().el);

        // Close the search dropdown on click anywhere in the UI
        $('body').click(function () {
            $('.dropdown').removeClass("open");
        });
    },

    home:function () {
        // Since the home view never changes, we instantiate it and render it only once
        if (!this.homeView) {
            this.homeView = new HomeView();
            this.homeView.render();
        }
        $('#content').html(this.homeView.el);
    },

    contact:function () {
        if (!this.contactView) {
            this.contactView = new ContactView();
            this.contactView.render();
        }
        $('#content').html(this.contactView.el);
    },

    employeeDetails:function (id) {
        var employee = new Employee({id:id});
        employee.fetch({
            success:function (data) {
                // Note that we could also 'recycle' the same instance of EmployeeFullView
                // instead of creating new instances
                $('#content').html(new EmployeeFullView({model:data}).render().el);
            }
        });
    }

});

tpl.loadTemplates(['home', 'contact', 'header', 'employee-full', 'employee-details', 'employee-list-item'],
    function () {
        app = new AppRouter();
        Backbone.history.start();
    });