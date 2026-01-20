const express = require("express");
const router = express.Router();

const { createRegistration } = require("../controllers/form_controller");
const upload = require("../middlewares/upload");

/* ===============================
   REGISTRATION FORM ROUTE
=============================== */


router.post(
  "/register",
  upload.single("file"),
  createRegistration
);

module.exports = router;
