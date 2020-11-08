const express = require('express')
const cors = require('cors')
const axios = require('axios')
const bodyParser = require('body-parser')
const { randomBytes } = require('crypto')

const app = express()
app.use(bodyParser.json())

// this array represents the event-bus database
const events = []

app.post('/events', (req, res) => {
    console.log(`received body : ${req.body}`)
    const event = req.body
    events.push(event) // store into db

    // send to all interested services
    axios.post('http://localhost:4000/events', event)
    axios.post('http://localhost:4001/events', event)
    axios.post('http://localhost:4002/events', event)
    axios.post('http://localhost:4003/events', event)
    // TODO : add some error management...
    res.send({ status: 'OK' })
})

const sendAllEvents = async (port) => {
    // send all events to relevant service
    events.forEach(async (event) => {
        await axios.post(`http://localhost:${port}/events`, event)
        // TODO : add some error management...
    })
}

app.post('/sendEvents', async (req, res) => {
    const {port} = req.body
    console.log(`/sendEvent, received body.port : ${port}`)
    // expecting body to contain {port: some_value}
    await sendAllEvents(port)
    res.send({ status: 'OK' })
})

app.listen(4005, () => {
    console.log('listening to port 4005 for events')
})