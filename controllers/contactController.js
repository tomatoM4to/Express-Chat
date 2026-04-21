const asyncHandler = require('express-async-handler');

const getAllContacts = asyncHandler(async (req, res) => {
    res.status(200).send("Get all contacts");
});

const createContact = asyncHandler(async (req, res, next) => {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
        const error = new Error("All fields are required");
        error.status = 400;
        return next(error);
    }
    res.status(201).send("Contact created successfully");
});

const getContact = asyncHandler(async (req, res) => {
    res.status(200).send("Get contact by id");
});

const updateContact = asyncHandler(async (req, res) => {
    res.status(200).send("Update contact by id");
});

const deleteContact = asyncHandler(async (req, res) => {
    res.status(200).send("Delete contact by id");
});

module.exports = {
    getAllContacts,
    createContact,
    getContact,
    updateContact,
    deleteContact
};