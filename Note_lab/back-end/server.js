
const express= require('express')
const app = express()

const Note = require('./models/note.js');
const User = require('./models/user.js');

const bodyParser = require('body-parser');
const session=require('express-session')
const MongoStore= require('connect-mongo')
const {isLoggedIn, isAgent} = require('./auth');
const {wrapAsync} = require('./helper');
app.use(bodyParser.json());

const cors= require('cors')
app.use(cors())

require('dotenv').config()
const mongoose= require('mongoose')
const bcrypt = require("bcrypt");
var mongoDB = process.env.ATLAS_CONNECTION
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const sessionSecret = 'make a secret string';

const store = MongoStore.create({
    mongoUrl: mongoDB,
    secret: sessionSecret,
    touchAfter: 24 * 60 * 60
})

//mongoose.set('useFindAndModify', false);

const sessionConfig = {
    store,
    name: 'session',
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
        // later you would want to add: 'secure: true' once your website is hosted on HTTPS.
    }
}

app.use(session(sessionConfig));


// This is middleware that will run before every request
app.use((req, res, next) => {
    // We can set variables on the request, which we can then access in a future method
    req.requestTime = Date.now();
    console.log(req.method, req.path);
    // Calling next() makes it go to the next function that will handle the request
    next();
});

app.use((err, req, res, next) => {
    console.log("Error handling called " + err);
    // If want to print out the error stack, uncomment below
    // console.error(err.stack)
    // Updating the statusMessage with our custom error message (otherwise it will have a default for the status code).
    res.statusMessage = err.message;

    if (err.name === 'ValidationError') {
        res.status(400).end();
    } else {
        // We could further interpret the errors to send a specific status based more error types.
        res.status(500).end();
    }
})


app.get('/api/notes', async function (req,res) {
    console.log("Accessed by user id: " + req.session.userId);

    const notes = await Note.find({agent: req.session.userId});
    console.log( notes);
    res.json(notes);
});

app.get('/api/notes/:id',isLoggedIn, async function (req,res) {
    let id = req.params.id;
    if( mongoose.isValidObjectId(id) ) {
        const noteFind = await Note.findById(id);
        if( noteFind ) {
            res.json(noteFind);
            return;
        }
    }

    console.log("No note with id: " + id);
    res.status(404);
    res.send("No note with id: " + id);
});


app.delete('/api/notes/:id', async function (req,res) {
    const id = req.params.id;
    Note.findByIdAndDelete(id,
        null,
        function (error, result) {
            if (error) {
                console.log("ERROR: " + error);
                res.status(404).send(error.message);
            } else {
                console.log("Deleted successfully: " + result);
                // Status 204 represents success with no content
                // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204
                res.sendStatus(204);
            }
        });
});

app.put('/api/notes/:id', async function (req,res) {
    let id = req.params.id;
    console.log("PUT with id: " + id + ", body: " + JSON.stringify(req.body));
    // This below method automatically saves it to the database
    Note.findByIdAndUpdate(id,
        {'id': req.body.id, "body": req.body.body, "time": req.body.time, "tags": req.body.tags},

        function (err, result) {
            if (err) {
                console.log("ERROR: " + err);
                res.send(err);
            } else {
                // Status 204 represents success with no content
                // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204
                res.sendStatus(204);
            }
        });
});


// app.post('/api/users', async function (req,res) {
//     console.log("Posted with body: " + JSON.stringify(req.body));
//
//     const newUser = new User({
//         name: req.body.name,
//         email:req.body.email,
//         password: req.body.password,
//         colorScheme: req.body.colorScheme,
//     })
//
//     // Calling save is needed to save it to the database given we aren't using a special method like the update above
//     await newUser.save();
//     req.session.userId = newUser._id;
//     res.json(newUser);
// });

app.post('/register', wrapAsync(async function (req, res) {
    const newUser = new User({

        name: req.body.name,
        email:req.body.email,
        password: req.body.password,
        colorScheme: req.body.colorScheme,
        profile_url:'http://res.cloudinary.com/abhishekgaire/image/upload/v1652121601/rzfrtvnxr7syf5yecshs.jpg',
    })
    await newUser.save();
    req.session.userId = newUser._id;

    res.json(newUser);

}));
var findAndValidate = async function (email, password) {
    //console.log(this)
    const user = await User.findOne({email});
    if(!user) {
        return false;
    }
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : false;
}

app.post('/login', wrapAsync(async function (req, res) {
   let email=req.body.email
     let password= req.body.password


    console.log(email);
    const user = await findAndValidate(email, password);
    console.log('user='+user)

    if (user) {
        req.session.userId = user._id;
        //res.sendStatus(204);
        //res.json({agent:req.session.userId, status:204, currentUser:user});
        res.json({agent:req.session.userId, status:204, name:user.name, email:user.email, colorScheme:user.colorScheme, userId:user._id, profile_url: user.profile_url});
        console.log('logged in' +user._id)
    } else {
        console.log(' not logged in')
        res.sendStatus(401);
    }
}));

app.post('/logout', wrapAsync(async function (req, res) {
    req.session.userId = null;
    res.sendStatus(204);
    console.log('logged out')
}));

app.get('/api/users', async function (req,res) {
    const user = await User.find({});
    res.json(user);
});

app.get('/api/users/:id', async function (req,res) {
    let id = req.params.id;

    if( mongoose.isValidObjectId(id) ) {

        const userFind = await User.findById(id);
        if( userFind ) {
            res.json(userFind);
            return;
        }
    }

    console.log("No user with id: " + id);
    res.status(404);
    res.send("No user with id: " + id);
});


app.delete('/api/users/:id', async function (req,res) {
    const id = req.params.id;
    User.findByIdAndDelete(id,
        null,
        function (error, result) {
            if (error) {
                console.log("ERROR: " + error);
                res.status(404).send(error.message);
            } else {
                console.log("Deleted successfully: " + result);
                // Status 204 represents success with no content
                // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204
                res.sendStatus(204);
            }
        });
});

app.put('/api/users/:id', async function (req,res) {
    let id = req.params.id;
    console.log("PUT with id: " + id + ", body: " + JSON.stringify(req.body));
    // This below method automatically saves it to the database
    User.findByIdAndUpdate(id,
        {'xid': req.body.id, "name": req.body.name, "email": req.body.email, "colorScheme": req.body.colorScheme,"profile_url":req.body.profile_url},
        function (err, result) {
            if (err) {
                console.log("ERROR: " + err);
                res.send(err);
            } else {
                // Status 204 represents success with no content
                // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204
                res.sendStatus(204);
            }
        });
});

app.post('/api/notes', async function (req,res) {


    const newNote = new Note({
        _id: req.body.id,
        id:req.body.id,
        body: req.body.body,
        time: req.body.time,
        tags: req.body.tags,
        agent: req.session.userId

       
    })
    console.log("Posted with body: " + JSON.stringify(newNote));
    // Calling save is needed to save it to the database given we aren't using a special method like the update above
    await newNote.save();
    res.json(newNote);
});





const PORT = process.env.PORT || 4000
app.listen(PORT, ()=>{
    console.log(`Successfully served on port: ${PORT}.`);
})
