// const express = require('express');
// const path = require('path');
// const cors = require('cors');
// const jwt = require('jsonwebtoken');
// const { User } = require('./models/User.js');
// // require('dotenv').config();
// // const connectDB = require('./configs/dbConns.js');


// // Establish connection to MongoDB
// // connectDB();

// const app = express();
// const clientSide = path.join(__dirname, '../client_side/dist');

// app.use(express.static(clientSide));
// app.use(cors({
//     origin: 'http://localhost:5173',
// }));
// app.use(express.json());

// console.log(process.env.ACCESS_TOKEN_SECRET);

// // Login route
// app.post('/signin', (req, res) => {
//     console.log(req.body);
//     const { email, password } = req.body;

//     // Check if the username and password match any user in the users array
//     const user = User.find(user => user.email === email && user.password === password);

//     if (user) {
//         // If user is found, send a success response
//         const accessToken = jwt.sign(
//             { email: user.email },
//             access,
//             { expiresIn: '30m' } // Change token expiry time to 30 minutes
//         );
//         return res.status(200).json({ accessToken });
//     } else {
//         // If user is not found, send an error response
//         return res.status(401).json({ error: 'Invalid username or password' }); // Add return statement
//     }
// });

// // Get user info route
// app.get('/users', (req, res) => {
//     try {
//         // Send the users object as a JSON response
//         return res.status(200).json(users);
//     } catch (error) {
//         // If an error occurs, handle it properly
//         console.error('Error fetching user data:', error);
//         return res.status(500).json({ error: 'Internal server error' }); // Add return statement
//     }
// });

// // Serve index.html for any other requests
// app.get('*', (req, res) => {
//     console.log(req.url);
//     return res.sendFile(path.join(clientSide, 'index.html'));
// });


// app.listen(3000, () => {
//     console.log(`Server is running on port 3000...`);
//   });

const http = require('http');
const path = require('path');
const {readFile} = require('fs');

const product = [{
    name: 'Black jean',
    category: 'clothing',
    color: 'red'
}];



const server = http.createServer((req, res) => {
  
    if(req.url === '/'){
        const filePath = path.join(__dirname, 'public.html');
        readFile(filePath, (err, result) => {
            if(err){
                res.writeHead(500, 'Content-Type : text/plain');
                res.end('internal server error 500');
            }else{
                res.writeHead(200, 'Content-Type : text/html');
                res.end(result);
            }
        })

    }else if (req.url === '/product' && req.method === 'GET') {
        // Setting the header to indicate JSON response
        res.setHeader('Content-Type', 'application/json');
    
        // Convert the product data to JSON and send it as the response
        res.end(JSON.stringify(product));
    
        // Log the action to the console for debugging
        console.log('Product data sent');
      }else if (req.url === '/product' && req.method === 'POST') {
        let body = ''

        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            product.push(JSON.parse(body));
            res.writeHead(201, 'Content-Type: application/json');
            res.end(JSON.stringify(
                {
                    message: 'product was successfully added',
                    data: body
                },
            ));
            console.log(product)

        })

      }
});
server.listen('3000', () => {
    console.log("server listening at port 3000");
});