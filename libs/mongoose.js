const mongoose = require('mongoose');
const Config = require('./config');

mongoose.Promise = Promise;
const mongooseLogs = (process.env.NODE_ENV === 'development');
mongoose.set('debug', mongooseLogs);

mongoose
    .connect(Config.mongoose.uri, Config.mongoose.options)
    .then(m => m.connection.getClient())
    .catch(err => {
            console.log("Не удалось подключиться к БД");
            process.exit();
        });

module.exports = mongoose;