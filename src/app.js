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
const path = require('path'); 

db.then(()=> console.log ('Connected to MongoDB.')).catch(err =>console.log(err));

//Routes
const authRoute = require('./routes/auth');
const dashboardRouter = require('./routes/dashboard');

app.use(session({
    secret: 'ran',
    cookie: {
        maxAge: 60000 * 60 * 24
    },  
    saveUninitialized: false,
    resave: false,
    name: 'discord-oauth'
}))

//viewengine
app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));

//passport
app.use(passport.initialize());
app.use(passport.session());

//Middleware Routes
app.use('/auth', authRoute);
app.use('/dashboard', dashboardRouter);

app.get('/',(req,res) => {
    res.render('home', {
        users: [
            {name: 'Raps', email : 'raps@gmail.com'},
            {name: 'Ajey', email: 'ajey@gmail.com'},
            {name: 'Balo', email: 'diab@gmail.com'},
            {name: 'Chuckles', email : 'phanom@gmail.com'},
        ]
    }); 
});

app.listen(PORT, () => {
    console.log(`Now listening to requests on port ${PORT}`);
});