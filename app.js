const express = require('express')
const path = require('path');
const Register = require('./model/model')
const connectDB = require('./db/connection')
var bodyParser = require('body-parser');
const session = require('express-session');
const mongoDBSession = require('connect-mongodb-session')(session);
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

const isAuth = (req,res,next)=>{

    if(req.session.isAuth){
        next();
    }
    else {
        res.redirect('/login');
    }
    // if(req.session.user){
    //     next();
    // }
}

app.get('/login', (req, res) => {
    res.render('index');
});

app.get('/register', async (req, res) => {
    res.render('signup');
});


const store = new mongoDBSession({
    uri: process.env.MONGO_URI,
    collection: 'session'
})

app.use(
    session({
        secret: "MYSECRET",
        resave: false,
        saveUninitialized: false,
        store: store
        
    })
    );
    
app.get('/',isAuth, async (req,res)=>{
    // const user = req.session.user;
    // console.log(user);
    const user = req.session.user;
    // console.log(user.mobile_email);
    const User = await Register.findOne({mobile_email:user.mobile_email});
    // console.log(User);
    // console.log(user)
    res.render('user', {User});
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
    const email = req.body.mobile_email;
    let alreadyExist = await Register.findOne({email});
    if(alreadyExist) return res.redirect('/register')
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
            req.session.user = {
                mobile_email: email_phone,
              };
            
            // res.render('user', {user})
            req.session.isAuth = true;
            res.redirect('/')

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

app.post('/logout', (req,res)=>{
    req.session.destroy((err)=>{
        if(err) throw err;
        res.redirect('/login')
    })
})

// app.get(`login/user/:username`, (req, res)=>{
//     const username = req.user;
//     // Register.findOne({mobile_email:username}, (err,user)=>{
//     //      console.log(user)
//     // })
//     console.log(username)
// });




port = process.env.PORT || 5000
const start = async () =>{
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`server is listening on port ${port}...`))
    } catch (error) {
        console.log(error)
    }
}

start()