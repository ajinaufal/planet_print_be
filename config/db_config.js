const mongoose = require('mongoose');

async function mongodbConnect() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            poolSize: 1000,
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

module.exports = { mongodbConnect };