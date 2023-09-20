describe('API testing with Cypress', () => {
  it('get request', () => {
    cy.request('/users/2').then((resp) => {
      cy.log(JSON.stringify(resp));
    });
  })

  it('validate headers', () => {
    cy.request('/users/2').as('user');
    cy.get('@user')
      .its('headers')
      .its('content-type')
      .should('equal', 'application/json; charset=utf-8')
      .and('not.contain', 'pupu');
  })

  it('POST request', () => {
    cy.request({
      url: '/login',
      method: 'POST',
      body: { email: "eve.holt@reqres.in", password: "cityslicka" }
    }).as('loginRequest');

    cy.get('@loginRequest').its('status').should('equal', 200);
    cy.get('@loginRequest').its('body.token').should('equal', 'QpwL5tke4Pnpja7X4');
    // or
    cy.get('@loginRequest').then((resp) => {
      expect(resp.body.token).to.equal('QpwL5tke4Pnpja7X4');
    })
  })

  it('POST request - error', () => {
    cy.request({
      url: '/login',
      method: 'POST',
      failOnStatusCode: false,
      body: { email: "eve.holt@reqres.in" }
    }).as('loginRequest');

    cy.get('@loginRequest').then((res) => {
      expect(res.status).to.equal(400);
      expect(res.body.error).to.equal('Missing password');
    });
  })

  it('DELETE request', () => {
    cy.request({
      url: '/users/2',
      method: 'DELETE'
    }).as('deleteRequest');

    cy.get('@deleteRequest').its('status').should('equal', 204);
  })

  it('PUT request', () => {
    cy.request({
      url: '/users/2',
      method: 'PUT',
      body: { "name": "Alex", "job": "CEO" }
    }).as('putRequest');

    cy.get('@putRequest').its('status').should('equal', 200);
    cy.get('@putRequest').then((res) => {
      expect(res.body.name).to.equal('Alex');
      expect(res.body.job).equal('CEO');
    })
  })
})