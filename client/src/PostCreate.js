import React, { useState } from 'react'
import axios from 'axios'


const PostCreate = (event) => {
    const [title, setTitle] = useState('');

    const handleClick = async (event) => {
        event.preventDefault() // this is needed woth React
        await axios.post("http://localhost:4000/posts", { title })
        .then(response => { 
            console.log(response)
        })
        .catch(error => {
            console.log(error.response)
        })
        setTitle('')
    }

    const handleChange = (event) => {
        setTitle(event.target.value)
    }

    return (
        <div>
            <form>
                <div className='form-group'>
                    <label>Title </label>
                    <input className='form-control' value={title} onChange={handleChange}>
                    </input>
                </div>
                <button className='btn btn-primary' onClick={handleClick}>Submit</button>
            </form>
        </div>
    );
};

export default PostCreate;