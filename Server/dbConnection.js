const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/ldss");
const db = mongoose.connection;

db.on("error", () => {
    console.log("mongodb error");
});
db.once("open", () => {
    console.log("DB connected");
});

module.exports=db;