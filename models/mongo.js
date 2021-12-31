const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI

console.log(url)
mongoose.connect(url)
  .then(result => {
    console.log(`Connected to ${url}`)
  })
  .catch((e) => {
    console.log(`An error occured: ${e}`)
  })

const person = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
    unique: true
  },
  number: {
    type: String,
    minlength: 8,
    required: true
  },
})

person.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

person.plugin(uniqueValidator)

module.exports = mongoose.model('Persons', person)