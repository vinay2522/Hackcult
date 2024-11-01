const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const Evidence = require('../models/Evidence');
const { setupDatabase, userOne } = require('./fixtures/db');

beforeEach(setupDatabase);

describe('Evidence API', () => {
  test('Should create new evidence', async () => {
    const response = await request(app)
      .post('/api/evidence')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .attach('file', 'tests/fixtures/test-image.jpg')
      .field('title', 'Test Evidence')
      .field('description', 'Test Description')
      .field('datetime', new Date())
      .field('location', 'Test Location')
      .expect(201);

    // Assert that the database was changed correctly
    const evidence = await Evidence.findById(response.body.data._id);
    expect(evidence).not.toBeNull();
  });
});