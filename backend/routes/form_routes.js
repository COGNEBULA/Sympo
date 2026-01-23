const express = require("express");
const router = express.Router();

const { createRegistration } = require("../controllers/form_controller");
const upload = require("../middlewares/upload");
const { getRegistrationController } = require("../controllers/get_registration_controller");
const {sendupi} = require("../controllers/form_controller")

/* ===============================
   REGISTRATION FORM ROUTE
=============================== */


router.post(
  "/register",
  upload.single("file"),
  createRegistration
);

router.get("/get", getRegistrationController);
router.get("/upi",sendupi);

module.exports = router;
