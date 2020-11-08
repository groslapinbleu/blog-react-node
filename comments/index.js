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
        content,
        status: 'pending'
    }
    comments.push(comment)
    commentsByPostId[req.params.id] = comments
    await axios.post('http://localhost:4005/events',
        {
            type: 'CommentCreated',
            data: {
                id: commentId,
                content,
                status: 'pending',
                postId: req.params.id
            }
        })

    res.status(201).send(comment)
})




const processEvent = async (event) => {
    if (event.type === 'CommentModerated') {
        console.log(`received CommentModerated event`)
        const comment = event.data
        const { id, content, postId, status } = comment
        // look for comment in database
        const comments = commentsByPostId[postId] || []
        const storedComment = comments.find(comment => { return comment.id === id})
        if (storedComment) {
            console.log(`updating comment status ${storedComment.status} to ${comment.status}`)
            storedComment.status =  status 
            storedComment.content =  content
        }
        await axios.post('http://localhost:4005/events',
            {
                type: 'CommentUpdated',
                data: {
                    id,
                    content,
                    status,
                    postId
                }
            })


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

app.listen(4001, () => {
    console.log('listening to port 4001 for comments')
})