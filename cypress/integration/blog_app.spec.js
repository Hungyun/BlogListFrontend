describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    // create here a user to backend
    const user = {
      name: 'SteveCHEN',
      username: 'steve',
      password: '1111'
    }
    cy.request('POST', 'http://localhost:3003/api/users', user)
    const user2 = {
      name: 'MaryJin',
      username: 'mary',
      password: '2222'
    }
    cy.request('POST', 'http://localhost:3003/api/users', user2)

    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('steve')
      cy.get('#password').type('1111')
      cy.get('#login-button').click()
      cy.contains('logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('steve')
      cy.get('#password').type('0000')
      cy.get('#login-button').click()
      cy.get('.error')
        .should('contain', 'wrong username')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      // log in user here
      cy.login({ username: 'steve', password: '1111' })
      cy.contains('logged in')
    })

    it('A blog can be created', function() {
      cy.contains('create new blog').click()
      cy.get('#title').type('How to manage your bad temper')
      cy.get('#author').type('Steve Jobs')
      cy.get('#url').type('www.apple.com')
      cy.get('#create-button').click()
      cy.get('html')
        .should('contain', 'How to manage your bad temper')
        .and('contain', 'Steve Jobs')
    })

    it('users can like a blog',function(){
      cy.createBlog({
        title: 'How to manage your bad temper',
        author: 'Steve Jobs',
        url:'www.apple.com',
        likes: 0
      })
      cy.get('html')
        .should('contain', 'How to manage your bad temper')
        .and('contain', 'Steve Jobs')
      cy.contains('view').click()
      cy.contains('like').click()
      cy.contains('likes 1')
    })
    it('user can create a blog and delete it',function(){
      cy.createBlog({
        title: 'How to manage your bad temper',
        author: 'Steve Jobs',
        url:'www.apple.com',
        likes: 0
      })
      cy.get('html')
        .should('contain', 'How to manage your bad temper')
        .and('contain', 'Steve Jobs')
      cy.contains('view').click()
      cy.contains('remove').click()
      cy.get('html')
        .should('contain', 'deleted')
    })
  })
  describe('Steve created blog then Mary...', function() {
    beforeEach(function() {
      // log in user here
      cy.login({ username: 'steve', password: '1111' })
      cy.createBlog({
        title: 'How to manage your bad temper',
        author: 'Steve Jobs',
        url:'www.apple.com',
        likes: 0
      })
    })

    it('Mary log in and click like', function() {
      cy.login({ username: 'mary', password: '2222' })
      cy.contains('view').click()
      cy.contains('like').click()
      cy.contains('likes 1')
    })

    it('Mary log in and try to delete blog but fail', function() {
      cy.login({ username: 'mary', password: '2222' })
      cy.contains('view').click()
      cy.contains('remove').click()
      cy.contains('deleted').should('not.exist')
    })
  })

  describe('Testing blogs are ordered by likes', function() {
    beforeEach(function() {
      // log in user here
      cy.login({ username: 'steve', password: '1111' })
      cy.createBlog({
        title: '1Likes',
        author: 'Steve Jobs',
        url:'www.apple.com',
        likes: 0
      })
      cy.createBlog({
        title: '2Likes',
        author: 'Steve Jobs',
        url:'www.apple.com',
        likes: 0
      })

      cy.createBlog({
        title: '3Likes',
        author: 'Steve Jobs',
        url:'www.apple.com',
        likes: 0
      })
      cy.createBlog({
        title: '4Likes',
        author: 'Steve Jobs',
        url:'www.apple.com',
        likes: 0
      })
    })

    it('trying go count all blogs', function() {
      cy.get('.bodyOfBlog').then( blogs => {
        cy.wrap(blogs[0]).contains('view').click()
        cy.wrap(blogs[0]).contains('like').click()
        cy.wait(500)
        cy.wrap(blogs[0]).contains('like').click()
        cy.wait(500)
        cy.wrap(blogs[0]).contains('like').click()
      })
    })
    it.only('click 4 likes', function() {
      cy.get('.bodyOfBlog').then( blogs => {
        // click 1
        cy.wrap(blogs[0]).contains('view').click()
        cy.wrap(blogs[0]).contains('like').click()
        cy.wait(500)
        // click 2
        cy.wrap(blogs[1]).contains('view').click()
        cy.wrap(blogs[1]).contains('like').click()
        cy.wait(500)
        cy.wrap(blogs[1]).contains('like').click()
        cy.wait(500)
        // click 3
        cy.wrap(blogs[2]).contains('view').click()
        cy.wrap(blogs[2]).contains('like').click()
        cy.wait(500)
        cy.wrap(blogs[2]).contains('like').click()
        cy.wait(500)
        cy.wrap(blogs[2]).contains('like').click()
        cy.wait(500)
        // click 4
        cy.wrap(blogs[3]).contains('view').click()
        cy.wrap(blogs[3]).contains('like').click()
        cy.wait(500)
        cy.wrap(blogs[3]).contains('like').click()
        cy.wait(500)
        cy.wrap(blogs[3]).contains('like').click()
        cy.wait(500)
        cy.wrap(blogs[3]).contains('like').click()
        cy.wait(500)
        // verify
        cy.visit('http://localhost:3000')
        cy.get('.bodyOfBlog').then( blogs => {
          cy.wrap(blogs[0]).contains('4Likes')
          cy.wrap(blogs[1]).contains('3Likes')
          cy.wrap(blogs[2]).contains('2Likes')
          cy.wrap(blogs[3]).contains('1Likes')
        })
      })
    })
  })
})