const express = require('express');
const router = express.Router();
const {formcontroller} = require("../controllers/form_controller")

// router.all("/register", (req, res) => {
//   res.json({ method: req.method });
// });


router.post('/register',formcontroller)

module.exports = router;