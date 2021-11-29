const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');


app.use(cors());
app.options("*", cors());


//Middleware or bodyparser not use anymore
app.use(express.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
app.use(errorHandler);


// routes
const moviesRouter = require('./routers/movies');
const usersRouter = require('./routers/users');
const adminsRouter = require('./routers/admins');
const categoriesRouter = require('./routers/categories');

const api = process.env.API_URL;

// middleware of routers
app.use(`${api}/movies`, moviesRouter);
app.use(`${api}/users`, usersRouter);
app.use(`${api}/admins`, adminsRouter);
app.use(`${api}/categories`, categoriesRouter);


//connect to database
mongoose.connect(process.env.Connection_DB) 
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // dbName: 'epi_app',
// })
.then(()=>{
    console.log('Database Connection is ready for real? I will try it');
})
.catch((err)=>{
    console.log('err');
});

// //Server Development
// app.listen(3000, ()=>{
//     console.log('server is running http://localhost:3000');
// });

// Production
var server = app.listen(process.env.PORT || 3000, function() {
    var port = server.address().port;
    console.log('Express is working on port' + port);

});