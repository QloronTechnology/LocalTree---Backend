let router = require("express").Router();
let multer = require("multer");
let path = require("path");

var upload = multer({
  storage: multer.diskStorage({
    // destination: (req, file, callback) => {
    //     callback(null, "./public/uploads");
    // },
    destination: "./public/uploads",
    filename: (req, file, callback) => {
      req.originalName = Date.now() + path.extname(file.originalname);
      callback(null, req.originalName);
    },
  }),
}).any(); // for multiple upload

router.post("/", (req, res) => {
  upload(req, res, (err) => {
    var files = [];
    req.files.forEach((ele) => {
      console.log(ele);
      files.push(process.env.staticFilesUrl + ele.filename);
    });
    res.send({
      status: "SUCCESS",
      files,
    });
  });
});

module.exports = router;
