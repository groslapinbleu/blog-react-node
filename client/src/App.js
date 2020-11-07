import React, { useState } from 'react'

import PostCreate from "./PostCreate"
import PostList from "./PostList";


function App() {
  const [update, setUpdate] = useState(false);

  const updateComponent = () => {
    console.log('updateComponent')
    setUpdate(!update)
  }


  return (
    <div className='container'>
      <h1>Create Post</h1>
      <PostCreate updateComponent={updateComponent} />
      <hr />
      <h1>Posts</h1>
      <PostList />
    </div>
  );
}

export default App;
