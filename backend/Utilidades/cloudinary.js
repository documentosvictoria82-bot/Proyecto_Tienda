const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dhboszpzi",
  api_key: "187753996817882",
  api_secret: "aZRznTb-6NDow2Q3HWUENRuFjjU"
});

module.exports = cloudinary;