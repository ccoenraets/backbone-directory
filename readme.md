## Update ##

This directory is no longer maintained. A new and improved version of the application is available in [this repository] (https://github.com/ccoenraets/directory-backbone-bootstrap)


# Backbone.js Employee Directory #

"Backbone Directory" is a simple Employee Directory application built with [Backbone.js](http://documentcloud.github.com/backbone/). 

The application allows you to look up employees by name, view the details of an employee, and navigate up and down the Org Chart by clicking the employee’s manager or any of his/her direct reports.

There are four versions of the application available in this repository:

1. Backbone.js + Twitter Bootstrap (located in the [/web](http://twitter.github.com/bootstrap/) directory). 
	- Read more about this version [here](http://coenraets.org/blog/2012/02/sample-app-with-backbone-js-and-twitter-bootstrap/)
	- Try it [here](http://coenraets.org/directory/)
2. Backbone.js + jQuery Mobile (located in the [/jquerymobile](https://github.com/ccoenraets/backbone-directory/tree/master/jquerymobile) directory). 
	- Read more about this version [here](http://coenraets.org/blog/2012/03/employee-directory-sample-app-with-backbone-js-and-jquery-mobile/)
	- Try it [here](http://coenraets.org/backbone/directory/jquerymobile/)
3. Backbone.js + native-looking iPhone skins (located in the [/iphone](https://github.com/ccoenraets/backbone-directory/tree/master/iphone) directory).
	- Read more about this version [here](http://coenraets.org/blog/2012/03/crafting-native-looking-ios-apps-with-html-backbone-js-and-phonegap/)
	- Try it [here](http://coenraets.org/backbone/directory/iphone/)
4. Backbone.js + native-looking iPhone skins and a local database implementation (located in the [/iphone](https://github.com/ccoenraets/backbone-directory/tree/master/localdb) directory).
	- Read more about this version [here](http://coenraets.org/blog/2012/04/building-mobile-apps-with-html-and-a-local-database/)
	- Try it [here](http://coenraets.org/backbone/directory/localdb/)

The Twitter Bootstrap and jQuery Mobile versions use JSON services. Instructions to set up these services are provided below. The "native-looking iPhone" versions use sample in-memory data and don't have any dependency on external services.

## Set Up: ##

1. Create a MySQL database name "directory".
2. Execute directory.sql to create and populate the "employee" table:

	mysql directory -uroot < directory.sql

## Services: ##

The application is available with a PHP or Java services:

- The PHP services are available in the api directory of this repository. The RESTful services are implemented in PHP using the [Slim framework](http://www.slimframework.com/) (also included in the api directory).
- The Java back-end will be available soon.
