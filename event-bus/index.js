const express = require('express')
const cors = require('cors')
const axios = require('axios')
const bodyParser = require('body-parser')
const { randomBytes } = require('crypto')

const app = express()
app.use(bodyParser.json())

app.post('/events', (req, res) => {
    console.log(`received body : ${req.body}`)
    const event = req.body
    axios.post('http://localhost:4000/events', event)
    axios.post('http://localhost:4001/events', event)
    axios.post('http://localhost:4002/events', event)
    // TODO : ajouter la gestion des erreurs...
    res.send({ status: 'OK' })
})

app.listen(4005, () => {
    console.log('listening to port 4005 for events')
})