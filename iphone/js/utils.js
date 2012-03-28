// Template loader
tpl = {

    templates:{},

    loadTemplates:function(names, callback) {

        var deferreds = [];

        var self = this;

        $.each(names, function(index, name) {
            deferreds.push( $.get('tpl/' + name + '.html', function(data) {
                self.templates[name] = data;
            }));
        });

        $.when.apply(null, deferreds).done(callback);
    },

    // Get template by name from hash of preloaded templates
    get:function (name) {
        return this.templates[name];
    }

}

// In-memory Store
store = {

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
            if (this.employees[id].managerId == managerId) {
                results.push(this.employees[id]);
            }
        }
        return results;
    }

}

store.populate();