const mongoose = require('mongoose');

const categoryScheme = mongoose.Schema({
    name : {
        type: String,
        required : true
    },
    icon :{
        type: String,
        default : ''
    },
    image: {
        type: String,
        default : '' 
    }
})
// This is for have an id to be more user friendsly
categoryScheme.virtual('id').get(function () {
    return this._id.toHexString();
});
categoryScheme.set('toJSON' , {
    virtuals: true,
});

//Start capital letter the model

exports.Category=  mongoose.model('Category',categoryScheme);