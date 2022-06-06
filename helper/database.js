let mongoose = require("mongoose");

module.exports = {
  connect: function () {
    let db = mongoose
      .connect(process.env.db_url, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      })
      .then((res) => console.log("connected"));
    mongoose.Promise = global.Promise;
  },
  initModels: function () {
    require("../model/index.model");
  },
};