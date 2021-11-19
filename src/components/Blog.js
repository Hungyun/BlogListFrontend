import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateBlog, deleteItem }) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = {
    display: visible ? 'none' : '' ,
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5 }
  const showWhenVisible = {
    display: visible ? '' : 'none',
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5 }
  const toggleVisibility = () => {
    setVisible(!visible)
  }
  const addLike = (event) => {
    event.preventDefault()
    updateBlog({
      user: blog.user,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
      id: blog.id
    })
  }
  const removeItem = () => {
    deleteItem(blog)
  }
  return(
    <div className='bodyOfBlog'>
      <div style={hideWhenVisible} className='simpleView'>
        {blog.title} {blog.author} <button onClick={toggleVisibility}>view</button>
      </div>
      <div style={showWhenVisible} className='complexView'>
        {blog.title} {blog.author} <button onClick={toggleVisibility}>hide</button><br/>
        {blog.url}<br/>
            likes {blog.likes}<button onClick={addLike}>like</button><br/>
        {blog.user.name}<br/>
        <button onClick={removeItem}>remove</button><br/>
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateBlog: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired
}

export default Blog