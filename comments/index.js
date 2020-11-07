const express = require('express')
const bodyParser = require('body-parser')
const { randomBytes } = require('crypto')
const cors = require('cors')
const axios = require('axios')
const { equal } = require('assert')

const app = express()
app.use(bodyParser.json())
app.use(cors())

const commentsByPostId = {
    '1': [{ id: '1234', content: 'bidon' }]
}

app.get('/posts/:id/comments', (req, res) => {
    const comments = commentsByPostId[req.params.id] || []
    res.send(comments)
})
app.post('/posts/:id/comments', async (req, res) => {
    const commentId = randomBytes(4).toString('hex')
    console.log(`received body : ${req.body}`)
    const { content } = req.body
    const comments = commentsByPostId[req.params.id] || []
    const comment = {
        id: commentId,
        content
    }
    comments.push(comment)
    commentsByPostId[req.params.id] = comments
    await axios.post('http://localhost:4005/events',
        {
            type: 'CommentCreated',
            data: {
                id: commentId,
                content,
                postId: req.params.id
            }
        })

    res.status(201).send(comment)
})
app.post('/events', async (req, res) => {
    console.log(`received event : ${req.body.type}`)
    res.send({ status: 'OK' })

})
app.listen(4001, () => {
    console.log('listening to port 4001 for comments')
})