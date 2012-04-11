"use strict";

// Creating the application namespace
var directory = {
    models: {},
    views: {},
    utils: {}
};

// -------------------------------------------------- Utilities ---------------------------------------------------- //

// The Template Loader. Used to asynchronously load templates located in separate .html files
directory.utils.templateLoader = {

    templates: {},

    load: function(names, callback) {

        var deferreds = [],
            self = this;

        $.each(names, function(index, name) {
            deferreds.push($.get('tpl/' + name + '.html', function(data) {
                self.templates[name] = data;
            }));
        });

        $.when.apply(null, deferreds).done(callback);
    },

    // Get template by name from hash of preloaded templates
    get: function(name) {
        return this.templates[name];
    }

};

// The in-memory Store. Encapsulates logic to access employee data.
directory.utils.store = {

    employees: {},

    populate: function() {
        this.employees[1] = {id: 1, firstName: 'Ryan', lastName: 'Howard', title: 'Vice President, North East', managerId: null, managerName: null, city: 'New York, NY', officePhone: '212-999-8888', cellPhone: '212-999-8887', email: 'ryan@dundermifflin.com', reportCount: 2};
        this.employees[2] = {id: 2, firstName: 'Michael', lastName: 'Scott', title: 'Regional Manager', managerId: 1, managerName: 'Ryan Howard', city: 'Scranton, PA', officePhone: '570-888-9999', cellPhone: '570-222-3333', email: 'michael@dundermifflin.com', reportCount: 7};
        this.employees[3] = {id: 3, firstName: 'Dwight', lastName: 'Schrute', title: 'Assistant Regional Manager', managerId: 2, managerName: 'Michael Scott', city: 'Scranton, PA', officePhone: '570-444-4444', cellPhone: '570-333-3333', email: 'dwight@dundermifflin.com', reportCount: 0};
        this.employees[4] = {id: 4, firstName: 'Jim', lastName: 'Halpert', title: 'Assistant Regional Manager', managerId: 2, managerName: 'Michael Scott', city: 'Scranton, PA', officePhone: '570-222-2121', cellPhone: '570-999-1212', email: 'jim@dundermifflin.com', reportCount: 1};
        this.employees[5] = {id: 5, firstName: 'Pamela', lastName: 'Beesly', title: 'Receptionist',managerId: 2, managerName: 'Michael Scott', city: 'Scranton, PA', officePhone: '570-999-5555', cellPhone: '570-999-7474', email: 'pam@dundermifflin.com', reportCount: 0};
        this.employees[6] = {id: 6, firstName: 'Angela', lastName: 'Martin', title: 'Senior Accountant',managerId: 2, managerName: 'Michael Scott', city: 'Scranton, PA', officePhone: '570-555-9696', cellPhone: '570-999-3232', email: 'angela@dundermifflin.com', reportCount: 2};
        this.employees[7] = {id: 7, firstName: 'Kevin', lastName: 'Malone', title: 'Accountant',managerId: 6, managerName: 'Angela Martin', city: 'Scranton, PA', officePhone: '570-777-9696', cellPhone: '570-111-2525', email: 'kmalone@dundermifflin.com', reportCount: 0};
        this.employees[8] = {id: 8, firstName: 'Oscar', lastName: 'Martinez', title: 'Accountant',managerId: 6, managerName: 'Angela Martin', city: 'Scranton, PA', officePhone: '570-321-9999', cellPhone: '570-585-3333', email: 'oscar@dundermifflin.com', reportCount: 0};
        this.employees[9] = {id: 9, firstName: 'Creed', lastName: 'Bratton', title: 'Quality Assurance', managerId: 2, managerName: 'Michael Scott', city: 'Scranton, PA', officePhone: '570-222-6666', cellPhone: '333-8585', email: 'creed@dundermifflin.com', reportCount: 0};
        this.employees[10] = {id: 10, firstName: 'Andy', lastName: 'Bernard', title: 'Sales Director', managerId: 4, managerName: 'Jim Halpert', city: 'Scranton, PA', officePhone: '570-555-0000', cellPhone: '570-546-9999',email: 'andy@dundermifflin.com', reportCount: 2};
        this.employees[11] = {id: 11, firstName: 'Phyllis', lastName: 'Lapin', title: 'Sales Representative', managerId: 10, managerName: 'Andy Bernard', city: 'Scranton, PA', officePhone: '570-141-3333', cellPhone: '570-888-6666', email: 'phyllis@dundermifflin.com', reportCount: 0};
        this.employees[12] = {id: 12, firstName: 'Stanley', lastName: 'Hudson', title: 'Sales Representative', managerId: 10, managerName: 'Andy Bernard', city: 'Scranton, PA', officePhone: '570-700-6666', cellPhone: '570-777-6666', email: 'shudson@dundermifflin.com', reportCount: 0};
        this.employees[13] = {id: 13, firstName: 'Meredith', lastName: 'Palmer', title: 'Supplier Relations', managerId: 2, managerName: 'Michael Scott', city: 'Scranton, PA', officePhone: '570-555-8888', cellPhone: '570-777-2222', email: 'meredith@dundermifflin.com', reportCount: 0};
        this.employees[14] = {id: 14, firstName: 'Kelly', lastName: 'Kapoor', title: 'Customer Service Rep.', managerId: 2, managerName: 'Michael Scott', city: 'Scranton, PA', officePhone: '570-123-9654', cellPhone: '570-125-3666', email: 'kelly@dundermifflin.com', reportCount: 0};
        this.employees[15] = {id: 15, firstName: 'Toby', lastName: 'Flenderson', title: 'Human Resources', managerId: 1, managerName: 'Ryan Howard', city: 'Scranton, PA', officePhone: '570-485-8554', cellPhone: '570-996-5577', email: 'tflenderson@dundermifflin.com', reportCount: 0};
    },

    findById: function(id) {
        return this.employees[id];
    },

    findAll: function() {
        return this.employees;
    },

    findByName: function(key) {
        var results = [];
        for (var id in this.employees) {
            if ( (this.employees[id].firstName + " " + this.employees[id].lastName).toLowerCase().indexOf(key.toLowerCase()) >= 0) {
                results.push(this.employees[id]);
            }
        }
        return results;
    },

    findByManager: function(managerId) {
        var results = [];
        for (var id in this.employees) {
            if (this.employees[id].managerId === managerId) {
                results.push(this.employees[id]);
            }
        }
        return results;
    }

};

