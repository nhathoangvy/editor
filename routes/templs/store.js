
module.exports = (router) => {
  router.get('/store', (req, res, next) => {
    if (req.query.directory.charAt(req.query.directory.length - 1) == '/') {
  str = req.query.directory.substr(0, req.query.directory.length - 1);
}else{
  str = req.query.directory;
}
      req.session.dir = str;
      req.session.view = req.query.view;
      res.redirect(req.get('referer'));
  });

};
