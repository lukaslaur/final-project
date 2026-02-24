const express = require('express');
const jwt = require('jsonwebtoken');
const User  = require('../models/User');
const router = express.Router();



router.post('/register', async (req, res) => {
    try {
        const {email, password, name} = req.body;
        const existingUser = await User.findOne({where: {email}});
        if (existingUser)
            return res.status(400).json({error: 'Email is already registered'});

        const user = await User.create({email, password, name});

        const token = jwt.sign(
            {
                id: user.id, email: user.email, role: user.role
            }, 
            process.env.JWT_SECRET, {expiresIn: '7d'}
        );
        res.json({
            token,
            user: {id:user.id, email: user.email, name: user.name, role: user.role}
        });
    } catch (error){
        res.status(500).json({error: error.message});
    }
});

router.post('/login', async(req, res)=>{
    try{
        const {email, password} = req.body;
        const user = await User.findOne({where: {email}});
        if(!user)
            return res.status(401).json({error: 'Invalid credentials'});
        if(user.isBlocked)
            return res.status(403).json({error: 'Your account is blocked'});
        const isValid = await user.validatePassword(password);
        if (!isValid)
            return res.status(401).json({error:'Invalid credentials'});
        await user.update({lastlogin: new Date()});
        const token = jwt.sign(
            {id: user.id, email: user.email, role: user.role},
            process.env.JWT_SECRET, {expiresIn: '7d'});
        res.json({
            token,
            user: {id: user.id, email: user.email, name: user.name, role: user.role}
        });
    }
    catch(error){
        res.status(500).json({error: error.message});
    }
});

module.exports = router;

