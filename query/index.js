const express = require('express')
const cors = require('cors')
const axios = require('axios')

const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())
app.use(cors())

const posts = {
}

app.get('/posts', (req, res) => {
    res.send(posts)
})


const processEvent = (event) => {
    if (event.type === 'PostCreated') {
        console.log(`received PostCreated event`)
        const post = event.data
        posts[post.id] = { id: post.id, title: post.title, comments: [] }

    } else if (event.type === 'CommentCreated') {
        console.log(`received CommentCreated event`)
        const comment = event.data
        const { id, content, postId, status } = comment
        if (!(typeof posts[postId] == 'object')) {
            posts[postId] = { id: postId, title: '', comments: [] }
        }
        posts[postId].comments.push({ id, content, status })

    } else if (event.type === 'CommentUpdated') {
        console.log(`received CommentUpdated event`)
        const comment = event.data
        const { id, content, postId, status } = comment
        if (!(typeof posts[postId] == 'object')) {
            posts[postId] = { id: postId, title: '', comments: [] }
        }

        storedComment = posts[postId].comments.find((item) => {
            return (item.id === id)
        })
        storedComment.status = status
        storedComment.content = content


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

app.listen(4002, async () => {
    console.log('listening to port 4002 for queries')
    await axios.post('http://localhost:4005/sendEvents', { port: 4002 })
    
})