const {Admin} = require('../models/admin');
const express = require('express');
const router = express.Router();

router.get(`/`, async (req, res) => {
    const adminList = await Admin.find();
    if(!adminList) {
        res.status(500).json({success : false})
    }
    res.send(adminList);
})

router.post(`/`, (req, res) => {
    const admin = new Admin({
        firstName : req.body.firstName,
        secondName : req.body.secondName,
        nhsID : req.body.nhsID,
        image : req.body.image
     
    })

    admin.save().then((createdAdmin=> {
        res.status(201).json(createdAdmin)
    })).catch((err)=>{
        res.status(500).json({
            error: err,
            success : false
        })
    })
})

module.exports= router;