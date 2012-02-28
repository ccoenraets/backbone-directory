/**
 * Module dependencies.
 */

var express = require('express');

var app = module.exports = express.createServer();

// Configuration so we can do different profiles -- you can do this inline if you want.
function setupRest(db) {
    var rest = require('mers')({
        //the mongo uri of the database.  Make sure mongo is running.
        uri:         'mongodb://localhost/' + db,
        //Transformers all the returns to be converted.
        transformers:{
            //A little clean up to ensure that my response has similar to what the api does.
            _idToId:function () {
                return function (obj) {
                    var o = obj.toObject();
                    o.id = obj._id;
                    delete o._id;
                    delete o.id_;
                    delete o.managerId_;
                    var manager = obj.manager;
                    o.managerFirstName = manager ? manager.firstName : '';
                    o.managerLastName = manager ? manager.lastName : '';
                    o.managerId = manager && manager._id ? manager._id.toString() : manager || '';
//                    delete o.reports;
                    delete o.manager;
                    return o;
                }
            }
        }
    });
    //require employee. Its wrapped in a function so I can re-export mongoose, so mongoose does not need
    // to be added to the project.
    require('./employee')(rest.mongoose);

    //Change the response format to not include metadata, just the payload.
    // In theory you could change this to any type of response.
    rest.responseStream.prototype.format = function (data) {
        return JSON.stringify(data.payload);
    }
    //add the rest api.

    app.use('/api', rest.rest());
}

//All requests will be re-routed to /app/employee the singular name of the employee model.
app.all(/\api\/employees(.*)/, function (req, res, next) {
    req.url = '/api/employee' + req.params[0];
    req.query.transform = '_idToId';
    req.query.populate = 'manager';

    next();
});
app.get('/api/employee/:id', function (req, res, next) {
    req.query.transform = '_idToId';
    req.query.populate = 'manager,reports';
    next();
})
//Map the search api to /finder/search.
app.get(/\/api\/employee\/search(.*)/, function (req, res, next) {
//    http://localhost:3000/api/employees/finder/search/J
    req.url = '/api/employee/finder/search' + req.params[0];
    req.query.transform = '_idToId';
    req.query.populate = 'manager,reports';
    next();

})
//When calling reports we need to populate the reports.
app.get('/api/employee/:id/reports', function (req, rex, next) {
    if (req.query.populate) {
        req.query.populate = req.query.populate + ',manager,reports';
    } else
        req.query.populate = 'reports';
    next();
});

app.configure(function () {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    //change the static dir up one.
    app.use(express.static(__dirname + '/../web/'));
});

app.configure('development', function () {
    app.use(express.errorHandler({ dumpExceptions:true, showStack:true }));
    setupRest('backbone-directory')
});

app.configure('test', function () {

    app.use(express.errorHandler({ dumpExceptions:true, showStack:true }));
    setupRest('backbone-directory-test');
});


app.configure('production', function () {
    app.use(express.errorHandler());
    setupRest('backbone-directory')
});
