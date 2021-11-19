import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
// import { prettyDOM } from '@testing-library/dom'
import Blog from './Blog'

test('<Blog /> displaying a blog and renders the blog\'s title and author', () => {
  const testBlog = {
    title: 'Growth of Codeplay',
    author: 'John Hopkins',
    url: 'www.google.com',
    user:{
      name: 'steve'
    }
  }
  const mockUpdateBLog = jest.fn()
  const mockDeleteItem = jest.fn()

  const component = render(
    <Blog blog={testBlog} updateBlog={mockUpdateBLog} deleteItem={mockDeleteItem} />
  )
  const div1 = component.container.querySelector('.simpleView')
  //   console.log(prettyDOM(div1))

  const div2 = component.container.querySelector('.complexView')
  //   console.log(prettyDOM(div2))

  expect(div1).toHaveTextContent(`${testBlog.title}`)
  expect(div1).toHaveTextContent(`${testBlog.author}`)
  expect(div1).not.toHaveStyle('display: none')
  expect(div2).toHaveStyle('display: none')
})

test('testing  blog\'s url and number of likes are shown after view button clicked', () => {
  const testBlog = {
    title: 'Growth of Codeplay',
    author: 'John Hopkins',
    url: 'www.google.com',
    user:{
      name: 'steve'
    }
  }
  const mockUpdateBLog = jest.fn()
  const mockDeleteItem = jest.fn()

  const component = render(
    <Blog blog={testBlog} updateBlog={mockUpdateBLog} deleteItem={mockDeleteItem} />
  )
  const div1 = component.container.querySelector('.simpleView')
  //   console.log(prettyDOM(div1))

  const buttonView = component.getByText('view')
  fireEvent.click(buttonView)

  const div2 = component.container.querySelector('.complexView')
  //   console.log(prettyDOM(div2))

  expect(div1).toHaveStyle('display: none')
  expect(div2).not.toHaveStyle('display: none')

})

test('like button is clicked twice, event handler received twice calls', () => {
  const testBlog = {
    title: 'Growth of Codeplay',
    author: 'John Hopkins',
    url: 'www.google.com',
    user:{
      name: 'steve'
    }
  }
  const mockUpdateBLog = jest.fn()
  const mockDeleteItem = jest.fn()

  const component = render(
    <Blog blog={testBlog} updateBlog={mockUpdateBLog} deleteItem={mockDeleteItem} />
  )
  const buttonLike = component.getByText('like')
  fireEvent.click(buttonLike)
  fireEvent.click(buttonLike)
  expect(mockUpdateBLog.mock.calls).toHaveLength(2)
})