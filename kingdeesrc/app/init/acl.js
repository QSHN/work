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
                group: 'accountSet',
                permissions: [
                    {
                        resource: '*',
                        methods: '*',
                        action: 'allow'
                    }
                ],
            },
            {
                group: 'salesman',
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
                        resource: 'utils/vericode',
                        methods: ['POST'],
                        action: 'allow'
                    },
                    {
                        resource: 'user/register',
                        methods: ['POST'],
                        action: 'allow'
                    },
                    {
                        resource: 'user/login',
                        methods: ['POST'],
                        action: 'allow'
                    },
                    {
                        resource: '_backstage/registerAdmin',
                        methods: ['POST'],
                        action: 'allow'
                    },
                    {
                        resource: '_backstage/loginAdmin',
                        methods: ['POST'],
                        action: 'allow'
                    },
                    {
                        resource: '_backstage/latestAppVersion',
                        methods: ['GET'],
                        action: 'allow'
                    },
                    {
                        resource: 'subject/subject/query',
                        methods: ['POST'],
                        action: 'allow'
                    },
                    {
                        resource: 'formula/formulaQuery',
                        methods: ['POST'],
                        action: 'allow'
                    },
                    {
                        resource: 'accountSet/query',
                        methods: ['POST'],
                        action: 'allow'
                    },
                    {
                        resource: 'credentials/query',
                        methods: ['POST'],
                        action: 'allow'
                    },
                    {
                        resource: 'credentials/credentialsSubject',
                        methods: ['POST'],
                        action: 'allow'
                    },
                    {
                        resource: 'credentials/generalLedger',
                        methods: ['POST'],
                        action: 'allow'
                    },
                    {
                        resource: 'subject/type/query',
                        methods: ['POST'],
                        action: 'allow'
                    },
                    {
                        resource: 'credentials/update',
                        methods: ['POST'],
                        action: 'allow'
                    },
                    {
                        resource: 'credentialsTemplate/query',
                        methods: ['POST'],
                        action: 'allow'
                    },
                    {
                        resource: 'credentials/queryLastInfo',
                        methods: ['POST'],
                        action: 'allow'
                    },
                    {
                        resource: 'abstract/query',
                        methods: ['POST'],
                        action: 'allow'
                    },
                    {
                        resource: 'currency/query',
                        methods: ['POST'],
                        action: 'allow'
                    },
                    {
                        resource: 'exchangeRate/rate/query',
                        methods: ['POST'],
                        action: 'allow'
                    },
                    {
                        resource: 'exchangeRate/type/query',
                        methods: ['POST'],
                        action: 'allow'
                    },
                    {
                        resource: 'measureUnit/unit/query',
                        methods: ['POST'],
                        action: 'allow'
                    },
                    {
                        resource: 'customer/query',
                        methods: ['POST'],
                        action: 'allow'
                    },
                    {
                        resource: 'department/query',
                        methods: ['POST'],
                        action: 'allow'
                    },
                    {
                        resource: 'clerk/query',
                        methods: ['POST'],
                        action: 'allow'
                    },
                    {
                        resource: 'supplier/query',
                        methods: ['POST'],
                        action: 'allow'
                    },
                    {
                        resource: 'cost/query',
                        methods: ['POST'],
                        action: 'allow'
                    },
                    {
                        resource: 'bankAccount/query',
                        methods: ['POST'],
                        action: 'allow'
                    },
                    {
                        resource: 'cashFlow/query',
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
