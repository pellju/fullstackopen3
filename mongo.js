//Usage: node mongo.js <password>
const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstackopen:${password}@cluster0.ai4jx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

mongoose.connect(url)

const person = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Persons', person)

if (process.argv.length > 3){ //Lisätään käyttäjä
  const newPerson = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })
  console.log(newPerson)
  newPerson.save().then(response => {
    console.log('Response: ', response)
    console.log(`added ${newPerson.name} number ${newPerson.number} to phonebook`)
    mongoose.connection.close()
  })
} else { //Listataan käyttäjät
  console.log('Phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} - ${person.number}`)
    })
    mongoose.connection.close()
  })
}