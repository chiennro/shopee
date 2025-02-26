const mongoose = require("mongoose");

mongoose.set('strictQuery', true).connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.juflc.mongodb.net/k21-duan?retryWrites=true&w=majority&appName=Cluster0`)
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(8, err);
  });

//mongodb://localhost:27017
module.exports = mongoose;
