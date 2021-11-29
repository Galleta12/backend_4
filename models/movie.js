const mongoose = require('mongoose');

const movieScheme = mongoose.Schema({
    name : {
        type: String,
        required : true
    },
    details: {
        type: String,
        required : true
    },
    timeFlash:{
        type: String,
        required : true
    },
    image: {
        type: String,
        default : '' 
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Category',
        required : true
    },
    
    images: [{
        type : String,
        default : ''
    }],

    dateMovie: {
        type: Date,
        default: Date.now,
    }
})

// This is for have an id to be more user friendsly
movieScheme.virtual('id').get(function () {
    return this._id.toHexString();
});
movieScheme.set('toJSON' , {
    virtuals: true,
});


//Start capital letter the model

exports.Movie = mongoose.model('Movies', movieScheme);

