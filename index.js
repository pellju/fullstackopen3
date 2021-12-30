const { response } = require('express')
const express = require('express')
const morgan = require('morgan') //npm install morgan
const app = express()
const cors = require('cors')

morgan.token('data', function(req, res) {
    if (req.method === 'POST'){
        return JSON.stringify(req.body)
    } else {
        return ""
    }
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
app.use(cors())
app.use(express.json())

let persons = [
    {
      id: 1,
      name: "Arto Hellas",
      number: "040-123456",
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523",
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345",
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122",
    },  
]

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
  })
  
app.get('/api/persons', (req, res) => {
    console.log(persons)
    res.json(persons)
})

app.get('/info', (req, res) => {
    const message = `<p>Phonebook has info for ${persons.length} people</p><p>${new Date}</p>`
    res.send(message)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => id === person.id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req,res) => {
    const id = Number(req.params.id)
    console.log('ID:', id)
    if (id !== undefined) {
        const person = persons.find(person => id === person.id)
        const personIndex = persons.indexOf(person)
        const newArray = persons.splice(personIndex,1)
        console.log(newArray)
        res.json(newArray)
    } else {
        res.json(persons)
    }
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    //console.log(body)
    const id = persons.length + 1
    const person = {
        name: body.name,
        number: body.number,
        id: id,
    }
    const exists = persons.find(checked => checked.name === person.name)

    if (person.number === undefined) {
        res.send({ error: "Phone number missing" })
    } else if (exists) {
        res.send({ error: "Such person already found"})
    } else {
        persons = persons.concat(person)
        res.json(persons)
    }
})

const PORT = process.env.PORT || 3001 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})