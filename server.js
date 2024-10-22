
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = require('express')();
require('dotenv').config();
const Expense = require('./models/Expense');

// Middleware
app.use(express.json());
app.use(cors());

// Default route
app.get('/expenses', async(req, res) =>{

    // res.send('Expense Tracker API is running');

    try{
        const expense = await Expense.find();
        res.json(expense);
    }catch (err) {
      console.error(err);
      
        res.status(500).send('Server Error');
    }

});

// POST a new expense
app.post('/expenses', async (req, res) => {
    const { amount, category, description } = req.body;
    try {
      const newExpense = new Expense({ amount, category, description });
      await newExpense.save();
      res.json(newExpense);
    } catch (err) {
      res.status(500).send('Server Error');
    }
  });
  
  // PUT (Edit an expense)
  app.put('/expenses/:id', async (req, res) => {
    const { amount, category, description } = req.body;
    try {
      const updatedExpense = await Expense.findByIdAndUpdate(
        req.params.id,
        { amount, category, description },
        { new: true }
      );
      res.json(updatedExpense);
    } catch (err) {
      res.status(500).send('Server Error');
    }
  });
  
  // DELETE an expense
  app.delete('/expenses/:id', async (req, res) => {
    try {
      await Expense.findByIdAndDelete(req.params.id);
      res.json({ msg: 'Expense deleted' });
    } catch (err) {
      res.status(500).send('Server Error');
    }
  });


mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Mongo DB connected'))
    .catch(err => console.log(err));

// Start the server

const PORT =process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on the port ${PORT}`));
