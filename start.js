const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const compression = require('compression');
const lusca = require('lusca');
const session = require('express-session');


dotenv.config({ path: 'secrets.env'})

// http or https
const secureTransfer = (process.env.BASE_URL.startsWith('https'));

// Controllers
const userController = require('./controllers/user.js');

// Create exrpess server and configure
const app = express();
app.set('host', '0.0.0.0');
app.set('port', process.env.PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    name: 'basicCookie',
    cookie: {
        maxAge: 1209600000,
        secure: secureTransfer
    }
}));
app.use(lusca.csrf());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.disable('x-powered-by');
app.use('/', express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

/**
 * 
_______      ___   _____  _____  _________  ________   ______   
|_   __ \   .'   `.|_   _||_   _||  _   _  ||_   __  |.' ____ \  
  | |__) | /  .-.  \ | |    | |  |_/ | | \_|  | |_ \_|| (___ \_| 
  |  __ /  | |   | | | '    ' |      | |      |  _| _  _.____`.  
 _| |  \ \_\  `-'  /  \ \__/ /      _| |_    _| |__/ || \____) | 
|____| |___|`.___.'    `.__.'      |_____|  |________| \______.' 
                                                                 
 * 
 */


app.get('/', userController.index)

// Start Express server

app.listen(app.get('port'), () => {
    const { BASE_URL } = process.env;
    const colonIndex = BASE_URL.lastIndexOf(':');
    const port = parseInt(BASE_URL.slice(colonIndex + 1), 10);

    console.log(`App is running on http://localhost:${app.get('port')} in ${app.get('env')} mode.`);
})

module.exports = app;