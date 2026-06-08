const asyncHandler = require('express-async-handler');
const Contact = require('../models/contactModel');

const getAllContacts = asyncHandler(async (req, res) => {
    const contacts = await Contact.find();
    res.render("index", { contacts: contacts});
});

const addContactForm = (req, res) => {
    res.render("add");
};

const createContact = asyncHandler(async (req, res, next) => {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
        const error = new Error("All fields are required");
        error.status = 400;
        return next(error);
    }
    const contact = await Contact.create({
        name,
        email,
        phone
    });
    // res.status(201).send(contact);
    res.redirect("/");
});

const getContact = asyncHandler(async (req, res, next) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        const error = new Error("Contact not found");
        error.status = 404;
        return next(error);
    }
    // res.status(200).send(contact);
    res.render("update", { contact: contact });
});

const updateContact = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const { name, email, phone } = req.body;

    const updatedContent = await Contact.findByIdAndUpdate(
        id,
        { name, email, phone },
        { new: true }
    );

    if (!updatedContent) {
        const error = new Error("Contact not found");
        error.status = 404;
        return next(error);
    }
    res.status(200).send(updatedContent);
    // res.redirect("/");
});

const deleteContact = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const contact = await Contact.findByIdAndDelete(id);

    if (!contact) {
        const error = new Error("Contact not found");
        error.status = 404;
        return next(error);
    }

    // res.status(200).send({ message: "Contact deleted successfully" });
    res.redirect("/");
});

module.exports = {
    getAllContacts,
    createContact,
    getContact,
    updateContact,
    deleteContact,
    addContactForm
};