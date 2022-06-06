const mongoose = require("mongoose");
const moment = require("moment");

module.exports = {
  add: (schema, data) => {
    return new Promise(function (resolve, reject) {
      var addSchema = new schema(data);
      addSchema
        .save()
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error : ", error);
          reject(error);
        });
    });
  },
  getAll: (schema) => {
    return new Promise(function (resolve, reject) {
      schema
        .find({
          status: {
            $ne: "deleted",
          },
        })
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error :", error);
          reject(error);
        });
    });
  },
  getBy: (schema, object) => {
    return new Promise(function (resolve, reject) {
      schema
        .find({
          ...object,
          status: {
            $ne: "deleted",
          },
        })
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  getOne: (schema, object) => {
    return new Promise(function (resolve, reject) {
      schema
        .findOne({
          ...object,
          status: {
            $ne: "deleted",
          },
        })
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  updateByObject: (schema, object, data) => {
    return new Promise(function (resolve, reject) {
      schema
        .findOneAndUpdate(object, data, {
          $new: true,
        })
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error", error);
          reject(error);
        });
    });
  },
  updateBy: (schema, id, data) => {
    return new Promise(function (resolve, reject) {
      schema
        .findOneAndUpdate(
          {
            _id: id,
          },
          data,
          {
            $new: true,
          }
        )
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error", error);
          reject(error);
        });
    });
  },
  delete: (schema, id) => {
    return new Promise(function (resolve, reject) {
      schema
        .findByIdAndDelete({
          _id: id,
        })
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error : ", error);
          reject(error);
        });
    });
  },
  deleteByObject: (schema, object) => {
    return new Promise(function (resolve, reject) {
      schema
        .findOneAndDelete(...object)
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error : ", error);
          reject(error);
        });
    });
  },
  deletePRM: (schema, object) => {
    return new Promise(function (resolve, reject) {
      schema
        .findOneAndDelete({
          ...object,
        })
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error", error);
          reject(error);
        });
    });
  },
};
