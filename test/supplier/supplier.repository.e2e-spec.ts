import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { SupplierRepository } from '../../src/domain/suppliers/supplier.repository';
import { Supplier } from '../../src/infrastructure/supplier/supplier.entity';
import { Manager } from '../../src/infrastructure/manager/manager.entity';
import { testDbConfig } from '../test-db.config';

describe('SupplierRepository', () => {
  let repository: SupplierRepository;
  let dataSource: DataSource;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(testDbConfig),
        TypeOrmModule.forFeature([Supplier, Manager]),
      ],
      providers: [SupplierRepository],
    }).compile();

    repository = module.get<SupplierRepository>(SupplierRepository);
    dataSource = module.get<DataSource>(DataSource);
  }, 30000);

  beforeEach(async () => {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0');
      await queryRunner.query('TRUNCATE TABLE manager_suppliers_supplier');
      await queryRunner.query('TRUNCATE TABLE supplier');
      await queryRunner.query('TRUNCATE TABLE manager');
      await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1');
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  });

  afterAll(async () => {
    if (dataSource && dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });

  describe('findByName', () => {
    it('should find suppliers by partial name match', async () => {
      const supplier1 = await repository.createSupplier({
        name: 'Test Supplier 1',
        email: 'test1@example.com',
      });

      const result = await repository.findByName('Test');

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(supplier1.id);
      expect(result[0].name).toBe('Test Supplier 1');
    });
  });

  describe('customSave', () => {
    it('should create a new supplier when id is not provided', async () => {
      const supplierData = {
        name: 'New Supplier',
        email: 'new@example.com',
      };

      const result = await repository.customSave(
        repository.create(supplierData),
      );

      expect(result.id).toBeDefined();
      expect(result.name).toBe(supplierData.name);
      expect(result.email).toBe(supplierData.email);
    });

    it('should update existing supplier when id is provided', async () => {
      const supplier = await repository.createSupplier({
        name: 'Original Name',
        email: 'original@example.com',
      });

      const updateData = {
        ...supplier,
        name: 'Updated Name',
      };

      const result = await repository.customSave(updateData);

      expect(result.id).toBe(supplier.id);
      expect(result.name).toBe('Updated Name');
      expect(result.email).toBe('original@example.com');
    });
  });

  describe('updateSupplier', () => {
    it('should update supplier and return updated entity', async () => {
      const supplier = await repository.createSupplier({
        name: 'Test Supplier',
        email: 'test@example.com',
      });

      const result = await repository.updateSupplier(supplier.id, {
        name: 'Updated Name',
      });

      expect(result.id).toBe(supplier.id);
      expect(result.name).toBe('Updated Name');
      expect(result.email).toBe('test@example.com');
    });
  });

  describe('deleteSupplier', () => {
    it('should delete supplier and return true', async () => {
      const supplier = await repository.createSupplier({
        name: 'To Delete',
        email: 'delete@example.com',
      });

      const result = await repository.deleteSupplier(supplier.id);

      expect(result).toBe(true);
      const found = await repository.findOneBy({ id: supplier.id });
      expect(found).toBeNull();
    });
  });
});
