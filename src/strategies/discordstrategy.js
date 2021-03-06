const discStrategy = require('passport-discord').Strategy;
const passport = require('passport');
const discordUser = require('../models/DiscordUser');

passport.serializeUser((user,done) => {
    done(null,user.id);
});

passport.deserializeUser(async(id,done) => {
    const user = await discordUser.findById(id);
    if(user) done(null,user);
});

passport.use(new discStrategy({

    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CLIENT_REDIRECT,
    scope: ['identify','guilds']

},async (_accessToken, _refreshToken, profile, done) => {
    try {
        const user = await discordUser.findOne({discordId: profile.id});
        console.log(`discord user is ${user}`);
        if(user) {
            done(null,user);
        } else {
            const newUser = await discordUser.create({
                discordId: profile.id,
                username: profile.username
            });

            
            const savedUser = await newUser.save();
            console.log(`saved user is ${savedUser}`);
            done(null, savedUser);
        }

        
    } catch (error) {
        console.log(error);
        done(error,null);
    }
}));