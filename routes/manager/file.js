var fs = require('fs');
module.exports = (router) => {

  router.get('/crFile', (req, res) => {
    var data = req.query.name;
        var dir = req.query.dir;
          var more = req.query.morePath;
        if(more !== ""){
  fs.writeFileSync(dir + "/" + more + "/" + data);
}else{
	fs.writeFileSync(dir + "/" + data);
}
      res.redirect(req.get('referer'));
  });

  router.get('/rmvFile', (req, res) => {
    var data = [req.query.name];
    var d = data.toString().split(/(?:,| )+/) ;
    for(var i = 0; i < d.length; i++){
        fs.unlinkSync(d[i]);
    }
      res.redirect(req.get('referer'));
  });

  router.get('/renameFile', (req, res) => {
    var file = req.query.file;
    var dir = req.query.dir;
    var change = req.query.change;
      var base = req.query.base;
        if(dir !== ""){
    fs.renameSync(base + "/" + dir + "/" + file, base + "/" + dir + "/" + change);
  }else{
    fs.renameSync(base + "/" + file, base + "/" + change);
  }
      res.redirect(req.get('referer'));
  });

};
