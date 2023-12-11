const request = require('supertest');

const { expressHelper } = require('../../../common/helper');
const router = require('../../../../src/routes/v1/object');

const { objectController } = require('../../../../src/controllers');

// Express Server
const basePath = '/api/v1/object';
const app = expressHelper(basePath, router);

// Mock config library - @see {@link https://stackoverflow.com/a/64819698}
jest.mock('config');

describe(`GET ${basePath}`, () => {
  const spy = jest.spyOn(objectController, 'searchObjects');

  beforeEach(() => {
    spy.mockReset();
  });

  it('Should call controller', async () => {
    // eslint-disable-next-line no-unused-vars
    spy.mockImplementation((_req, res, _next) => res.status(200).end());
    await request(app).get(`${basePath}`);

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
