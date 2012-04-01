
/**
 * Module dependencies.
 */

var express = require('express')
  , resource= require('express-resource')
  , employees = require('./employees') 
  , path = require('path')

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use("/web",express.static(path.normalize(__dirname + '/../web')));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req,res){res.redirect("/web/index.html",301)});


var employeeResource = app.resource('api/employees', employees);
employeeResource.map("get", "reports", employees.reports);
app.get("/api/employees/search/:query",employees.search);


app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
