import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus } from '@nestjs/cqrs';
import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AddManagerToSupplierController } from './add-managers.controller';

describe('AddManagerToSupplierController (e2e)', () => {
  let app: INestApplication;
  let commandBus: CommandBus;

  beforeEach(async () => {
    const mockCommandBus = {
      execute: jest.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AddManagerToSupplierController],
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

  describe('PATCH /suppliers/:id/managers', () => {
    describe('when valid payload provided', () => {
      it('should add managers to a supplier', () => {
        const supplierId = '1';
        const managers = [1, 2, 3];

        const expectedResponse = {
          id: supplierId,
          name: 'Test Supplier',
          managers: managers,
        };

        jest
          .spyOn(commandBus, 'execute')
          .mockResolvedValueOnce(expectedResponse);

        return request(app.getHttpServer())
          .patch(`/suppliers/${supplierId}/managers`)
          .send({ managers })
          .expect(200)
          .expect(expectedResponse);
      });
    });

    describe('when managers array is empty', () => {
      it('should return 400', () => {
        const supplierId = '1';

        return request(app.getHttpServer())
          .patch(`/suppliers/${supplierId}/managers`)
          .send({ managers: [] })
          .expect(400);
      });
    });

    describe('when managers is not an array', () => {
      it('should return 400', () => {
        const supplierId = '1';

        return request(app.getHttpServer())
          .patch(`/suppliers/${supplierId}/managers`)
          .send({ managers: 'invalid' })
          .expect(400);
      });
    });

    describe('when managers array contains non-numeric values', () => {
      it('should return 400', () => {
        const supplierId = '1';

        return request(app.getHttpServer())
          .patch(`/suppliers/${supplierId}/managers`)
          .send({ managers: [1, 'two', 3] })
          .expect(400);
      });
    });
  });
});
