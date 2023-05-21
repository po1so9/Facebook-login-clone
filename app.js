const express = require('express')
const path = require('path');
const Login = require('./model/model')
const connectDB = require('./db/connection')
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt')
require('dotenv').config();

app = express()
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


const port = 3000;
const home = app.use(express.static(path.join(__dirname,'public')))
app.get('/login', (req,res) => {
    res.send(home);
})



app.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user with the hashed password
      const user = new Login({
        username,
        password: hashedPassword,
      });
      // Save the user to the database
        await user.save();

        res.status(201).json({ message: 'successful login' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to login user' });
    }
});



const start = async () =>{
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`server is listening on port ${port}...`))
    } catch (error) {
        console.log(error)
    }
}

start()