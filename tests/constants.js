
// place to control values for each test
exports.token       = 'test_token'
exports.project     = '4e25e1d35c0dd2780100048d'

// mq values
exports.queue       = 'my_queue'

// worker values
exports.code        = 'my_code'
exports.task        = 'my_task'

// cache values
exports.cache       = 'my_cache'
exports.cache_key   = 'key'
exports.cache_val   = 'value'

// nock values
exports.mq_url      = 'https://mq-aws-us-east-1.iron.io'
exports.worker_url  = 'https://worker-aws-us-east-1.iron.io'
exports.cache_url   = 'https://cache-aws-us-east-1.iron.io'
exports.user_agent  = 'Iron Node Client'

// way to turn off nock and actauly send the requests to iron.io
exports.proxy     = true
