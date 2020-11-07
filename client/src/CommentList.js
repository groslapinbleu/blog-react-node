import React, { useState, useEffect } from 'react'
import axios from 'axios'


const CommentList = ({postId}) => {
    const [comments, setComments] = useState([]);

    const fetchData = async () => {
        await axios.get(`http://localhost:4001/posts/${postId}/comments`)
            .then(response => {
                console.log(response)
                setComments(response.data)
            })
            .catch(error => {
                console.log(error.response)
            })
    }

    useEffect(() => {
        fetchData()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    console.log(`comments = ${comments}`)
    const renderedComments = comments
        .map(comment => {
            return (
                    <li key={comment.id}>
                        {comment.content}
                    </li>
            )
        })
    console.log(`renderedComments = ${renderedComments}`)
    return (
        <ul>
            {renderedComments}
        </ul>)
}

export default CommentList