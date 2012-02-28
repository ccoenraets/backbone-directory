#Node API for backbone-directory.
This is just an example of how to use [https://github.com/jspears/mers]Mers  to serve up a rest api. It seems
compatible with the existing api it should require no changes to the javascript.

##Install
I will assume you have mongo and nodejs installed. Its only been tested with node version 0.6.10 but not using
anything fancy so I assume earlier versions may work.

install nodejs //that's what google is for.

install and start mongod  // install this somewhere does need to be here.

    mongodb --dbpath dbpath

checkout backbone-directory somehere.

    cd backbone-directory/node

run npm install
    npm install

load the sample data.

    node load.js // install the sample data.  The sample data live in directory.csv.

start the server

    node app.js


see the awesomeness

    open your browser at http://localhost:3000/ your golden.

to run the tests.
    
    npm test
    
##Files

* app.js -> the server startup   
* directory.csv -> data extracted from the ../directory.sql
* load.js -> loads the directory.csv into mongo.
* package.json -> is the package file for all this.
* Readme.md -> is this readme.
* tests/ -> mocha tests.

##Notes
Is this mongoose-rest-express easier than just doing it by hand? Maybe not for this example
though you do get free post/put/delete.  Most of what made this hard is maintaining API compatibilty
with what was there.   90% of the setup code was for that, if you wanted to use the defaults it would just have been
a single line

```javascript
app.use('/api', require('mers')({uri:'your mongodb uri'})).rest()
```
I wanted an example project of using Mers and wanted to make sure it was flexible enough to work.

Great job, and many thanks to Christophe Coenraets for getting the bones done.   Might have to borrow it for another project.
