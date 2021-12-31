require('dotenv').config()
const express = require('express')
const morgan = require('morgan') //npm install morgan
const app = express()
const cors = require('cors')
const Persons = require('./models/mongo.js')

morgan.token('data', function(req) {
  if (req.method === 'POST'){
    return JSON.stringify(req.body)
  } else {
    return ''
  }
})

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'Problematic person ID' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).send({ error: error.message })
  }

  next(error)
}

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
app.use(cors())
app.use(express.json())
app.use(express.static('build'))



app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
  Persons.find({}).then(items => {
    //console.log(items)
    res.json(items)
  })
})

app.get('/info', (req, res) => {
  Persons.find({}).then(items => {
    res.send(`<p>Phonebook has info for ${items.length} people</p><p>${new Date}</p>`)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Persons.findById(id).then(person => {
    if (person) {
      res.json(person)
    } else {
      res.status(404).end()
    }
  }).catch(e => next(e))
})

app.delete('/api/persons/:id', (req,res, next) => {
  const id = req.params.id
  //console.log('ID:', id)
  if (id !== undefined) {
    Persons.findById(id).then(person => {
      if (person) {
        person.delete().then(newList => {
          res.json(newList)
        })
      } else {
        res.status(404).end()
      }
    }).catch(e => next(e))
  } else {
    res.status(400).end()
  }
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body
  //console.log("body1: ", body)

  if (body.name === undefined || body.number === undefined){
    return res.status(400).json({ error: 'Missing information' })
  }

  const person = new Persons({
    name: body.name,
    number: body.number,
  })
  //console.log('person: ', person)
  //const exists = persons.find(checked => checked.name === person.name)

  if (person.number === undefined) {
    res.send({ error: 'Phone number missing' })
  } else {
    person.save().then(newPerson => {
      res.json(newPerson)
    })
      .catch(e => next(e))
  }
})

app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  const body = req.body
  //console.log("Body: ", body, " ID: ", id)

  if (id !== undefined && body.number !== undefined && body.name !== undefined && body.name.length > 2 && body.number.length > 7) {
    Persons.findById(id).then(person => {
      if (person){
        person.delete().then(deletedPerson => console.log('DELETED PERSON: ', deletedPerson))

        const newPerson = new Persons({
          name: body.name,
          number: body.number,
        })
        //console.log("person: ", newPerson)
        newPerson.save().then(thisPerson => {
          res.json(thisPerson)
        })
      } else {
        res.send({ error: 'Person not found!' })
      }
    }).catch(e => next(e))
  } else {
    res.status(400).end()
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

app.use(errorHandler) //pidä viimeisenä!!