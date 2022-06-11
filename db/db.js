const mongoose = require('mongoose')
const MONGO_URL = process.env.MONGO_URL

const connect = () => {

    mongoose.connect(MONGO_URL, {}).then(() => {
        console.log(`MongoDB Connected`);
    }).catch((error) => {
        console.log(`Error ${error}`);
    })

}

module.exports = connect