const auth = require("../helper/auth");

module.exports = (app) => {
  let authRoute = require("./auth.routes");
  let uploadRoute = require("./upload.routes");

  app.use("/api/auth", authRoute);
  app.use("/api/upload", uploadRoute);
};
