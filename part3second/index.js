require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const Name = require('./models/name')

app.use(cors())
app.use(bodyParser.json())
app.use(morgan('tiny'))
app.use(express.static('build'))

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: 'name already exists' })
  }

  next(error)
}

app.use(errorHandler)

app.get('/persons', (request, response) => {
  Name.find({}).then(names => {
    response.json(names)
  })
})

app.get('/info', (req, res) => {
  const amount = Name.find({}).then(names => names.length)
  res.send('<p>Phonebook has info for ' + amount + ' people</p>' + new Date())
})

app.get('/persons/:id', (request, response, next) => {
  Name.findById(request.params.id)
    .then(name => {
      if (name) {
        response.json(name.toJSON())
      } else {
        response.status(404).end()
      }
    })
    .catch(error => errorHandler(error, request, response, next))
})

app.delete('/persons/:id', (request, response, next) => {
  Name.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => errorHandler(error, request, response, next))
})

app.post('/persons', (request, response, next) => {

  if (!request.body.name || !request.body.number) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  }

  const name = new Name({
    name: request.body.name,
    number: request.body.number,
    id: Math.floor(Math.random() * Math.floor(100000000))
  })

  name.save().then(savedName => {
    response.json(savedName.toJSON())
  })
    .catch(error => errorHandler(error, request, response, next))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})