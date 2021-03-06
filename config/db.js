const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
        console.log('Mongo db conencted ...');
    } catch (error) {
        console.error(error.message);
        // Exit the process
        process.exit(1);
    }
};

module.exports = connectDB;