// Overriding Backbone's sync method. Replace the default RESTful services-based implementation
// with a simple local database approach.
Backbone.sync = function(method, model, options) {

    var store = directory.utils.store;

    if (method === "read") {
        if (model.id) {
            // Request to read a single item identified by its id.
            options.success(store.findById(model.id));
        } else if (model.managerId) {
            // Request to read a collection of employees identified by the manager they work for.
            options.success(store.findByManager(model.managerId));
        } else {
            // Request to read a collection of all employees.
            options.success(store.findAll());
        }
    }

};

// -------------------------------------------------- The Models ---------------------------------------------------- //

// The Employee Model
directory.models.Employee = Backbone.Model.extend({

    initialize: function() {
        this.reports = new directory.models.EmployeeCollection();
        this.reports.managerId = this.id;
    }

});

// The EmployeeCollection Model
directory.models.EmployeeCollection = Backbone.Collection.extend({

    model: directory.models.Employee,

    store: directory.utils.store,

    findByName: function(key) {
        this.reset(this.store.findByName(key));
    }

});


// -------------------------------------------------- The Views ---------------------------------------------------- //

directory.views.SearchPage = Backbone.View.extend({

    initialize: function() {
        this.template = _.template(directory.utils.templateLoader.get('search-page'));
    },

    render: function(eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        this.listView = new directory.views.EmployeeListView({el: $('ul', this.el), model: this.model});
        this.listView.render();
        return this;
    },

    events: {
        "keyup .search-key": "search"
    },

    search: function(event) {
        var key = $('.search-key').val();
        this.model.findByName(key);
    }
});

directory.views.DirectReportPage = Backbone.View.extend({

    initialize: function() {
        this.template = _.template(directory.utils.templateLoader.get('report-page'));
    },

    render: function(eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        this.listView = new directory.views.EmployeeListView({el: $('ul', this.el), model: this.model});
        this.listView.render();
        return this;
    }

});

directory.views.EmployeeListView = Backbone.View.extend({

    initialize: function() {
        this.model.bind("reset", this.render, this);
    },

    render: function(eventName) {
        $(this.el).empty();
        _.each(this.model.models, function(employee) {
            $(this.el).append(new directory.views.EmployeeListItemView({model: employee}).render().el);
        }, this);
        return this;
    }

});

directory.views.EmployeeListItemView = Backbone.View.extend({

    tagName: "li",

    initialize: function() {
        this.template = _.template(directory.utils.templateLoader.get('employee-list-item'));
    },

    render: function(eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }

});

