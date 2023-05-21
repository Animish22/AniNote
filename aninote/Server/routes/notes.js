const express = require("express");
const router = express.Router();
var fetchuser = require("../middleware/fetchuser")
const Note = require("../models/Note");
const { body, validationResult } = require('express-validator');

//Route 1 : Get all the notes.. // Login required 
router.get('/fetchallnotes', fetchuser, async (req, res) => {

    try {
        const notes = await Note.find({ user: req.user.id })
        res.json(notes);
    } catch (error) {
        res.status(500).send("Internal Error occured");
    }

})

//Route 2 : Add new Note : LOGIN required
router.post('/addnote', [
    body('title', 'Enter a valid name').isLength({ min: 3 }),
    body('description', 'Enter a valid email ').isLength({ min: 5 }),
], fetchuser, async (req, res) => {
    try {

        const { title, description, tag } = req.body;
        //If errors then send BAD request!
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const notes = new Note({ title, description, tag, user: req.user.id });
        const savedNotes = await notes.save();

        res.json(savedNotes);
    } catch (error) {
        res.status(500).send("Internal Error occured");
    }

})


//Route 3 : Update a  Note : LOGIN required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {

        const { title, description, tag } = req.body;

        //Creating new note.
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };


        //Find the note u earlier had;

        // req.params.id is the id we have given to each note in the url 
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Cannot find the note");
        }
        //Allow only the user who posted the note to update it .
        if (note.user.toString() != req.user.id) {
            return res.status(401).send("You can only access your own note not others.");
        }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json({ note });
    } catch (error) {
        res.status(500).send("Internal Error occured");
    }

})

//Route 4 : Delete a  Note : LOGIN required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        
        //Find the note u earlier had;

        // req.params.id is the id we have given to each note in the url 
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Cannot find the note");
        }


        //Allow to delete only if it is the user who posted the note
        if (note.user.toString() != req.user.id) {
            return res.status(401).send("You can only access your own note not others.");
        }
        note = await Note.findByIdAndDelete(req.params.id);
        res.json({ "Success": "note has been deleted"});
    } catch (error) {
        res.status(500).send("Internal Error occured");
    }

})

module.exports = router;