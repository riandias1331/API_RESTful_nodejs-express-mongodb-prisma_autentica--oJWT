const mongoose = require('mongoose')

mongoose.connect()
    .then(() => console.log('Connected'))
    .catch((E) => console.log(E))