directory.views.EmployeePage = Backbone.View.extend({

    initialize: function() {
        this.template = _.template(directory.utils.templateLoader.get('employee-page'));
    },

    render: function(eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }

});

// ----------------------------------------------- The Application Router ------------------------------------------ //

directory.Router = Backbone.Router.extend({

    routes: {
        "": "list",
        "list": "list",
        "employees/:id": "employeeDetails",
        "employees/:id/reports": "directReports"
    },

    initialize: function() {

        var self = this;

        // Keep track of the history of pages (we only store the page URL). Used to identify the direction
        // (left or right) of the sliding transition between pages.
        this.pageHistory = [];

        // Register event listener for back button troughout the app
        $('#content').on('click', '.header-back-button', function(event) {
            window.history.back();
            return false;
        });

        // Check of browser supports touch events...
        if (document.documentElement.hasOwnProperty('ontouchstart')) {
            // ... if yes: register touch event listener to change the "selected" state of the item
            $('#content').on('touchstart', 'a', function(event) {
                self.selectItem(event);
            });
            $('#content').on('touchend', 'a', function(event) {
                self.deselectItem(event);
            });
        } else {
            // ... if not: register mouse events instead
            $('#content').on('mousedown', 'a', function(event) {
                self.selectItem(event);
            });
            $('#content').on('mouseup', 'a', function(event) {
                self.deselectItem(event);
            });
        }

        // We keep a single instance of the SearchPage and its associated Employee collection throughout the app
        this.searchResults = new directory.models.EmployeeCollection();
        this.searchPage = new directory.views.SearchPage({model: this.searchResults});
        this.searchPage.render();
        $(this.searchPage.el).attr('id', 'searchPage');
    },

    selectItem: function(event) {
        $(event.target).addClass('tappable-active');
    },

    deselectItem: function(event) {
        $(event.target).removeClass('tappable-active');
    },

    list: function() {
        var self = this;
        this.slidePage(this.searchPage);
    },

    employeeDetails: function(id) {
        var employee = new directory.models.Employee({id: id}),
            self = this;
        employee.fetch({
            success: function(data) {
                self.slidePage(new directory.views.EmployeePage({model: data}).render());
            }
        });
    },

    directReports: function(id) {
        var employee = new directory.models.Employee({id: parseInt(id)});
        employee.reports.fetch();
        this.slidePage(new directory.views.DirectReportPage({model: employee.reports}).render());
    },

    slidePage: function(page) {

        var slideFrom,
            self = this;

        if (!this.currentPage) {
            // If there is no current page (app just started) -> No transition: Position new page in the view port
            $(page.el).attr('class', 'page stage-center');
            $('#content').append(page.el);
            this.pageHistory = [window.location.hash];
            this.currentPage = page;
            return;
        }

        // Cleaning up: remove old pages that were moved out of the viewport
        $('.stage-right, .stage-left').not('#searchPage').remove();

        if (page === this.searchPage) {
            // Always apply a Back (slide from left) transition when we go back to the search page
            slideFrom = "left";
            $(page.el).attr('class', 'page stage-left');
            // Reinitialize page history
            this.pageHistory = [window.location.hash];
        } else if (this.pageHistory.length > 1 && window.location.hash === this.pageHistory[this.pageHistory.length - 2]) {
            // The new page is the same as the previous page -> Back transition
            slideFrom = "left";
            $(page.el).attr('class', 'page stage-left');
            this.pageHistory.pop();
        } else {
            // Forward transition (slide from right)
            slideFrom = "right";
            $(page.el).attr('class', 'page stage-right');
            this.pageHistory.push(window.location.hash);
        }

        $('#content').append(page.el);

        // Wait until the new page has been added to the DOM...
        setTimeout(function() {
            // Slide out the current page: If new page slides from the right -> slide current page to the left, and vice versa
            $(self.currentPage.el).attr('class', 'page transition ' + (slideFrom === "right" ? 'stage-left' : 'stage-right'));
            // Slide in the new page
            $(page.el).attr('class', 'page stage-center transition');
            self.currentPage = page;
        });

    }

});

// Bootstrap the application
directory.utils.store.populate();
directory.utils.templateLoader.load(['search-page', 'report-page', 'employee-page', 'employee-list-item'],
    function() {
        directory.app = new directory.Router();
        Backbone.history.start();
    });