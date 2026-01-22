const express = require("express");
const router = express.Router();

const { createRegistration } = require("../controllers/form_controller");
const upload = require("../middlewares/upload");
const { getRegistrationController } = require("../controllers/get_registration_controller");

/* ===============================
   REGISTRATION FORM ROUTE
=============================== */


router.post(
  "/register",
  upload.single("file"),
  createRegistration
);

router.get("/get", getRegistrationController);

module.exports = router;
