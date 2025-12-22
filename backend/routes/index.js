const express = require("express")
const router = express.Router();

//Routings import
const formroute = require('./form')


// router.get("", (req, res) => {
//   res.send("🚀 Server is running");
// });

router.use("",formroute)

module.exports = router;