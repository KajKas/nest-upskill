import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus } from '@nestjs/cqrs';
import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { SupplierController } from './supplier.controller';

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
    it('should create a new supplier', () => {
      const supplierData = {
        name: 'Test Supplier',
        email: 'test@supplier.com',
      };

      const expectedResponse = {
        id: '1',
        ...supplierData,
      };

      jest.spyOn(commandBus, 'execute').mockResolvedValueOnce(expectedResponse);

      return request(app.getHttpServer())
        .post('/suppliers')
        .send(supplierData)
        .expect(201)
        .expect(expectedResponse);
    });

    it('should return 400 when name is missing', () => {
      const invalidData = {
        email: 'test@supplier.com',
      };

      return request(app.getHttpServer())
        .post('/suppliers')
        .send(invalidData)
        .expect(400);
    });

    it('should return 400 when email is invalid', () => {
      const invalidData = {
        name: 'Test Supplier',
        email: 'invalid-email',
      };

      return request(app.getHttpServer())
        .post('/suppliers')
        .send(invalidData)
        .expect(400);
    });
  });

  describe('PATCH /suppliers/:id/managers', () => {
    it('should add managers to a supplier', () => {
      const supplierId = '1';
      const managers = [1, 2, 3];

      const expectedResponse = {
        id: supplierId,
        name: 'Test Supplier',
        managers: managers,
      };

      jest.spyOn(commandBus, 'execute').mockResolvedValueOnce(expectedResponse);

      return request(app.getHttpServer())
        .patch(`/suppliers/${supplierId}/managers`)
        .send({ managers })
        .expect(200)
        .expect(expectedResponse);
    });

    it('should return 400 when managers array is empty', () => {
      const supplierId = '1';

      return request(app.getHttpServer())
        .patch(`/suppliers/${supplierId}/managers`)
        .send({ managers: [] })
        .expect(400);
    });

    it('should return 400 when managers is not an array', () => {
      const supplierId = '1';

      return request(app.getHttpServer())
        .patch(`/suppliers/${supplierId}/managers`)
        .send({ managers: 'invalid' })
        .expect(400);
    });

    it('should return 400 when managers array contains non-numeric values', () => {
      const supplierId = '1';

      return request(app.getHttpServer())
        .patch(`/suppliers/${supplierId}/managers`)
        .send({ managers: [1, 'two', 3] })
        .expect(400);
    });
  });
});
