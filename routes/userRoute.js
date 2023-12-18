const express = require('express');
const router = express.Router();
const User=require('../models/user');
const bcrypt=require('bcrypt')

   
   // Route to retrieve all users
   router.get('/', async (req, res) => {
        try {
        const users = await User.find().select('-password -accountType');
        res.status(200).json(users);
        } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve users', error });
        }
   });

   //router to get single user
   router.get('/single/:id', async (req, res) => {
        try {
        const user = await User.findById(req.params.id).select('-password -accountType');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({user,message:"Success"});
        } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve users', error });
        }
   });
   // Route to delete a user by ID
    router.delete('/:id', async (req, res) => {
        try {
        const user = await User.findByIdAndDelete(req.params.id).select('-password -accountType');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
        } catch (error) {
        res.status(500).json({ message: 'Failed to delete user', error });
        }
   });
   module.exports = router;