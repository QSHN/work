const acl = require('express-acl');
const L = require('debug')('app:init');

module.exports = function(server) {
    // Call the config method and pass in the  options
    acl.config({
        baseUrl: 'api',
        defaultRole: 'anonymous',
        decodedObjectName: 'user',
        rules: [
            {
                group: 'admin',
                permissions: [
                  {
                    resource: '*',
                    methods: '*',
                    action: 'allow'
                  }
                ],
            },
            {
                group: 'company',
                permissions: [
                    {
                        resource: '*',
                        methods: '*',
                        action: 'allow'
                    }
                ],
            },
            {
                group: 'client',
                permissions: [
                    {
                        resource: '*',
                        methods: '*',
                        action: 'allow'
                    }
                ],
            },
            {
                group: 'anonymous',
                permissions: [
                    {
                        resource: 'user/login',
                        methods: ['POST'],
                        action: 'allow'
                    }
                ],
            }
        ]
    });


    // enable acl authorization
    server.use(acl.authorize);
    L('express-acl activated');
}
