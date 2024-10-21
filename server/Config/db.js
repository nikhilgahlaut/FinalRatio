const mongoose = require('mongoose')
const MONGO_URI = process.env.MONGO_URI

const connectToDb = async () => {
    mongoose.connect(MONGO_URI)
        .then((conn) => {
            console.log(`connected to db : ${conn.connection.host}`);
        })
        .catch((e) => {
            console.log(e.message);
            console.log(`error in db connection`);
            process.exit(1);
        })

}

module.exports = connectToDb