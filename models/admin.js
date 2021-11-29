const mongoose = require('mongoose');

const adminScheme = mongoose.Schema({
    firstName : {
        type: String,
        required : true
    },
    secondName : {
        type: String,
        require : true
    },
    nhsID: Number,
    image : String
})

// This is for have an id to be more user friendsly
adminScheme.virtual('id').get(function () {
    return this._id.toHexString();
});
adminScheme.set('toJSON' , {
    virtuals: true,
});

//Start capital letter the model

exports.Admin=  mongoose.model('Admins', adminScheme);