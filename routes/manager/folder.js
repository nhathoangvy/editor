var fs = require('fs');

module.exports = (router) => {
  router.get('/crFolder', (req, res) => {
    var data = req.query.name;
        var dir = req.query.dir;
        var more = req.query.morePath;
        if(more !== ""){
  fs.mkdirSync(dir + "/" + more + "/" + data);
}else{fs.mkdirSync(dir + "/" + data);}
      res.redirect(req.get('referer'));
  });

  router.get('/rmvFolder', (req, res) => {
    var data = [req.query.name];
    var d = data.toString().split(/(?:,| )+/) ;
    for(var i = 0; i < d.length; i++){
        fs.rmdir( d[i], (err) => {
          if(err) console.log('This folder contain other file');
        });
    }
      res.redirect(req.get('referer'));
  });

};
