var fs = require('fs');
//const multer = require('multer');
//const upload = multer({ dest: '/tmp' });
module.exports = (router) => {
  router.get('/create', (req, res, next) => {
    var data = req.query.content;
    var path = req.query.path;
    fs.writeFileSync(path, data);
      // res.redirect(req.get('referer'));
      res.redirect(req.session.view);
  });
};
