import React from 'react'


const CommentList = ({comments}) => {

    console.log(`comments = ${comments}`)
    const renderedComments = comments
        .map(comment => {
            return (
                    <li key={comment.id}>
                        {comment.status === "approved" ? comment.content : `comment moderation : ${comment.status}`}
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