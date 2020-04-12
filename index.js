// Creating a Web Server
// Import dependency from Node
// 'Require' is syntax that 'imports' a 3rd party library

// const http = require('http');

// //takes a single cb as the param. this f() will run everytime a request is made to the server
// // the cb takes two parameters provided by the http library
// // this is how to do it manually w/o a framework

// const server = http.createServer((request, response) => { // req,res almost always seen together. 
//     // 3 items being returned:  status code, header(content type), body

//      // 200 is the code for successful response, no issues
//      response.statusCode = 200 
//      //explains to the browser what the content type is, i.e. json, html etc
//      response.setHeader('Content-Type', 'application/json');
     
//      // client is now expecting some JSON, send it out
//      response.write(JSON.stringify({ message: 'hello, world' }));

//      // send the response off
//     response.end();
// });

// // start the server & give it a port; if running locally can be run on any port between 2000-9000. Certain others are reserved
// server.listen(8080, () => { //cb f() is the 2nd param and runs when the server is started
//     console.log('server started at port 8080'); //message logged to terminal not browser. Node is running idependently from the browser
// });

const express = require('express');
const db = require('./database.js');

//creates our server instance
const server = express();

//middleware that does something we need
//express handles all the requests
server.use(express.json()); 


//CRUD operations and server endpoints 

// Read data
server.get('/', (req, res) => {
    // this route handler does everything the above code does
    res.json({ message: 'hello, world' }); 
})

server.get('/users', (req, res) => {
    const users = db.getUsers();
    if(user) {
    res.status(200).json(users);
    } else {
        res.status(500).json({
            message: "The users information could not be retrieved.",
        })
    }
})

//the specified request (:id here) will be saved as a variable
server.get('/users/:id', (req, res) => { 
    const userId = req.params.id
    const user = db.getUserById(userId);
    //logic to make sure user value exists 
    // if truthy stmt
    if(user) { 
        res.json(user)
    } else {
        res.status(404).json({ 
            // send message back to client
            message: "The user information could not be retrieved." ,
        })
    }
})

//create a new user. can have multiple route handlers on the same end point as long as the methods are different
server.post('/users', (req, res) => {
    //error message to make sure the req is complete
   if(!req.body.name) {
       return res.status(404).json({
           message: "Please provide name and bio for the user." ,
        })
    }  
    const newUser = db.createUser({
         name: req.body.name,
    })
    // send the new info back to the client
    res.status(201).json(newUser);
})

//Update specific user
server.put('/users/:id', (req, res) => {
    if(!user) {
        res.status(404).json({
            message: "The user with the specified ID does not exist.",
        })
    } 
//     const newData = db.updateUser();
// })
    const user = db.getUserById(req.params.id)
    if(user) {
      const updatedUser = db.updateUser(user.id, {
                name: req.body.name || user.name,
         })
        res.status(200).json(updatedUser)
    } else {
      if(!req.body.name) {
            return res.status(404).json({
                message: "Please provide name and bio for the user." ,
            })
      } else {
          if(!req.body.name || !user.name) {
              return res.status(500).json({
                  message: "The user information could not be modified.",
              })
          }
      }
    } 
})  

server.delete('/users/:id', (req, res) => {
    //verify user exists
    const user = db.getUserById(req.params.id);
    if(user) {
        db.deleteUser(user.id);
        //return success message. 204 is a successful empty response
        res.status(204).end();
    } else {
        res.status(404).json({
            message: "The user with the specified ID does not exist." ,
        })
     } else {
         if(!user.id) {
             res.status(500).json({
                 message: "The user could not be removed.",
             })
         }
     }
})

server.listen(8080, () => {
    console.log('server started at 8080');
});