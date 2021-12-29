import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', () => {
    const email = 'asdlkj12312q@akl.com';

    return request(app.getHttpServer())
      .post('/auth/create-account')
      .send({ email, password: 'alskdfjl' })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(email);
      });
  });

  it('create account then get currently logged in user', async () => {
    const email = 'k@mit.edu'; 
    const password = '1234'

    const res = await  request(app.getHttpServer())
      .post('/auth/create-account')
      .send({email, password})
      .expect(201)

      const cookie = res.get('Set-Cookie')
      const { body } = await request(app.getHttpServer())
        .get('/auth/current-user')
        .set('Cookie', cookie)
        .expect(200)
      
      expect(body.email).toEqual(email)
  })

});
