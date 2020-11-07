const express = require('express')
const cors = require('cors')

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
        posts[post.id] = {id: post.id, title: post.title, comments: []}

    } else if (event.type === 'CommentCreated') {
        console.log(`received CommentCreated event`)
        const comment = event.data
        if (!(typeof posts[comment.postId] == 'object')) {
            posts[comment.postId] = {id: comment.postId, title: '', comments: []}
        }
        posts[comment.postId].comments.push({id: comment.id, content: comment.content})
         
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
    console.log(posts)
})

app.listen(4002, () => {
    console.log('listening to port 4002 for queries')
})