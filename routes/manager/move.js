var mv = require('mv');
module.exports = (router) => {
  router.get('/move', (req, res) => {
    var data = [req.query.name];
    var change = [req.query.nameM];
    var d = data.toString().split(/(?:,| )+/) ;
    var c = change.toString().split(/(?:,| )+/) ;
    for(var i = 0; i < d.length; i++){
      for(var j = 0; j < c.length; j++){
          mv(d[i], req.query.directory + "/" + c[j], (err) => {
            if(err) console.log('This folder contain other file');
          });
        }
      }
      res.redirect(req.get('referer'));
    });
};
