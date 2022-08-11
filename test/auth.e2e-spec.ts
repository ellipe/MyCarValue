import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { setupApp } from '../src/setupApp';

describe('Authentication System', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // setupApp(app);  // <---------- a simpler way.
    await app.init();
  });

  it('/signup (GET) - handles signup request', () => {
    const email = 'some42@mail.com';

    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'somepassword' })
      .expect(201)
      .then((res) => {
        const { id, email: _email } = res.body;
        expect(id).toBeDefined();
        expect(_email).toEqual(email);
      });
  });
});
