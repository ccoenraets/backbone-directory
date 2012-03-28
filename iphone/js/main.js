// Overriding Backbone's sync method. We replace the default RESTful services-based implementation
// with a simple in-memory approach so that this sample doesn't have a dependency on remote services.
Backbone.sync = function (method, model, options) {
    switch (method) {
        case "read":
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
            break;
    }
};

var AppRouter = Backbone.Router.extend({

    routes:{
        "":"list",
        "list":"list",
        "employees/:id":"employeeDetails",
        "employees/:id/reports":"directReports"
    },

    initialize: function() {

        var self = this;

        // Keep track of the history of pages (we only store the page URL). Used to identify the direction
        // (left or right) of the sliding transition between pages.
        this.pageHistory = [];

        // Register event listener for back button troughout the app
        $('#content').on('click', '.header-back-button', function(event){
            window.history.back();
            return false;
        });

        // Check of browser supports touch events...
        if ('ontouchstart' in document.documentElement) {
            // ... if yes: register touch event listener to change the "selected" state of the item
            $('#content').on('touchstart', 'a', function(event){
                self.selectItem(event);
            });
            $('#content').on('touchend', 'a', function(event){
                self.deselectItem(event);
            });
        } else {
            // ... if not: register mouse events instead
            $('#content').on('mousedown', 'a', function(event){
                self.selectItem(event);
            });
            $('#content').on('mouseup', 'a', function(event){
                self.deselectItem(event);
            });
        }

        // We keep a single instance of the SearchPage and its associated Employee collection throughout the app
        this.searchResults = new EmployeeCollection();
        this.searchPage = new SearchPage({model: this.searchResults});
        this.searchPage.render();

    },

    selectItem:function(event) {
        $(event.target).addClass('tappable-active');
    },

    deselectItem:function(event) {
        $(event.target).removeClass('tappable-active');
    },

    list:function () {
        var self = this;
        this.slidePage(this.searchPage);
    },

    employeeDetails:function (id) {
        var employee = new Employee({id:id});
        var self = this;
        employee.fetch({
            success:function (data) {
                self.slidePage(new EmployeePage({model:data}).render());
            }
        });
    },

    directReports:function (id) {
        var employee = new Employee({id:id});
        employee.reports.fetch();
        this.slidePage(new DirectReportPage({model:employee.reports}).render());
    },

    slidePage:function(page) {

        if (!this.currentPage) {
            // If there is no current page (app just started) -> No transition: Position new page in the view port
            $(page.el).attr('class', 'page stage-center');
            $('#content').append(page.el);
            this.pageHistory = [window.location.hash];
            this.currentPage = page;
            return;
        }

        // Cleaning up: remove old pages that were moved out of the viewport
        $('.stage-right, .stage-left').remove();

        var slideFrom;
        if (page == this.searchPage) {
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

        var self = this;

        // Wait until the new page has been added to the DOM...
        setTimeout(function() {
            // Slide out the current page: If new page slides from the right -> slide current page to the left, and vice versa
            $(self.currentPage.el).attr('class', 'page transition ' + (slideFrom == "right" ? 'stage-left' : 'stage-right'));
            // Slide in the new page
            $(page.el).attr('class', 'page stage-center transition');
            self.currentPage = page;
        });

    }

});

$(document).ready(function () {
    tpl.loadTemplates(['search-page', 'report-page', 'employee-page', 'employee-list-item'],
        function () {
            app = new AppRouter();
            Backbone.history.start();
        });
});