const express = require("express");
const {
    getAllContacts,
    createContact,
    getContact,
    updateContact,
    deleteContact,
    addContactForm
} = require("../controllers/contactController");

const router = express.Router();

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
