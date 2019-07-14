var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer({ dest: '/tmp' });
var fs = require("fs");
module.exports = (router) => {
  /*fileupload*/
  router.post('/file_upload', upload.array('file', 50), function (req, res) {
    var arr = req.files;
    arr.forEach(function(img){
          if(req.body.morePath !== ""){
            var fileImg = req.body.dir + "/" + req.body.morePath + "/" + img.originalname;
          }else{
             var fileImg = req.body.dir + "/" + img.originalname;
          }
             var path = img.path;
             fs.readFile( path, function (err, data) {
                  fs.writeFile(fileImg, data, function (err) {
                      //error
                    });
               });
           });
       res.redirect('/');
  });
};
