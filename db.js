const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;

const url = 'mongodb://localhost:27017';

const dbName = process.env.DB_NAME || 'trello';

const client = new MongoClient(url, { useUnifiedTopology: true });
client.connect();

module.exports = {
  getClient: function() {
    return client;
  },
  getDB: function() {
    let client = module.exports.getClient();
    let db = client.db(dbName);
    return db;
  },
};