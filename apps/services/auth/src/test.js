const bcrypt = require('bcrypt');
const saltRounds = 10;
bcrypt.compare('myPassword', '$2b$10$yJw0Wmg.WHThw/08phmUROWKff.Nyoap4L5Is9sMAcHHNQDzLp8/e').then((result) => {
  console.log(result); // true
}).catch((err) => {
  console.error(err);
});

// wrong : $2b$10$Vmgy0bGgu5fCqtT4nijY3eup.v9zExUxSp.qXk1kAljW6nHWyHqYK
//$2b$10$yJw0Wmg.WHThw/08phmUROWKff.Nyoap4L5Is9sMAcHHNQDzLp8/e