var hapi = require('hapi');  
var _ = require('lodash');  

// Create hapi server instance
var server = new hapi.Server();


/**
 * Frontend Server configuration
 **/

// add frontend connection parameters
var frontend = server.connection({  
    host: 'localhost',
    port: process.env.PORT || 5000,
    labels: 'frontend'
});

// add routes
frontend.route({  
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        return reply('Hello without HTML view');
    }
});

// register hapi-auth-cookie plugin
frontend.register(require('hapi-auth-cookie'), function (err) {  
    if (err) {
        throw err;
    }

    frontend.auth.strategy('session', 'cookie', {
        password: 'secretpassword',
        cookie: 'cookie-name',
        redirectTo: '/login',
        isSecure: false
    });
});

frontend.register(require('vision'), function (err) {  
    if (err) {
        throw err;
    }

    // register view template engine
    server.views({
        engines: {
            html: require('handlebars')
        }
    });
});

/**
 * Backend Server configuration
 **/

// add frontend connection parameters
var backend = server.connection({  
    host: 'localhost',
    port: process.env.PORT || 3000,
    labels: 'backend'
});


// add backend-only route
backend.route({  
    method: 'GET',
    path: '/status',
    handler: function (request, reply) {
        return reply('ok');
    }
});

// register hapi-auth-jwt plugin only for backend
backend.register({  
    register: require('hapi-auth-jwt')
}, function (err) {
    if (err) {
        throw err;
    }

    backend.auth.strategy('token', 'jwt', {
        key: 'supersecretkey',
        validateFunc: function (decodedToken, callback) {
          console.log('jwt validate function')
        }
    });
});


// Start the server
server.start(function () {  
    // Log to the console the host and port info
    _.forEach(server.connections, function(connection) {
        console.log('Server started at: ' + connection.info.uri);
    });
});