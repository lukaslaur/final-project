const express = require('express');
const {models} = require('../models');
const auth = require('../middleware/auth');
const router = express.Router();

const {Inventory, User} = models;

router.get('/', async (req, res) => {
    try{
        const inventories = await Inventory.findAll({
            include: [{model: User, as: 'owner', attributes: ['id', 'name', 'email']}],
            order: [['createdAt', 'DESC']]
        });
        res.json(inventories);
    }catch (error){
        res.status(500).json({error: error.message});
    }
})

router.get('/:id', async (req, res) =>{
    try {
        const inventory = await Inventory.findByPk(req.params.id, {
            include: [
                {model: User, as:'owner', attributes: ['id', 'name', 'email']},
                {model: User, as: 'writers', attributes: ['id', 'name', 'email']}
            ]
        });
        if(!inventory){
            return res.status(404).json({error: 'Inventory not found'});
        }
        res.json(inventory);

    }catch (error){
        res.status(500).json({error: error.message});
    }
});

router.post('/', auth, async(req, res) => {
    try{
        const {title, description, category, isPublic} = req.body;
        const inventory = await Inventory.create({
            title,
            description,
            category,
            isPublic,
            ownerID: req.user.id
        });
        res.status(201).json(inventory);
    }catch (error){
        res.status(500).json({error: error.message});
    }
})

router.put('/:id', auth, async (req, res) =>{
    try{
        const inventory = await Inventory.findByPk(req.params.id);
        if (!inventory){
            return res.status(404).json({error: 'Inventory not found'});
        }
        if (inventory.ownerID !== req.user.id && req.user.role !=='admin'){
            return res.status(403).json({error: 'Not authorized'});
        }
        if (req.body.version && inventory.version !== req.body.version){
            return res.status(409).json({error: 'Inventory was modified by another user'});
        }
        await inventory.update({
            ...req.body,
            version:inventory.version +1
        });
    }catch (error){
        res.status(500).json({error: error.message});
    }
})

router.delete('/:id', auth, async (req, res) => {
    try{
        const inventory = await Inventory.findByPk(req.params.id);
        if (!inventory){
            return res.status(404).json({error: 'Inventory not found'});
        }
        if (inventory.ownerID !== req.user.id && req.user.role !== 'admin'){
            return res.status(403).json({error: 'Not authorized'});
        }
        await inventory.destroy();
        res.json({message: 'Inventory deleted'});
    }catch(error){
        res.status(500).json({error: error.message});
    }
})

module.exports = router;