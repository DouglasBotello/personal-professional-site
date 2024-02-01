/**
 * GET /
 * Hello World
 */
exports.index = (req, res) => {
    res.render('home', {
      title: 'Home'
    });
  };