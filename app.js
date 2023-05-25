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

app.get('/register', async (req, res) => {
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
        res.redirect('/register');
        res.status(500).json({ error: 'Failed to Register user' });
    }
 });


 app.post('/login', upload.none(), async (req,res)=>{

    try{
    const email_phone = req.body.email_phone;
    //console.log(email_phone);
    const pass = req.body.pass;
    // console.log(pass)
    const user = await Register.findOne({mobile_email:email_phone});
    //console.log(user);
    // const passwordMatch = await bcrypt.compare(pass, user.password);
    // console.log(user.password)
    if(user){
    const passwordMatch = await bcrypt.compare(pass, user.password)
        .then(result => {
            //console.log(result)
            return result;
        })
        .catch(err => {
            console.log(err)
        })
        if (passwordMatch) {
            res.render('user', {user})
            //console.log(user);
            //res.status(200).send(user);
            // res.redirect(`/login/user/${user.firstname}${user.surname}`)
        }
        else{
            res.status(401).send('Invalid password');
        }
    }
    else{
        console.log("Invalid username or password");
        res.status(500).send('Invalid username or password');
    }
} catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
}
});

// app.get(`login/user/:username`, (req, res)=>{
//     const username = req.user;
//     // Register.findOne({mobile_email:username}, (err,user)=>{
//     //      console.log(user)
//     // })
//     console.log(username)
// });




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