const jwt = require('express-jwt');
const config = require('config');
const L = require('debug')('app:init');

module.exports = function (server) {
    const s = config.get('secret');
    server.use(jwt({secret: s}).unless({
        path: [
            '/api/utils/vericode',
            '/api/user/login',
            '/api/user/register',

            '/api/_backstage/registerAdmin',
            '/api/_backstage/loginAdmin',
            '/api/_backstage/latestAppVersion',

            '/api/subject/subject/query',
            '/api/subject/type/query',

            '/api/credentials/query',
            '/api/credentials/credentialsSubject',
            '/api/credentials/generalLedger',
            '/api/credentials/update',
            '/api/credentials/queryLastInfo',

            '/api/credentialsTemplate/query',
            '/api/formula/formulaQuery',
            '/api/accountSet/query',
            '/api/abstract/query',
            '/api/currency/query',
            '/api/exchangeRate/rate/query',
            '/api/exchangeRate/type/query',
            '/api/measureUnit/unit/query',
            '/api/customer/query',
            '/api/department/query',
            '/api/clerk/query',
            '/api/supplier/query',
            '/api/cost/query',
            '/api/bankAccount/query',
            '/api/cashFlow/query',
        ]
    }));

    L('jwt installed.');
}

