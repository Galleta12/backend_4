const mongoose = require('mongoose');

const userScheme = mongoose.Schema({
    
    firstName : {
        type: String,
        required : true
    },

    secondName : {
        type: String,
        require : true
    },

    email:{
    
        type: String,
        required: true,
            },
            
    passwordHash:{
        type: String,
        required: true,
             },
    
    age:{
        type: Number,
        required: true,
                 },
    
    gender:{
        type: String,
        required: true,
                  },
    
    address:{
        type: String,
        default: true,
    },
    
    patientHistory:{
        type: String,
        required: true,
                        
    },
    
    isAaming:{
        type: Boolean,
        default: false,
                            
    },

    image:{
          type: String,
         
                                
    },
});


// This is for have an id to be more user friendsly
userScheme.virtual('id').get(function () {
    return this._id.toHexString();
});
userScheme.set('toJSON' , {
    virtuals: true,
});

//Start capital letter the model

exports.User=  mongoose.model('Users', userScheme);
