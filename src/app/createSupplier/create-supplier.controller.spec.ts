import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus } from '@nestjs/cqrs';
import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { SupplierController } from './create-supplier.controller';

describe('SupplierController (e2e)', () => {
  let app: INestApplication;
  let commandBus: CommandBus;

  beforeEach(async () => {
    const mockCommandBus = {
      execute: jest.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [SupplierController],
      providers: [
        {
          provide: CommandBus,
          useValue: mockCommandBus,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        stopAtFirstError: true,
      }),
    );
    await app.init();

    commandBus = moduleFixture.get<CommandBus>(CommandBus);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /suppliers', () => {
    describe('when valid payload provided', () => {
      it('should create a new supplier', () => {
        const supplierData = {
          name: 'Test Supplier',
          email: 'test@supplier.com',
          address: '123 Test St',
          phone: '123-456-7890',
        };

        const expectedResponse = {
          id: '1',
          ...supplierData,
        };

        jest
          .spyOn(commandBus, 'execute')
          .mockResolvedValueOnce(expectedResponse);

        return request(app.getHttpServer())
          .post('/suppliers')
          .send(supplierData)
          .expect(201)
          .expect(expectedResponse);
      });
    });

    describe('when name is missing', () => {
      it('should return 400', async () => {
        const invalidData = {
          email: 'test@supplier.com',
          address: '123 Test St',
          phone: '123-456-7890',
        };

        jest.spyOn(commandBus, 'execute').mockRejectedValueOnce({
          status: 400,
          message: 'Name is required',
        });

        return request(app.getHttpServer())
          .post('/suppliers')
          .send(invalidData)
          .expect(400);
      });
    });

    describe('when email is invalid', () => {
      it('should return 400', async () => {
        const invalidData = {
          name: 'Test Supplier',
          email: 'invalid-email',
          address: '123 Test St',
          phone: '123-456-7890',
        };

        jest.spyOn(commandBus, 'execute').mockRejectedValueOnce({
          status: 400,
          message: 'Email is invalid',
        });

        return request(app.getHttpServer())
          .post('/suppliers')
          .send(invalidData)
          .expect(400);
      });
    });
  });
});
