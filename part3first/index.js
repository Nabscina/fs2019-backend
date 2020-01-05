const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')

app.use(cors())
app.use(bodyParser.json())
app.use(morgan('tiny'))

let persons = [
  {
    id: 1,
    name: 'Poppy',
    number: '420-1337'
  },
  {
    id: 2,
    name: 'Oppimisen viisas alpakki',
    number: '987-744731'
  },
  {
    id: 3,
    name: 'Urhea retkialpakki',
    number: '547-15-P'
  },
  {
    id: 4,
    name: 'Ozzy',
    number: '022-022-505'
  }
]

app.get('/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
  res.send('<p>Phonebook has info for ' + persons.length + ' people</p>' + new Date())
})

app.get('/persons/:id', (request, response) => {
  const person = persons.find(person => person.id === Number(request.params.id))

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/persons/:id', (request, response) => {
  persons = persons.filter(person => person.id !== Number(request.params.id))

  response.status(204).end()
})

app.post('/persons', (request, response) => {

  if (!request.body.name || !request.body.number) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  } else if (persons.map(person => person.name).includes(request.body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    name: request.body.name,
    number: request.body.number,
    id: Math.floor(Math.random() * Math.floor(100000000))
  }

  persons = persons.concat(person)

  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})