let express = require("express");
let database = require("./helper/database");
let bodyParser = require("body-parser");
let path = require("path");
let cors = require("cors");
let dotenv = require("dotenv");
let cron = require("node-cron");
database.initModels();
let app = express();
dotenv.config();
const commonController = require("./controller/commonController");
// parse application/x-www-form-urlencoded
// app.use(
//   bodyParser.urlencoded({
//     extended: true,
//   })
// );

// const Socket = require("./controller/socket.controller");
// Socket();

enableCORS(app);
enableStaticFileServer(app, process.env.uploadUrl, "/api/static");
app.use(cors());

// parse application/json
// app.use(bodyParser.json());
database.connect();

function enableCORS(expressInstance) {
  expressInstance.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization, timeZone"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS, PATCH"
    );
    next();
  });
}

function enableStaticFileServer(expressInstance, folderName, route) {
  app.use(route, express.static(path.join(__dirname, folderName)));
}

app.use(
  bodyParser.json({
    limit: "500mb",
  })
);

app.use(
  bodyParser.urlencoded({
    limit: "500mb",
    extended: true,
    parameterLimit: 50000,
  })
);

// app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ limit: "50mb" }));

require("./routes/index.routes")(app);

cron.schedule("* * * * *", () => {
  commonController.expiredPromotion();
});

app.listen(process.env.port, () => {
  console.log("App listening on port : ", process.env.port);
});
