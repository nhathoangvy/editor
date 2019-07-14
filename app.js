/* server.js */
var hbs = require('express-handlebars');
var express = require('express');
var app = express();
var routes =  require("./routes/systems.js");
var _ = require('lodash');
var path = require('path');
var util = require('util');
var session = require('express-session');
var program = require('commander');

function collect(val, memo) {
  if(val && val.indexOf('.') != 0) val = "." + val;
  memo.push(val);
  return memo;
}

app.set('trust proxy', 1)
app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: (3600000 * 24)}
}));
// set the view engine to ejs
app.set('view engine', 'html');
app.engine('html', hbs({extname: 'html', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/'}));
// public folder to store assets
app.use(express.static(process.cwd()));
app.use('/', routes);

// get sharejs dependencies
var sharejs = require('share');

// set up redis server
var redisClient;

if (process.env.REDISTOGO_URL) {
  var rtg   = require("url").parse(process.env.REDISTOGO_URL);
  redisClient = require("redis").createClient(rtg.port, rtg.hostname);
  redisClient.auth(rtg.auth.split(":")[1]);
} else {
  redisClient = require("redis").createClient();
}

// options for sharejs
var options = {
  db: {type: 'redis', client: redisClient}
};

// attach the express server to sharejs
sharejs.server.attach(app, options);

// listen on port 8000 (for localhost) or the port defined for heroku
var port = process.env.PORT || 8000;
app.listen(port, function(err){
  console.log('running port %s', port);
});

program
  .option('-p, --port <port>', '')
  .option('-e, --exclude <exclude>', '', collect, [])
  .parse(process.argv);
