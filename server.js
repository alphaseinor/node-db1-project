const express = require('express');

const db = require('./data/dbConfig.js');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
  db('accounts')
    .then(accounts => {
      res.status(200).json(accounts);
    })
    .catch(error => {
      res.status(500).json({ message: "Error on GET account" })
    })
  }
)

server.get('/:id', (req, res) => {
  db('accounts')
    .where({ id: req.params.id })
    .first()
    .then(account => {
      if (account) {
          res.status(200).json(account);
      } else {
          res.status(404).json({ message: "account not available" })
      }
    })
    .catch(error => {
      res.status(500).json({ message: "error unable to retreive account" })
    })
  }
)

server.post("/", (req, res) => {
  const body = req.body

  if (body.name && body.budget) {
    db('accounts')
      .insert(body, "id")
      .then(ids => {
        const id = ids[0]
        return db('accounts')
            .select('id', 'name', 'budget')
            .where({ id })
            .first()
            .then(account => {
                res.status(201).json(account)
              }
            )
      })
      .catch(error => {
          res.status(500).json({ 
              message: "error adding account" 
            }
          )
        }
      )
  } else {
     res.status(400).json({ message: "missing name and budget." })
  }
})

module.exports = server;