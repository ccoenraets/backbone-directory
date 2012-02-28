var server = require('./server');
server.listen(3000);
console.log("Express server listening on port %d in %s mode", server.address().port, server.settings.env);