const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

// MongoDB Connection Function
async function connectToMongoDB() {
    try {
        const uri = process.env.MONGOLAB_URI;
        const options = {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            autoIndex: true,
            maxPoolSize: 10,
            dbName: 'planet_print',
        };
        await mongoose.connect(uri, options);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
}

module.exports = { connectToMongoDB };
