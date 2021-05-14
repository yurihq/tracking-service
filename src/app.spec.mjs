import test from 'ava';
import got from 'got';

import app from './app.mjs';

test.serial.before(async (t) => {
  await app.listen(8080);
});

test.beforeEach(async (t) => {
  await new Promise((r) => setTimeout(r, 1000));
});

test.serial('Must track events', async (t) => {
  const response = await got.post('http://localhost:8080/track', {
    searchParams: {
      id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
    }
  });

  t.is(response.statusCode, 204);
  t.truthy(response.headers['set-cookie']);
});

test.serial('Must provide event stats', async (t) => {
  const response = await got.get('http://localhost:8080/stats', {
    searchParams: {
      id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      from: new Date(Date.now() - 100000).toISOString(),
      to: new Date().toISOString()
    },
    responseType: 'json'
  });

  const { count } = response.body;

  t.is(response.statusCode, 200);
  t.true(count > 0);
});