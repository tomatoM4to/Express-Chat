const express = require("express");
const {
    getAllContacts,
    createContact,
    getContact,
    updateContact,
    deleteContact,
    addContactForm
} = require("../controllers/contactController");
const cookieParser = require("cookie-parser");
const checkLogin = require("../middleware/checkLogin");

const router = express.Router();

router.use(cookieParser());
router.use(checkLogin);

router.route("/")
    .get(getAllContacts);

router.route("/add")
    .get(addContactForm)
    .post(createContact);

router.route("/:id")
    .get(getContact)
    .put(updateContact)
    .delete(deleteContact);

module.exports = router;
