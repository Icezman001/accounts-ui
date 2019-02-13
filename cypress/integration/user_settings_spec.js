describe('User Settings Flow', () => {
  const timeStamp = Date.now()

  it('Changes name', () => {
    cy.login(Cypress.env('validEmail'), Cypress.env('validPassword'))

    cy.get('#root > section > header > nav.UserNav.UserNav').click({
      force: true
    })
    cy.get('#userNavDropdown > li:nth-child(3) > a').click()

    cy.get('.AppMain input[name="firstName"]')
      .clear()
      .type('name')

    cy.get(
      'section.AppMain > section > div > div > article:nth-child(1) > footer > button'
    ).click()

    cy.get('#notificationMessage', { timeout: 10000 }).should(
      'contain',
      'Name updated'
    )
  })

  it('Adds email', () => {
    cy.login(Cypress.env('validEmail'), Cypress.env('validPassword'))

    cy.get('#root > section > header > nav.UserNav.UserNav').click({
      force: true
    })
    cy.get('#userNavDropdown > li:nth-child(3) > a').click()

    cy.get('.AppMain input[name="name"]').type('Email Name')
    cy.get('.AppMain input[name="email"]').type('testEmail@zesty.io')
    cy.get(
      'section.AppMain > section > div > div > article:nth-child(2) > footer > button'
    ).click()

    cy.get('#notificationMessage', { timeout: 3000 }).should(
      'contain',
      'Email added'
    )
  })

  it('Removes email', () => {
    cy.login(Cypress.env('validEmail'), Cypress.env('validPassword'))
    cy.get('#root > section > header > nav.UserNav.UserNav').click({
      force: true
    })
    cy.get('#userNavDropdown > li:nth-child(3) > a').click()

    cy.get(
      '#root > section > section.AppMain > section > div > div > article:nth-child(2) > main'
    )
      .children('div')
      .last()
      .children('i')
      .last()
      .click()

    cy.get('#notificationMessage', { timeout: 10000 }).should(
      'contain',
      'email successfully removed'
    )
  })

  it('Changes password', () => {
    cy.login(Cypress.env('validEmail'), Cypress.env('validPassword'))

    cy.get('#root > section > header > nav.UserNav.UserNav').click({
      force: true
    })
    cy.get('#userNavDropdown > li:nth-child(3) > a').click()

    cy.get(
      '#root > section > section.AppMain > section > div > div > article:nth-child(3) > main > input:nth-child(2)'
    ).type(Cypress.env('validPassword'))
    cy.get(
      '#root > section > section.AppMain > section > div > div > article:nth-child(3) > main > input:nth-child(3)'
    ).type('newValidPass2')
    cy.get(
      '#root > section > section.AppMain > section > div > div > article:nth-child(3) > main > input:nth-child(4)'
    ).type('newValidPass2')
    cy.get(
      '#root > section > section.AppMain > section > div > div > article:nth-child(3) > footer > button'
    ).click()

    cy.wait(2000)
    //
    // handle logout redirect
    cy.get('#confirmTrue').click()
    //
    // set password back

    cy.login(Cypress.env('validEmail'), 'newValidPass2')

    cy.get('#root > section > header > nav.UserNav.UserNav').click({
      force: true
    })
    cy.get('#userNavDropdown > li:nth-child(3) > a').click()

    cy.get(
      '#root > section > section.AppMain > section > div > div > article:nth-child(3) > main > input:nth-child(2)'
    ).type('newValidPass2')
    cy.get(
      '#root > section > section.AppMain > section > div > div > article:nth-child(3) > main > input:nth-child(3)'
    ).type(Cypress.env('validPassword'))
    cy.get(
      '#root > section > section.AppMain > section > div > div > article:nth-child(3) > main > input:nth-child(4)'
    ).type(Cypress.env('validPassword'))
    cy.get(
      '#root > section > section.AppMain > section > div > div > article:nth-child(3) > footer > button'
    ).click()

    cy.wait(2000)

    cy.get('#confirmTrue').click()
  })
})
