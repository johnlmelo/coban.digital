const fetch = require('node-fetch');

module.exports = async (req, res, next) => {
  try {
    const response = await fetch('https://jcf.promosysweb.com/services/creditos.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: req.token
      })
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to consult credits' });
  }
};
