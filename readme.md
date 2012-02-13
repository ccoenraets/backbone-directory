# Backbone.js Employee Directory #

"Backbone Directory" is a sample application built using [Backbone.js](http://documentcloud.github.com/backbone/) and
 [Twitter Bootstrap](http://twitter.github.com/bootstrap/). The application is an Employee Directory that allows you to
 look for employees by name, view the details of an employee, and navigate up and down the Org Chart by clicking the
 employee’s manager or any of his/her direct reports.

## Set Up: ##

1. Create a MySQL database name "directory".
2. Execute directory.sql to create and populate the "employee" table:

	mysql directory -uroot < directory.sql

## Services: ##

The application is available with a PHP or Java services:

- The PHP services are available in the api directory of this repository. The RESTful services are implemented in PHP using the [Slim framework](http://www.slimframework.com/) (also included in the api directory).
- The Java back-end will be available soon.

