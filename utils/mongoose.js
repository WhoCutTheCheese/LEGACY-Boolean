const mongoose = require('mongoose');

module.exports = {
    init: () => {
        const dbOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };

        mongoose.connect("mongodb+srv://SmartSky:CheeseCake101@booleanstorage.3ud4r.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", dbOptions);
        mongoose.Promise = global.Promise;

        mongoose.connection.on('connected', () => {
            setTimeout(function () {
                console.log('Mongoose has successfully connected!');
            }, 100);
        });

        mongoose.connection.on('err', err => {
            console.error(`Mongoose connection error: \n${err.stack}`);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('Mongoose connection lost');
        });
    }
}