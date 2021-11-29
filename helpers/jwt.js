/// creating  helpers file which will help us to find out if the users is authenticate or not.

const expressJwt = require('express-jwt'); // installed (express-jwt) library to provide security for users data 



// protection function whihc help to authenticaet users account
function authJwt(){
    const secret = process.env.secret;
    const api = process.env.API_URL;
    

    return expressJwt({
secret,
algorithms: ['HS256'],
isRevoked: isRevoked
    }).unless({
        path:[
            // this method only allwoing to get data and prevent to post data from users
            {url:/\/public\/uploads(.*)/, method: ['GET' , 'OPTIONS']}, 
           {url:/\/api\/v1\/movies(.*)/, method: ['GET' , 'OPTIONS']}, 
            {url:/\/api\/v1\/categories(.*)/, method: ['GET' , 'OPTIONS']},
        
        `${api}/users/login`,
        `${api}/users/register`,

        ]
    })
}



async function isRevoked(req, payload, done){
    if(!payload.isAaming){
        done(null, true)
    }
    done();
}
module.exports = authJwt;