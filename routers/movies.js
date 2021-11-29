const {Movie} = require('../models/movie');
const express = require('express');
const { Category } = require('../models/category');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

// validating file types to only allow image uploads
const FILE_TYPE_MAP = {
'image/png': 'png',
'image/jpeg': 'jpeg',
'image/jpg': 'jpg'

}


// for storing files to disk
const storage = multer.diskStorage({ 
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if(isValid) {
            uploadError = null
        }
        
      cb(uploadError, 'public/uploads')
    },
    filename: function (req, file, cb) {

      const fileName = file.originalname.split(' ').join('-');
      const extension = FILE_TYPE_MAP[file.mimetype];
      cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
  })
  
  const uploadOptions = multer({ storage: storage })

// get all movies
//http://localhost:3000/api/v1/movies?categories=618413f17f39703bde71ab7c url postman for filter
router.get(`/`, async (req, res) => {
    let filter = {};
    if(req.query.categories){
        filter = {category: req.query.categories.split(',')};
    }

    const movieList = await Movie.find(filter).populate('category');
    // use this to limit the data that will get the api
    //await Movie.find().select('name image -_id');
    
    if(!movieList) {
        res.status(500).json({success : false})
    }
    res.send(movieList);
})
// get movie by id
router.get(`/:id`, async (req, res) => {
    const movie = await Movie.findById(req.params.id).populate('category');
    if(!movie) {
        res.status(500).json({success : false})
    }
    res.send(movie);
})


// add movies
router.post(`/`, uploadOptions.single('image'), async (req, res) =>{
    const category = await Category.findById(req.body.category);
    if (!category) 
    return res.status(400).send('Invalid Category')

    const file = req.file;
    // checks if image has been uploaded 
    if (!file) return res.status(400).send('No image in the request')


      const fileName = req.file.fileName
      const basePath = `${req.protocol}://${req.get('host')}/public/upload/`;
    let movie = new Movie({
        name : req.body.name,
        details : req.body.details,
        timeFlash: req.body.timeFlash,
        image: `${basePath}${fileName}`, //"http://localhost:3000/public/upload/image-2323232"
        //image: req.body.image,
        category: req.body.category,

    })
    movie = await movie.save();

    if(!movie)
    return res.status(500).send('The movie cannot be created');

    res.send(movie);
    

})
// update movies
router.put('/:id', uploadOptions.single('image'), async (req, res)=> {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Movie Id');
    }
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid Category');

    // checks if user uploaded an image and sends image url to database
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(400).send('Invalid Movie!');

    const file = req.file;
    let imagepath;

    if(file) {
        const fileName = req.file.fileName
      const basePath = `${req.protocol}://${req.get('host')}/public/upload/`;
      imagepath = `${basePath}${fileName}`
    } else {
        imagepath = movie.image; // old image, uncommitted changes
    }


    
    
    const updatedMovie = await Movie.findByIdAndUpdate(
        req.params.id,
        {
            name : req.body.name,
            details : req.body.details,
            timeFlash: req.body.timeFlash,
            image: imagepath,
            category: req.body.category
        },
        { new: true}
        
    )

    if(!updatedMovie)
    return res.status(400).send('the movie cannot be updated!')

    res.send(updatedMovie);
})
// delete movies
router.delete('/:id', (req, res)=>{
    Movie.findByIdAndRemove(req.params.id).then(movie =>{
        if(movie) {
            return res.status(200).json({success: true, message: 'the movie is deleted!'});
        } else {
            return res.status(404).json({success: false , message: "movie not found!"});
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})
// get count of movies and this is the url http://localhost:3000/api/v1/movies/get/count
router.get(`/get/count`, async (req, res) => {
    const movieCount =  await Movie.countDocuments((count) => count ).clone();

    if (!movieCount) {
        res.status(500).json({ success: false });
    }
    res.send({
        movieCount: movieCount,
    });
})

// allows multiple image upload
router.put(
    '/gallery-images/:id',
     uploadOptions.array('images', 10), 
     async (req, res)=> {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send('Invalid Movie Id');
        }
        const files = req.files
        let imagesPaths = [];
        const basePath = `${req.protocol}://${req.get('host')}/public/upload/`;
        //check if there are files
        if(files) {
        files.map(file =>{
            imagesPaths.push(`${basePath}${file.fileName}`);
        })
        }



 

        const movie = await Movie.findByIdAndUpdate(
            req.params.id,
            {
             images: imagesPaths
            },
            { new: true}
            
        )

        if(!movie)
        return res.status(500).send('the movie cannot be updated!')
    
        res.send(movie);




}
)



module.exports= router;