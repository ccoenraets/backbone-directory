//This drops the db and loads it.   This is just for setting the stuff up.
function load(uri, file, alldone) {
    file = file || __dirname + '/directory.csv';
    uri = uri || 'mongodb://localhost/backbone-directory';
    alldone = alldone || function () {
        console.log('all done');
        process.exit(0)
    };
    var rest = require('mers')({uri:uri }),
        mongoose = rest.mongoose, emp =
        require('./employee')(mongoose),
        csv = require('csv');
    var Employee = mongoose.model('employee');
//var fields = ['id','firstName','lastName','managerId','title','department','officePhone','cellPhone','email','city','picture','twitterId','blogURL'];
    var fields;

    mongoose.connection.db.dropDatabase(function (done) {
        console.log('dropped');
        loadCsv();

    });
    var map = {};
    function loadCsv() {

        csv().fromPath(file)
            .transform(function (data) {
                if (!fields) return data;
                var obj = {};
                for (var i = 0, l = data.length; i < l; i++) {
                    obj[fields[i]] = data[i];
                }
                return obj
            })
            .on('data',
            function (data, index) {
                if (index == 0) {
                    fields = data;
                    fields[0] = 'id_';
                    fields[3] = 'managerId_';
                 } else {
                    map[data.id_] = new Employee(data);

                }
            }).on('end', function (count) {
                console.log('Number of lines: ' + count);
                doSave(Object.keys(map), function onDone(err, obj) {
                    if (err) return console.log('error saving', err);
                    console.log('Now we match up managers to ');

                    //process.exit(0);
                    var keys = Object.keys(map);
                    var d = {};


                    for (var i = 0, l = keys.length; i < l; i++) {
                        var key = keys[i];
                        var e = map[key];
                        if (e.managerId_ && map[e.managerId_]) {
                            var m = map[e.managerId_];

                            e.manager = m;
                            m.reports.push(e);
                            d[m.id_] = 1;
                            d[e.id_] = 1;
                        }
                    }
                    doSave(Object.keys(d), alldone)

                });
            })
            .on('error', function (error) {
                console.log('csv error', error.message);
                alldone(error);
            });

    }

    function doSave(keys, done) {
        if (!keys.length) {
            if (done) done();
            return;
        }
        var key = keys.shift();
        var e = map[key];

        e.save(function (err, obj) {
            doSave(keys, done);
        });
    }
}

if (!module.parent)
    load();
else
    module.exports.load = load;
