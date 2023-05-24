const express = require('express')
const path = require('path');
const Register = require('./model/model')
const connectDB = require('./db/connection')
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
const multer = require('multer');
require('dotenv').config();

app = express()
const upload = multer();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.set('view engine','ejs'); 

app.engine('ejs', require('ejs').__express);

app.use(express.static(path.join(__dirname,'public')))

app.get('/login', (req, res) => {
    res.render('index');
});

app.get('/register', (req, res) => {
    res.render('signup');
});



app.post('/register', upload.none(), async (req, res) => {
    const dd =req.body.dd;
    const mm =req.body.mm;
    const yyyy =req.body.yyyy;

    const dateofbirth = new Date(yyyy, mm-1, dd);
    // console.log(req.body.firstname)
    // console.log(req.body.surname)
    // console.log(req.body.mobile_email)
    // console.log(req.body.password)
    // console.log(dateofbirth);
    //  console.log(req.body.gender)
 

    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
  
      // Create a new user with the hashed password
      const user = new Register({
        firstname: req.body.firstname,
        surname: req.body.surname,
        mobile_email: req.body.mobile_email,
        dob : dateofbirth,
        gender: req.body.gender,
        password: hashedPassword,
      });
      // Save the user to the database
        await user.save();

        //res.status(201).json({ message: 'successful Registration' });
        res.redirect('/login');
    } catch (error) {
        res.status(500).json({ error: 'Failed to Register user' });
    }
 });


const port = 3000;
const start = async () =>{
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`server is listening on port ${port}...`))
    } catch (error) {
        console.log(error)
    }
}

start()