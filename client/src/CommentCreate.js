import React, { useState } from 'react'
import axios from 'axios'


const CommentCreate = ({postId}) => {
    const [content, setContent] = useState('');

    const handleClick = async (event) => {
        event.preventDefault() // this is needed with React
        await axios.post(`http://localhost:4001/posts/${postId}/comments`, { content: content })
        .then(response => { 
            console.log(response)
        })
        .catch(error => {
            console.log(error.response)
        })
        setContent('')
    }

    const handleChange = (event) => {
        setContent(event.target.value)
    }

    return (
        <div>
            <form>
                <div className='form-group'>
                    <label>New comment </label>
                    <input className='form-control' value={content} onChange={handleChange}>
                    </input>
                </div>
                <button className='btn btn-primary' onClick={handleClick}>Submit</button>
            </form>
        </div>
    );
};

export default CommentCreate;