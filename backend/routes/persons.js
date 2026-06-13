const express = require('express');
const router = express.Router();
const Person = require('../models/Person');
const Document = require('../models/Document');

// @route   GET /api/persons
// @desc    Get all persons
router.get('/', async (req, res) => {
  try {
    const persons = await Person.find().sort({ createdAt: -1 });
    res.json(persons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/persons
// @desc    Create a new person
router.post('/', async (req, res) => {
  const { name, email, relationship } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Please provide name and email' });
  }

  try {
    const newPerson = new Person({
      name,
      email,
      relationship,
    });

    const savedPerson = await newPerson.save();
    res.status(201).json(savedPerson);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/persons/:id
// @desc    Update person details
router.put('/:id', async (req, res) => {
  const { name, email, relationship } = req.body;

  try {
    const person = await Person.findById(req.params.id);
    if (!person) {
      return res.status(404).json({ message: 'Person not found' });
    }

    if (name) person.name = name;
    if (email) person.email = email;
    if (relationship) person.relationship = relationship;

    const updatedPerson = await person.save();
    res.json(updatedPerson);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/persons/:id
// @desc    Delete a person and their documents
router.delete('/:id', async (req, res) => {
  try {
    const person = await Person.findById(req.params.id);
    if (!person) {
      return res.status(404).json({ message: 'Person not found' });
    }

    // Delete all documents associated with this person
    await Document.deleteMany({ personId: req.params.id });

    // Delete the person
    await Person.findByIdAndDelete(req.params.id);

    res.json({ message: 'Person and associated documents deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
