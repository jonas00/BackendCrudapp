const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser').json();
const jwt = require('jsonwebtoken');
const models = require('./models');

const app = express();
const secureRoutes = express.Router();

app.use('/secure-api', secureRoutes);

process.env.SECRET_KEY = 'myssupersecretkey';

secureRoutes.use(bodyParser, function(req, res, next) {
  var token = req.body.token || req.header('token');
  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, function(err, decode) {
      if (err) {
        res.status(400).send('Invalid Token');
      } else {
        next();
      }
    });
  } else {
    res.send('Pls send a token');
  }
});

const base64 = exports;

base64.encode = function(unencoded) {
  return new Buffer(unencoded || '').toString('base64');
};

base64.decode = function(encoded) {
  return new Buffer(encoded || '', 'base64').toString('utf8');
};

/// Authentication endpoint
app.post('/authenticate', bodyParser, function(req, resp) {
  const currentUser = req.headers['username'];
   const enteredPassword = req.headers['password'];
  console.log(currentUser);
  models.User.findAll({
    where: {
      username: currentUser
    },
    attributes: ['username', 'password']
  }).then(function(user, error, rows) {
    if (error) {
      console.log('error');
      resp.send("you've entered a wrong username. Try again.");
    } else {
      if (user[0].password === enteredPassword) {
        const payload = { username: user[0].username };
        const token = jwt.sign(payload, process.env.SECRET_KEY, {
          expiresIn: 10000
        });
        resp.send(token);
      } else {
        resp.send("You've entered an invalid password");
      }
    }
  });
});

secureRoutes.get('/books', function(req, resp, next) {
  models.Book.findAll({
    attributes: ['id', 'title', 'year', 'author']
  }).then(function(books) {
    resp.send(books);
  });
});

///Get book with certain ID
secureRoutes.get('/books/:id', function(req, resp) {
  const bookId = req.params.id;
  models.Book.findAll({
    where: {
      id: bookId
    },
    attributes: ['id', 'title', 'year', 'author']
  }).then(function(error, rows) {
    if (error) {
      resp.send(error);
    } else {
      resp.send(rows);
    }
  });
});

/// Get book with the authors name
secureRoutes.get('/books/:author', function(req, resp){
  const author = req.params.author;
  models.Book.findAll({
    where: {
      author: author
    },
    attributes: ['id', 'title', 'year', 'author']
  }).then(function(error, rows){
    if (error) {
      resp.send(error);
    } else {
      resp.send(rows);
    }
     
  })
})

///Create a new book
secureRoutes.post('/books', bodyParser, function(req, resp) {
  models.Book.create({
    id: req.body.id,
    title: req.body.title,
    year: req.body.year,
    author: req.body.author
  }).then(function(books, error) {
    if (error) {
      resp.send('errrrr');
      console.log('error');
    } else {
      resp.send('a new book has been created');
    }
  });
});

///Delete existing book by id
secureRoutes.delete('/books/:id', function(req, resp) {
  const bookId = req.params.id;
  models.Book.destroy({
    where: {
      id: bookId
    }
  }).then(function(book, error) {
    if (error) {
      resp.send(error);
    } else {
      resp.send('Book has been deleted');
    }
  });
});

///Put new data in an existing book
secureRoutes.put('/books/:id', bodyParser, function(req, resp) {
  bookId = req.params.id;
  const values = {
    title: req.body.title,
    year: req.body.year,
    author: req.body.author
  };
  const selector = {
    where: {
      id: bookId
    }
  };
  models.Book.update(values, selector).then(function(book, error) {
    if ((book, error)) {
      console.log(error);
    } else {
      resp.send('The book has successfully been updated');
    }
  });
});

app.listen(1337);
