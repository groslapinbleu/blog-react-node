import React, { useState, useEffect } from 'react'
import axios from 'axios'
import CommentCreate from './CommentCreate';
import CommentList from './CommentList';


const PostList = () => {
    const [posts, setPosts] = useState({});

    const getPosts = async () => {
        await axios.get("http://localhost:4000/posts")
            .then(response => {
                console.log(response)
                setPosts(response.data)
            })
            .catch(error => {
                console.log(error.response)
            })
    }

    useEffect(() => {
        getPosts()
    }, [])

    console.log(`posts = ${posts}`)
    const renderedPosts = Object.values(posts)
        .map(post => {
            return (
                <div className='card' key={post.id}>
                    <div className='card-body'>
                        <h3>{post.title}</h3>

                        <CommentList postId={post.id} />

                        <CommentCreate postId={post.id} />
                    </div>
                </div>
            )
        })
    console.log(`renderedPosts = ${renderedPosts}`)
    return (
        <div className='d-flex flex-row flex-wrap justify-content-between'>
            {renderedPosts}
        </div>)
}

export default PostList