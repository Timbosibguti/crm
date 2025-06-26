const STATIC_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'; // Замените на ваш статичный токен

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401); // Если токен отсутствует

  if (token === STATIC_TOKEN) {
    next(); // Токен валиден, передаем управление следующему middleware
  } else {
    res.sendStatus(403); // Токен недействителен
  }
}

module.exports = authenticateToken;
