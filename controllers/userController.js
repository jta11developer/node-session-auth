module.exports = {
  profile(req, res) {
    res.json(req.session);
  },
};
