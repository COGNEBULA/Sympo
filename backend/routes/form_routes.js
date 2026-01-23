const express = require("express");
const router = express.Router();

const { createRegistration } = require("../controllers/form_controller");
const upload = require("../middlewares/upload");
const {sendupi} = require("../controllers/form_controller")

/* ===============================
   REGISTRATION FORM ROUTE
=============================== */


router.post(
  "/register",
  upload.single("file"),
  createRegistration
);

router.get("/upi",sendupi);

module.exports = router;
