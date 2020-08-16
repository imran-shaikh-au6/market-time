const mongoose = require("mongoose");
 const mongo_URI = `mongodb+srv://imran:imran@capstone.efeef.mongodb.net/test?retryWrites=true&w=majority`;
// const mongo_URI = "mongodb://localhost:27017/Capstone";
mongoose
    .connect(mongo_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(function () {
        console.log("Mongo db compass connected");
    })
    .catch(function (err) {
        console.log(err.message);
    });
