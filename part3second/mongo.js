const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('password needed')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0-zw1rt.mongodb.net/number-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true })

const nameSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Name = mongoose.model('Name', nameSchema)

if (process.argv.length === 3 || process.argv.length === 4) {
  Name.find({}).then(result => {
    result.forEach(name => {
      console.log(name)
    })
    mongoose.connection.close()
  })
} else {
  const name = new Name({
    name: process.argv[3],
    number: process.argv[4]
  })

  name.save().then(response => {
    console.log('added ' + process.argv[3] + ' number ' + process.argv[4] + ' to phonebook!');
    mongoose.connection.close();
  })
}