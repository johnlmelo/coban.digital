module.exports = (req, res, next) => {
    if (req.query.token == "" || !req.query.token) {
      return res.status(500).json({ error: req.query.msg });
    }
    return res.status(200).json({ sucess: 'Você está Online!' });
};
  