require('dotenv').config()
const bodyParser= require('body-parser')
const express = require('express')
const ejs = require('ejs')
const mongoose = require('mongoose')
const encrypt = require('mongoose-encryption')


const PORT = process.env.PORT || 3000

const app = express()

console.log(process.env.SECRET);

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'))
app.set('view engine', 'ejs')

mongoose.connect('mongodb://localhost:27017/usersDB', {useNewUrlParser: true, useUnifiedTopology:true})

// setting up this schema allows me to encrypt my users data
const userSchema= new mongoose.Schema ({
  email: String,
  password: String
})

//using process.env.SECRET for my enviornment variable
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']})

const User = new mongoose.model('User', userSchema)


app.get('/' , (req,res)=>{
  res.render('home')
})

app.get('/logout' , (req,res)=>{
  res.render('home')
})

app.get('/login',  (req,res)=>{
  res.render('login')
})

app.get('/register' , (req,res)=>{
  res.render('register')
})

app.post('/register', (req,res)=>{

  //creating a new user from the new mongoose model
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save((err)=>{
    if(err){
      console.log(err);
    }else{
      // i want to render the secrets page when the user is registered or logged in
      res.render('secrets')
    }
  });
});

app.post('/login', (req,res)=>{
  const username = req.body.username
  const password = req.body.password

  User.findOne({email: username} , (err, foundUser)=>{
    if(!err){
      if(foundUser){
        if(foundUser.password === password){

          res.render('secrets')
        }
      }
    }else{
      console.log(err);
    }
  });
});



app.listen(PORT, console.log(`server is running on ${PORT}`))
