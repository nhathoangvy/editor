var express = require('express');
var router = express.Router();
var fs = require('fs');
var Handlebars = require('handlebars');
var path = require('path');
var app = express();
var _ = require('lodash');
var path = require('path');
var util = require('util');

var program = require('commander');
/*ifCondition*/
Handlebars.registerHelper({
if_eq : (a, result, opts) => {
    if(a === result)
        return opts.fn(this);
    else
        return opts.inverse(this);
},
header : (options) => {
  return '<ul class="menu"><li><a href="/">Home</a></li><li><a href="/register">Register</a></li><li><a href="/list-member">List members</a></li><li><a href="/add">Add</a></li><li><a href="/content">List</a></li><li><a href="/newcat">Add new category</a></li><li><a href="/categories">Categories</a></li><li><a href="/pic">Gallery</a></li><li><a href="/addProduct">AddProduct</a></li><li><a href="/listSP">List SP</a></li><li><a href="/cart">Cart</a></li><li><a href="/contact">Contact</a></li><li><a href="/navMenu">Menu</a></li></ul>';
},
loop : (n, block) => {
  var accum = '';
  for(var i = 1; i < n; i++)
      accum += block.fn(i);
  return accum;
}
});
require('./editor.js')(router);
require('./templs/store.js')(router);
fs.readdir(__dirname + "/manager/", (err, files) => {
    files.forEach((f) => {
      require('./manager/' + f)(router);
    });
});
router.get('/404', (req, res) => {
  res.end('<h1 style="text-align:center; font-family: Segoe UI;padding: 40px">Type your URL address to display !</h1>');
});
router.get('/',(req,res) => {
  var view = req.session.view;
  if (!fs.existsSync(req.session.dir)) {
    var msg = 'Directory does not exists !';
    var path = '';
  }else{
    var path = req.session.dir;
  }
  res.render('index', {view, path, msg});
});

router.get('/dir', (req, res) => {
  var dir = req.session.dir ;
  if (!fs.existsSync(dir)) {
      //fs.mkdirSync(dir, 0744);
      return;
  }
  app.use(express.static(dir)); //app public directory
 var currentDir =  dir;
 var query = req.query.path || '';
 if (query) currentDir = path.join(dir, query);
 //console.log("browsing ", currentDir);
 fs.readdir(currentDir, (err, files) => {
     if (err) {
        throw err;
      }
      var data = [];
      files
      .filter( (file) => {
          return true;
      }).forEach( (file) => {
        try {
                //console.log("processing ", file);
                var isDirectory = fs.statSync(path.join(currentDir,file)).isDirectory();
                if (isDirectory) {
                  data.push({ Name : file, IsDirectory: true, Path : path.join(query, file)  });
                } else {
                  var ext = path.extname(file);
                  if(program.exclude && _.contains(program.exclude, ext)) {
                    console.log("excluding file ", file);
                    return;
                  }
                        data.push({ Name : file, Ext : ext, IsDirectory: false, Path : path.join(query, file)});
                }
        } catch(e) {
          console.log(e);
        }

      });
   res.json(data);
  });
});


//readFile
router.get('/files', (req, res) => {
  var dirA = req.session.dir;
 var currentDirA =  dirA;
 var queryA = req.query.path || '';
 if (queryA) currentDirA = path.join(dirA, queryA);
 //console.log("browsing ", currentDir);
 fs.readdir(currentDirA, (err, fileAs) => {
     if (err) {
        throw err;
      }
      var fileContent = [];
      fileAs.forEach( (fileA) => {
var isDirectory = fs.statSync(path.join(currentDirA,fileA)).isDirectory();
        if(!isDirectory){
          var text = fs.readFileSync(currentDirA + '/' + fileA, 'utf8');
  fileContent.push({ Name : fileA, IsDirectory: false, Path : path.join(queryA, fileA), detail : text });
        }

      });
        res.json(fileContent);
  });
});

module.exports = router;
