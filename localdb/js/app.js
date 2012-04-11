"use strict";

// Creating the application namespace
var directory = {
    models: {},
    views: {},
    utils: {},
    dao: {}
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

// The Employee Data Access Object (DAO). Encapsulates logic (in this case SQL statements) to access employee data.
directory.dao.EmployeeDAO = function(db) {
    this.db = db;
};

_.extend(directory.dao.EmployeeDAO.prototype, {

    findByName: function(key, callback) {
        this.db.transaction(
            function(tx) {

                var sql = "SELECT e.id, e.firstName, e.lastName, e.title, count(r.id) reportCount " +
                    "FROM employee e LEFT JOIN employee r ON r.managerId = e.id " +
                    "WHERE e.firstName || ' ' || e.lastName LIKE ? " +
                    "GROUP BY e.id ORDER BY e.lastName, e.firstName";

                tx.executeSql(sql, ['%' + key + '%'], function(tx, results) {
                    var len = results.rows.length,
                        employees = [],
                        i = 0;
                    for (; i < len; i = i + 1) {
                        employees[i] = results.rows.item(i);
                    }
                    callback(employees);
                });
            },
            function(tx, error) {
                alert("Transaction Error: " + error);
            }
        );
    },

    findById: function(id, callback) {
        this.db.transaction(
            function(tx) {

                var sql = "SELECT e.id, e.firstName, e.lastName, e.title, e.city, e.officePhone, e.cellPhone, e.email, e.managerId, m.firstName managerFirstName, m.lastName managerLastName, count(r.id) reportCount " +
                    "FROM employee e " +
                    "LEFT JOIN employee r ON r.managerId = e.id " +
                    "LEFT JOIN employee m ON e.managerId = m.id " +
                    "WHERE e.id=:id";

                tx.executeSql(sql, [id], function(tx, results) {
                    callback(results.rows.length === 1 ? results.rows.item(0) : null);
                });
            },
            function(tx, error) {
                alert("Transaction Error: " + error);
            }
        );
    },

    findByManager: function(managerId, callback) {
        directory.db.transaction(
            function(tx) {

                var sql = "SELECT e.id, e.firstName, e.lastName, e.title, count(r.id) reportCount " +
                    "FROM employee e LEFT JOIN employee r ON r.managerId = e.id " +
                    "WHERE e.managerId = ? " +
                    "GROUP BY e.id ORDER BY e.lastName, e.firstName";

                tx.executeSql(sql, [managerId], function(tx, results) {
                    var len = results.rows.length,
                        employees = [],
                        i = 0;
                    for (; i < len; i = i + 1) {
                        employees[i] = results.rows.item(i);
                    }
                    callback(employees);
                });
            },
            function(tx, error) {
                alert("Transaction Error: " + error);
            }
        );
    },

    // Populate Employee table with sample data
    populate: function(callback) {
        directory.db.transaction(
            function(tx) {
                console.log('Dropping EMPLOYEE table');
                tx.executeSql('DROP TABLE IF EXISTS employee');
                var sql =
                    "CREATE TABLE IF NOT EXISTS employee ( " +
                    "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                    "firstName VARCHAR(50), " +
                    "lastName VARCHAR(50), " +
                    "title VARCHAR(50), " +
                    "managerId INTEGER, " +
                    "city VARCHAR(50), " +
                    "officePhone VARCHAR(50), " +
                    "cellPhone VARCHAR(50), " +
                    "email VARCHAR(50))";
                console.log('Creating EMPLOYEE table');
                tx.executeSql(sql);
                console.log('Inserting employees');
                tx.executeSql("INSERT INTO employee VALUES (1, 'Ryan', 'Howard', 'Vice President, North East', 0, 'New York, NY', '212-999-8888', '212-999-8887', 'ryan@dundermifflin.com')");
                tx.executeSql("INSERT INTO employee VALUES (2, 'Michael', 'Scott', 'Regional Manager', 1, 'Scranton, PA', '570-865-2536', '570-123-4567', 'michael@dundermifflin.com')");
                tx.executeSql("INSERT INTO employee VALUES (3, 'Dwight', 'Schrute', 'Assistant Regional Manager', 2, 'Scranton, PA', '570-023-321', '570-635-1122', 'dwight@dundermifflin.com')");
                tx.executeSql("INSERT INTO employee VALUES (4, 'Jim', 'Halpert', 'Assistant Regional Manager', 2, 'Scranton, PA', '570-255-8989', '570-968-5741', 'jim@dundermifflin.com')");
                tx.executeSql("INSERT INTO employee VALUES (5, 'Pamela', 'Beesly', 'Receptionist', 2, 'Scranton, PA', '570-999-5555', '570-999-7474', 'pam@dundermifflin.com')");
                tx.executeSql("INSERT INTO employee VALUES (6, 'Angela', 'Martin', 'Senior Accountant', 2, 'Scranton, PA', '570-555-9696', '570-999-3232', 'angela@dundermifflin.com')");
                tx.executeSql("INSERT INTO employee VALUES (7, 'Kevin', 'Malone', 'Accountant', 6, 'Scranton, PA', '570-777-9696', '570-111-2525', 'kmalone@dundermifflin.com')");
                tx.executeSql("INSERT INTO employee VALUES (8, 'Oscar', 'Martinez', 'Accountant', 6, 'Scranton, PA', '570-321-9999', '570-585-3333', 'oscar@dundermifflin.com')");
                tx.executeSql("INSERT INTO employee VALUES (9, 'Creed', 'Bratton', 'Quality Assurance', 2, 'Scranton, PA', '570-222-6666', '333-8585', 'creed@dundermifflin.com')");
                tx.executeSql("INSERT INTO employee VALUES (10, 'Andy', 'Bernard', 'Sales Director', 4, 'Scranton, PA', '570-555-0000', '570-546-9999','andy@dundermifflin.com')");
                tx.executeSql("INSERT INTO employee VALUES (11, 'Phyllis', 'Lapin', 'Sales Representative', 10, 'Scranton, PA', '570-141-3333', '570-888-6666', 'phyllis@dundermifflin.com')");
                tx.executeSql("INSERT INTO employee VALUES (12, 'Stanley', 'Hudson', 'Sales Representative', 10, 'Scranton, PA', '570-700-6666', '570-777-6666', 'shudson@dundermifflin.com')");
                tx.executeSql("INSERT INTO employee VALUES (13, 'Meredith', 'Palmer', 'Supplier Relations', 2, 'Scranton, PA', '570-555-8888', '570-777-2222', 'meredith@dundermifflin.com')");
                tx.executeSql("INSERT INTO employee VALUES (14, 'Kelly', 'Kapoor', 'Customer Service Rep.', 2, 'Scranton, PA', '570-123-9654', '570-125-3666', 'kelly@dundermifflin.com')");
                tx.executeSql("INSERT INTO employee VALUES (15, 'Toby', 'Flenderson', 'Human Resources', 1, 'Scranton, PA', '570-485-8554', '570-996-5577', 'tflenderson@dundermifflin.com')");
            },
            function(tx, error) {
                alert('Transaction error ' + error);
            },
            function(tx) {
                callback();
            }
        );
    }
});


// Overriding Backbone's sync method. Replace the default RESTful services-based implementation
// with a simple local database approach.
Backbone.sync = function(method, model, options) {

    var dao = new model.dao(directory.db);

    if (method === "read") {
        if (model.id) {
            dao.findById(model.id, function(data) {
                options.success(data);
            });
        } else if (model.managerId) {
            dao.findByManager(model.managerId, function(data) {
                options.success(data);
            });
        } else {
            dao.findAll(function(data) {
                options.success(data);
            });
        }
    }

};

// -------------------------------------------------- The Models ---------------------------------------------------- //

// The Employee Model
directory.models.Employee = Backbone.Model.extend({

    dao: directory.dao.EmployeeDAO,

    initialize: function() {
        this.reports = new directory.models.EmployeeCollection();
        this.reports.managerId = this.id;
    }

});

// The EmployeeCollection Model
directory.models.EmployeeCollection = Backbone.Collection.extend({

    dao: directory.dao.EmployeeDAO,

    model: directory.models.Employee,

    findByName: function(key) {
        var employeeDAO = new directory.dao.EmployeeDAO(directory.db),
            self = this;
        employeeDAO.findByName(key, function(data) {
            self.reset(data);
        });
    }

});


// -------------------------------------------------- The Views ---------------------------------------------------- //

directory.views.SearchPage = Backbone.View.extend({

    templateLoader: directory.utils.templateLoader,
    EmployeeListView: directory.views.EmployeeListView,

    initialize: function() {
        this.template = _.template(this.templateLoader.get('search-page'));
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
        var employee = new directory.models.Employee({id: id});
        employee.reports.fetch();
        this.slidePage(new directory.views.DirectReportPage({model: employee.reports}).render());
    },

    slidePage: function(page) {

        var slideFrom,
            self = this;

        // If there is no current page (app just started) -> No transition: Position new page in the view port
        if (!this.currentPage) {
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
directory.db = window.openDatabase("EmployeeDB", "1.0", "Employee Demo DB", 200000);
var employeeDAO = new directory.dao.EmployeeDAO(directory.db);
employeeDAO.populate(function() {
    directory.utils.templateLoader.load(['search-page', 'report-page', 'employee-page', 'employee-list-item'],
        function() {
            directory.app = new directory.Router();
            Backbone.history.start();
        });
});