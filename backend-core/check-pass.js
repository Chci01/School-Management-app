const bcrypt = require('bcrypt');
const hash = '$2b$10$4ENTX8wjr8m74Mi2aJvDfunbkz5IQ8BRM1DSbHg/LoNfrdwQRxDZu';
const pass = 'admin123';
bcrypt.compare(pass, hash).then(match => {
  console.log('Match:', match);
});
