const {User} = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // installed bcrypt library to hash password 
const jwt = require('jsonwebtoken'); // installed jsonWebToken libray cuz server respond to jsonwebtoken and it will secure as  well 
// to get list of users 
router.get(`/`, async (req, res) => {
    const userList = await User.find().select('-passwordHash');  // using select function to hide password filed when using API (Postman);
    if(!userList) {
        res.status(500).json({success : false})
    }
    res.send(userList);
})

// this router created for admin to remove or add user 
router.post(`/`, (req, res) => {
    const user = new User({
       
        firstName : req.body.firstName,
        secondName : req.body.secondName,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password,10),
        age : req.body.age,
        gender : req.body.gender,
        address : req.body.address,
        patientHistory : req.body.patientHistory,
        isAaming: req.body.isAaming,
        image : req.body.image,

    })

    user.save().then((createdUser=> {
        res.status(201).json(createdUser)


    })).catch((err)=>{
        res.status(500).json({
            error: err,
            success : false
        })
    })
})






// to get singel users
router.get('/:id', async(req, res)=>{

    const user = await User.findById(req.params.id).select('-passwordHash');  // using select function to hide password filed with postman 

    if(!user){
    res.status(500).json({message:'the user id con not be found'})
    }
    res.status(200).send(user);

})

 ///////// methods for registration 
 router.post(`/register`, async (req, res) => {
    let user = new User({

        firstName : req.body.firstName,
        secondName : req.body.secondName,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password,10),
        age : req.body.age,
        gender : req.body.gender,
        address : req.body.address,
        patientHistory : req.body.patientHistory,
        isAaming: req.body.isAaming,
        image : req.body.image,
    })
    user = await user.save();

    if(!user)
    return res.status(400).send('the user cannot be created')
    
    res.send(user)
  
})


// checking users by email and passowrd 
router.post('/login', async(req, res) =>{
 const user = await User.findOne({email: req.body.email})
 const secret = process.env.secret;
    if(!user){
        return res.status(400).send('the user not found');
    }
    // comparing passowrd wiz username by using compareSync function to decode the passowrd
    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)){
        const token = jwt.sign({    
            userId: user.id,
            isAaming:user.isAaming
        }, 
        secret,
        //set expiration date for token // (5d) refer to 5 days 
        {expiresIn: '1d'}

      
        )
        res.status(200).send({user:user.email , token: token})
    } else{

        res.status(400).send('password is incorrect !');
    }       
    


})

// delete users
router.delete('/:id', (req, res)=>{
    User.findByIdAndRemove(req.params.id).then(user =>{
        if(user) {
            return res.status(200).json({success: true, message: 'the user is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "user not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})



// count number of users for app 
router.get(`/get/count`, async (req, res) => {
    const userCount =  await User.countDocuments((count) => count ).clone();

    if (!userCount) {
        res.status(500).json({ success: false });
    }
    res.send({
        userCount: userCount,
    });
})


module.exports= router;
