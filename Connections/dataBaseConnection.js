const mongoose = require('mongoose');
const MongoDBConnectionString = process.env.MONGO_CONNECTION_STRING
mongoose.connect(MongoDBConnectionString).then(()=>{
    console.log("✅ DataBase connected")
}).catch((error)=>{
    console.log(`❌ MongoConnection Error \n ${error}`);
})