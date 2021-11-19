import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'

import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    async function fetchData() {
      const response = await blogService.getAll()
      response.sort(function(a,b){return b.likes - a.likes})
      setBlogs(response)
    }
    fetchData()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  // const addBlog = (blogObject) => {
  //   blogFormRef.current.toggleVisibility()

  //   blogService
  //     .create(blogObject)
  //       .then(returnedBlog => {
  //       setBlogs(blogs.concat(returnedBlog))
  //       setErrorMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
  //       setTimeout(() => {setErrorMessage(null)}, 5000)
  //     })
  // }
  const addBlog = async(blogObject) => {
    blogFormRef.current.toggleVisibility()
    try{
      const returnedBlog = await blogService.create(blogObject)
      const replaceUser = {
        id: returnedBlog.user,
        username: user.username,
        name: user.name
      }
      returnedBlog.user = replaceUser
      setBlogs(blogs.concat(returnedBlog))
      setErrorMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
      setTimeout(() => {setErrorMessage(null)}, 5000)
    }catch(exception){
      setErrorMessage(exception)
    }
  }
  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedBloglistappUser')
  }
  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBloglistappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong username or password')
      console.log('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }



  const blogFormRef = useRef()

  const blogForm = () =>
    (
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog}/>
      </Togglable>
    )

  const showBlogs = () =>
    (
      blogs.map(blog =>
        <Blog key={blog.id} blog={blog} updateBlog={plusLike} deleteItem={deleteItem}/>
      )
    )
  const plusLike = async(blogObject) => {
    await blogService.update(blogObject)
    let position = 0
    let newBlogs = blogs.map(b => b)
    for (let i =0; i < blogs.length;i++){
      if (blogs[i].id === blogObject.id){
        position = i
      }
    }
    newBlogs.splice(position,1,blogObject)
    setBlogs(newBlogs)
    setErrorMessage(`${blogObject.title} by ${blogObject.name} updated`)
    setTimeout(() => {
      setErrorMessage(null)
    }, 1000)
  }
  const deleteItem = async(blogObject) => {
    let con = false

    if(user.username === blogObject.user.username){
      con = window.confirm(`Remove blog ${blogObject.title} by ${blogObject.author}`)
    }
    if (con){
      await blogService.deleteById(blogObject.id)
      let newBlogs = blogs.map(b => b)
      let position = 0
      for (let i =0; i < blogs.length;i++){
        if (blogs[i].id === blogObject.id){
          position = i
        }
      }
      newBlogs.splice(position,1)
      console.log(newBlogs)
      setBlogs(newBlogs)
      setErrorMessage(`${blogObject.title} by ${blogObject.user.name} deleted`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 1500)}
  }
  if (user === null) {
    return (
      <>
        <div>
          <h2>Log in to application</h2>
        </div>
        <Notification message={errorMessage} />
        <div>
          <form onSubmit={handleLogin}>
            <div>
              username
              <input
                id='username'
                value={username}
                onChange={({ target }) => setUsername(target.value)}/>
            </div>
            <div>
              password
              <input
                id='password'
                value={password}
                onChange={({ target }) => setPassword(target.value)}/></div>

            <button id='login-button' type="submit">login</button>
          </form>
        </div>
      </>
    )
  }
  return (
    <div>
      <h1>blogs</h1>
      <Notification message={errorMessage} />
      <h3>{user.name} logged in<button onClick={handleLogout}>logout</button></h3>
      <div>{blogForm()}</div>
      <div>{showBlogs()}</div>
    </div>
  )
}

export default App