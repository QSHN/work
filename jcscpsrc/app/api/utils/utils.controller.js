const L = require('debug')('app:api');
const errors = require('@lib/errors');
const aliyun = require('@lib/aliyun');

module.exports = {
    getOssRole
}

async function getOssRole(req, res, next) {
    try {
        let who = req.user.userId;
        let credentials = await aliyun.getOssRole(who);
        let config = aliyun.getOssConfig();
        res.status(200).send({
            'credentials': credentials,
            'oss': {
                'region': config.region,
                'bucket': config.bucket
            }
        });
    } catch (err) {
        L(err);
        next(new errors.ServiceUnavailable('fails to get oss role'));
    }

}