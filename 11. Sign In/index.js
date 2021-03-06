const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// controllers
const { HomeController } = require('./controllers/home');

// middlewares
const { auth } = require('./middlewares/auth');


const port = 8000;
const app = express();
app.listen(port, () => console.log(`app listening on port ${port}`));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug'); // jade template view engine has been renamed to pug

app.use('/', express.static(path.join(__dirname, 'wwwroot')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: 'signin-steve-he',
    resave: false,
    saveUninitialized: true,
    cookie: {
        path: '/',
        httpOnly: true,
        maxAge: 24 * 3600 * 1000
    },
    store: new session.MemoryStore()
}));
app.use(auth);

const routes = [
    {
        path: '/regist',
        method: 'GET',
        controller: HomeController,
        action: 'signup_get'
    },
    {
        path: '/regist',
        method: 'POST',
        controller: HomeController,
        action: 'signup_post'
    },
    {
        path: '/',
        method: 'GET',
        controller: HomeController,
        action: 'signin_get'
    },
    {
        path: '/',
        method: 'POST',
        controller: HomeController,
        action: 'signin_post'
    },
    {
        path: '/signout',
        method: 'POST',
        controller: HomeController,
        action: 'signout'
    }
];

for (const i of routes.filter(r => r.method === 'GET'))
    app.get(i.path, async (req, res) => {
        try { await new i.controller(req, res)[i.action]() }
        catch (err) { console.error(err); }
    });

for (const i of routes.filter(r => r.method === 'POST'))
    app.post(i.path, async (req, res) => {
        try { await new i.controller(req, res)[i.action]() }
        catch (err) { console.error(err); }
    });

app.use((req, res, next) => {
    res.status(404).render('404.pug');
})