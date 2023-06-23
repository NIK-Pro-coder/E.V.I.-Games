/* index.js 2023-06-17 */

require('dotenv').config();

// require and instantiate express
//    const app = require('express')()
// require and instantiate express
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const app = express();

// initializes as a function handler for the HTTP server
const http = require('http').createServer(app);

// This will hold the users and authToken related to users
const authTokens = {};

const users = [
    // These are the authorised users (level/password combinations)
    {
        level: 'level1',
        password: process.env.PASSWORD1
    },
    {
        level: 'level2',
        password: process.env.PASSWORD2
    },
    {
        level: 'level3',
        password: process.env.PASSWORD3
    }
];

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}


const generateAuthToken = () => {
    return crypto.randomBytes(30).toString('hex');
}

// to support URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.use((req, res, next) => {
    const authToken = req.cookies['AuthToken'];
    req.user = authTokens[authToken];
    next();
});

// define the folder to serve with static content
app.use(express.static(__dirname + '/'));
// set the view engine to ejs
app.set('view engine', 'ejs')

// index page
app.get('/', function(req, res) {
  res.render('index', {
    name : "E.V.I. Games",
    navlink : "home"
  });
});

// games page
app.get('/games', function(req, res) {
  res.render('games', {
    name : "List of Games",
    navlink : "games"
  });
});

// recover page
app.get('/recover', function(req, res) {
  res.render('recover', {
    name : "Recover Cartridges",
    navlink : "recover"
  });
});

// login page
app.get('/login', function(req, res) {
  res.render('login', {
    name : "Login",
    navlink : "login"
  });
});

app.post('/login', (req, res) => {
    const { level, password } = req.body;
    const hashedPassword = getHashedPassword(password);

    const user = users.find(u => {
        return u.level === level && hashedPassword === u.password
    });

    if (user) {
        const authToken = generateAuthToken();

        // Store authentication token
        authTokens[authToken] = level;

        // Setting the auth token in cookies
        res.cookie('AuthToken', authToken);

        res.cookie('Level', level);

        // Redirect user to the protected page
        if (level == 'level1') {
            res.redirect('/protected');
        } else if (level == 'level2') {
            res.redirect('/protected2');
        } else if (level == 'level3') {
            res.redirect('/protected3');
        };
        return;
    } else {
        res.render('login', {
            message: 'Invalid username or password',
            messageClass: 'Invalid username or password',
            name : "Login",
            navlink : "login"
        });
    }
});

// protected page
app.get('/protected', (req, res) => {
    if (req.user && req.cookies.Level == 'level1') {
        res.render('protected', {
            name : "Protected Page",
            navlink : "protected"
        });
    } else if (req.user && req.cookies.Level == 'level2') {
        res.render('protected', {
            name : "Protected Page",
            navlink : "protected"
        });
    } else if (req.user && req.cookies.Level == 'level3') {
        res.render('protected', {
            name : "Protected Page",
            navlink : "protected"
        });
    } else {
        res.render('login', {
            message: 'Please login to continue',
            messageClass: 'alert-danger',
            name : "Login",
            navlink : "login"
        });
    }
});

// protected2 page
app.get('/protected2', (req, res) => {
    if (req.user && req.cookies.Level == 'level1') {
        res.render('login', {
            message: 'Incorrect security level',
            messageClass: 'Incorrect security level',
            name : "Login",
            navlink : "login"
        });
    } else if (req.user && req.cookies.Level == 'level2') {
        res.render('protected2', {
            name : "Protected2 Page",
            navlink : "protected2"
        });
    } else if (req.user && req.cookies.Level == 'level3') {
        res.render('protected2', {
            name : "Protected2 Page",
            navlink : "protected2"
        });
    } else {
        res.render('login', {
            message: 'Please login to continue',
            messageClass: 'alert-danger',
            name : "Login",
            navlink : "login"
        });
    }
});

// protected3 page
app.get('/protected3', (req, res) => {
    if (req.user && req.cookies.Level == 'level3') {
        res.render('protected3', {
            name : "Protected3 Page",
            navlink : "protected3"
        });
    } else if (req.user) {
        res.render('login', {
            message: 'Incorrect security level',
            messageClass: 'Incorrect security level',
            name : "Login",
            navlink : "login"
        });
    } else {
        res.render('login', {
            message: 'Please login to continue',
            messageClass: 'alert-danger',
            name : "Login",
            navlink : "login"
        });
    }
});

// -------------------------------------------------------------------
// run your application on PORT specified in env file
app.listen(process.env.PORT, () => {
    console.log("Server is running on port : " + process.env.PORT)
});
