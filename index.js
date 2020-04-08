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
server.use(express.json()) //middleware that does something we need
//express handles all the requests

// Read data
server.get('/', (req, res) => {

    // this route handler does everything the above code does
    res.json({ message: 'hello, world' }); 
})

server.get('/users', (req, res) => {
    const users = db.getUsers();
    res.json(users);
})

server.get('/users/:id', (req, res) => { //the specified request (:id here) will be saved as a variable
    const userId = req.params.id
    const user = db.getUserById(userId);

    //logic to make sure user value exists
    if(user) { // if truthy stmt
        res.json(user)
    } else {
        res.status(404).json({ // send message back to client
            message: 'User Not Found'
        })
    }

})

//create a new user. can have multiple route handlers on the same end point as long as the methods are different
server.post('/users', (req, res) => {
    if(!req.body.name) {
        return res.status(404).json({
            message: 'Need a user name!'
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
//     if(!user) {
//         res.status(404).json({
//             message: 'User Not Found'
//         })
//     } 
//     const newData = db.updateUser();
// })
    const user = db.getUserById(req.params.id)
    if(user) {
      const updatedUser = db.updateUser(user.id, {
                name: req.body.name || user.name,
        })
        res.json(updatedUser)
    } else {
        res.status(404).json({
            message: 'User Not Found'
        })
    }

server.delete('/users/:id', (req, res) => {
    //verify user exists
    const user = db.getUserById(req.params.id);
    if(user) {
        db.deleteUser(user.id);
        //return success message. 204 is a successful empty response
        res.status(204).end();
    } nelse {
        res.status(404).json({
            message: 'User Not Found'
        })
    }
})

server.listen(8080, () => {
    console.log('server started at 8080');
})