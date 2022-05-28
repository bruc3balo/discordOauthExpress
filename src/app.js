//import dotenv and call config
require('dotenv').config();

//invoke express to init app
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

const session = require('express-session');
const passport = require('passport');
const discStrategy = require('./strategies/discordStrategy');
const db = require('./database/database');

db.then(()=> console.log ('Connected to MongoDB.')).catch(err =>console.log(err));

//Routes
app.use(session({
    secret: 'ran',
    cookie: {
        maxAge: 60000 * 60 * 24
    },  
    saveUninitialized: false
}))


//passport
app.use(passport.initialize());
app.use(passport.session());

//Middleware Routes
const authRoute = require('./routes/auth');

app.use('/auth',authRoute);

app.listen(PORT, () => {
    console.log(`Now listening to requests on port ${PORT}`);
});