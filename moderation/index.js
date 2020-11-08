const express = require('express')
const axios = require('axios')

const bodyParser = require('body-parser')
const { randomBytes } = require('crypto')

const app = express()
app.use(bodyParser.json())

const processEvent = async (event) => {
    if (event.type === 'CommentCreated') {
        console.log(`received CommentCreated event`)
        const comment = event.data
        const { id, content, postId, status } = comment
        if (status === 'pending') {
            const newStatus = content.includes('orange') ? 'rejected' : 'approved'
            await axios.post('http://localhost:4005/events',
                {
                    type: 'CommentModerated',
                    data: {
                        id,
                        content,
                        status: newStatus,
                        postId
                    }
                })
        }

    } else {
        console.log(`received unknown event`)
        return false
    }
    return true
}

app.post('/events', async (req, res) => {
    if (processEvent(req.body)) {
        res.send({ status: 'OK' })
    } else {
        res.send({ status: 'Unknown event received' })
    }
})

app.listen(4003, () => {
    console.log('listening to port 4003 for moderation')
})