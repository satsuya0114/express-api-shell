process.env.ENV = 'dev';

const request = require('supertest');
const app = require('../../app');
const server = require('../../bin/www');

const sum = (a, b) => (a + b);

// update

afterAll((done) => {
  setTimeout(() => {
    console.log('After all done');
    server.close();
    return done();
  }, 3000);
});

test('add 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});

test('object assignment', () => {
  const data = { one: 1 };
  data.two = 2;
  expect(data).toEqual({ one: 1, two: 2 });
});

// describe('GET /devices/:device_id', () => {
//   test('success request', (done) => {
//     request(app)
//       .get('/devices/device1')
//       .set({ 'Content-Type': 'application/json', Authorization: 'JSON {"app_key":"11111-bfd6dac1-ddd9-4b57-b101-1d1a66a40616", "app_id":"16332180-b963-11e7-81c9-158522071c11"}'})
//       .then((response) => {
//         expect(response.statusCode).toBe(200);
//         // console.log(response.body);
//         expect(response.body).toEqual(expect.any(Object));
//         expect(response.body).toEqual(expect.objectContaining({
//           device_id: expect.any(String),
//           device_name: expect.any(String),
//           device_ip: expect.any(String),
//           scenemode_id: expect.any(String),
//           device_port: expect.any(Number),
//           device_attribute: expect.any(Array),
//           time_used: expect.any(Number)
//         }));
//         expect(response.body).toHaveProperty('device_did');
//         expect(response.body).toHaveProperty('device_password');
//         expect(response.body).toHaveProperty('device_zone');
//         done();
//       });
//   });
//   test('not exist device', (done) => {
//     request(app)
//       .get('/devices/xxx')
//       .set({ 'Content-Type': 'application/json', Authorization: 'JSON {"app_key":"11111-bfd6dac1-ddd9-4b57-b101-1d1a66a40616", "app_id":"16332180-b963-11e7-81c9-158522071c11"}' })
//       .then((response) => {
//         expect(response.statusCode).toBe(400);
//         // console.log(response.body);
//         expect(response.body).toEqual(expect.any(Object));
//         expect(response.body).toEqual(expect.objectContaining({
//           time_used: expect.any(Number)
//         }));
//         expect(response.body.errorCode).toBe('INVALID_DEVICE_ID');
//         done();
//       });
//   });
// });
