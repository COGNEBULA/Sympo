const express = require("express")
const router = express.Router();

//Routings import


const authroute = require('./auth_routes')
const formroutes = require("./form_routes")


// router.get("", (req, res) => {
//   res.send("🚀 Server is running");
// });


router.use('',authroute)
router.use('',formroutes)



module.exports = router;