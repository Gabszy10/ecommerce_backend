const SequelizeRedis = require("sequelize-redis");
const bluebird = require("bluebird");
const redis = require("redis");

// Let's promisify Redis
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

let rc = redis.createClient(6379, "localhost");
const sequelizeRedis = new SequelizeRedis(rc);

module.exports = {
  modelCached: (model) => {
    return sequelizeRedis.getModel(model, { ttl: 60 * 60 * 72 });
  },

  deleteModelCached: (key) => {
    rc.del(key);
  },

  clearCache: async () => {
    await rc.flushdb();
  },
};
