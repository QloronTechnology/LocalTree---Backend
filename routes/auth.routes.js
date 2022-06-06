const router = require("express").Router();
const commonController = require("../controller/commonController");
const response = require("../helper/response");
const MESSAGE = require("../helper/message");
const auth = require("../helper/auth");
const otp = require("../helper/otp");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const axios = require("axios");
const message = require("../helper/message");
const User = mongoose.model("User");


router.post("/register", async (req, res) => {
  try {
    let data = req.body;
    if (data.email && data.password && data.role && data.mobile) {
      let getUser = await User.findOne({
        $or: [{ email: data.email }, { mobile: data.mobile }],
      });
      if (getUser) {
        // alerady exists
        response.successResponse(res, "user already exists", 405, getUser);
        // res.jsonp({
        //   message: "user already exists",
        //   messageCode: 405,
        //   status: true,
        //   data: getUser,
        // });
      } else {
        // add
        bcrypt.genSalt(saltRounds, function (err, salt) {
          bcrypt.hash(req.body.password, salt, async function (err, hash) {
            // Store hash in your password DB.
            req.body["password"] = hash;
            console.log("Aditya",hash)
            req.body["otp"] = otp.generateOTP();
            const addUser = await new User(req.body).save();
            const token = jwt.sign(
              {
                userId: addUser._id,
                date: new Date(),
              },
              process.env.secret
            );
            // coustom response
            // const response = {
            //   _id: addUser._id,
            //   Name: addUser.name,
            //   Email: addUser.email,
            //   token: token,
            // };
            res.jsonp({
              message: "User is added successfully",
              messageCode: 201,
              status: true,
              data: { addUser, token },
            });
          });
        });
      }
    } else {
      response.errorMsgResponse(res, "Invalid Data", 301);
      // res.jsonp({
      //   message: "Invalid Data",
      //   messageCode: 301,
      //   status: false,
      // });
    }
  } catch (error) {
    console.log(error);
    response.errorMsgResponse(res, "unable to register User", 403);
    // res.jsonp({
    //   message: "unable to register User",
    //   messageCode: 403,
    //   status: false,
    // });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password, role } = req.body;
    let getUser = await User.findOne({
      $or: [{ email: username }, { mobile: username }],
      // email: req.body.email,
    });
    if (getUser) {
      // user found
      bcrypt.compare(password, getUser.password, function (err, result) {
        // result == true
        if (result) {
          if (getUser.verified == true) {
            if (getUser.role === role) {
              const token = jwt.sign(
                {
                  userId: getUser._id,
                  date: new Date(),
                },
                process.env.secret
              );
              // coustom response
              const response = {
                _id: getUser._id,
                Name: `${getUser.firstName} ${getUser.lastName}`,
                Email: getUser.email ? getUser.email : "",
                Mobile: getUser.mobile ? getUser.mobile : "",
                token: token,
              };
              res.jsonp({
                message: "login successfully",
                messageCode: 200,
                status: true,
                data: response,
              });
            } else {
              res.jsonp({
                message: `only ${role} can login`,
                messageCode: 402,
                status: false,
              });
            }
          } else {
            response.errorMsgResponse(
              res,
              "Mobile verification in needed",
              404
            );
            // res.jsonp({
            //   message: "Mobile verification in needed",
            //   messageCode: 404,
            //   status: false,
            // });
          }
        } else {
          response.errorMsgResponse(res, "password is incorrect", 404);
          // res.jsonp({
          //   message: "password is incorrect",
          //   messageCode: 403,
          //   status: false,
          // });
        }
      });
    }
    else {
      response.errorMsgResponse(res, "User is not found", 404);
      // res.jsonp({
      //   message: "User is not found",
      //   messageCode: 403,
      //   status: false,
      // });
    }
  } catch (error) {
    response.errorMsgResponse(res, "unable to login", 403);
    // res.jsonp({ message: "unable to login", messageCode: 403, status: false });
  }
});

router.get("/get-profile", auth, async (req, res) => {
  try {
    let getUser = await User.findOne({ _id: req.userId });
    response.successResponse(res, "user fetch successfully", 200, getUser);
  } catch (error) {
    res.jsonp({ message: "unable to fetch", messageCode: 403, status: false });
  }
});
  
router.put("/edit-profile", auth, async (req, res) => {
  try {
    await User.findOneAndUpdate({ _id: req.userId }, req.body);
    let getUser = await User.findOne({ _id: req.userId });
    response.successResponse(res, "user updated successfully", 201, getUser);
  } catch (error) {
    res.jsonp({ message: "unable to update", messageCode: 403, status: false });
  }
});

router.post("/verify-mobile", async (req, res) => {
  try {
    let getData = await User.findOneAndUpdate(
      { mobile: req.body.mobile, otp: req.body.otp },
      { verified: true }
    );
    if (getData) {
      response.successResponse(res, "Mobile verified", 201);
    } else {
      response.errorMsgResponse(res, "Wrong otp", 301);
    }
  } catch (error) {
    res.jsonp({ message: "unable to update", messageCode: 403, status: false });
  }
});




module.exports = router;
