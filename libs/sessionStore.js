const mongoStore = require('connect-mongo');
const Config = require('./config');
const mongoose = require('mongoose');

const clientP = mongoose.connect(Config.mongoose.uri, Config.mongoose.options).then(m => m.connection.getClient())

const sessionStore = mongoStore.create({
    clientPromise: clientP
});

module.exports = sessionStore;