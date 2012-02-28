process.env.NODE_ENV = 'test';
var request = require('../node_modules/mers/test/support/http'),
    assert = require('assert'),
    app = require('../app'),
    should = require('should'),
    load = require('../load');


before(function (done) {
    load.load('mongodb://localhost/backbone-directory-test', __dirname + "/../directory.csv", function () {
        console.log('all done');
        done();
    });

});

//
describe('Rest Operations', function () {
    describe('GET /api/employees', function () {

        it('should return employees', function (done) {
            request(app).get('/api/employees').end(function (res) {
                res.should.be.json
                res.should.have.property('body');
                res.body.should.have.lengthOf(12);
                done();
            });
        });
        var jid;
        it('should return james', function (done) {
            request(app).get('/api/employees/search/James').end(function (res) {
                res.should.be.json
                res.should.have.property('body');
                res.body.should.have.lengthOf(1);
                var body = res.body[0];
                body.should.have.property('id');
                body.should.not.have.property('_id');

                jid = body.id;
                done();
            });
        });
        it('should return williams with reports and a manager', function (done) {
            request(app).get('/api/employees/search/Williams').end(function (res) {
                res.should.be.json
                res.should.have.property('body');
                res.body.should.have.lengthOf(1);
                var body = res.body[0];
                body.should.have.property('id');
                body.should.have.property('managerId', jid);
                body.should.not.have.property('_id');

                jid = body.id;
                done();
            });
        });
        it('should return single user', function (done) {
            request(app).get('/api/employees/' + jid).end(function (res) {
                res.should.be.json
                res.should.have.property('body');
                var body = res.body;
                body.should.have.property('id');
                body.should.not.have.property('_id');
                jid = body.id;
                done();
            });
        });
        it('should return reports', function (done) {
            request(app).get('/api/employees/' + jid + '/reports').end(function (res) {
                res.should.be.json
                res.should.have.property('body');
                res.body.should.have.lengthOf(3);
                var body = res.body[0];
                body.should.have.property('id');
                body.should.not.have.property('_id');
                //should really pass, has to do with the nested search.  might be better off creating a finder, but I want to show off this behaviour.
                body.should.have.property('managerId', jid);
                done();
            });
        });

    })
});
