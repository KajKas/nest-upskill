import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Supplier } from './supplier.entity';

@Injectable()
export class SupplierRepository extends Repository<Supplier> {
  constructor(private dataSource: DataSource) {
    super(Supplier, dataSource.createEntityManager());
  }

  async findByName(name: string): Promise<Supplier[]> {
    return this.createQueryBuilder('supplier')
      .where('supplier.name ILIKE :name', { name: `%${name}%` })
      .getMany();
  }

  async customSave(supplier: Supplier): Promise<Supplier> {
    const queryBuilder = this.createQueryBuilder()
      .insert()
      .into(Supplier)
      .values(supplier);

    if (supplier.id) {
      queryBuilder.orUpdate(['name', 'email', 'managers'], ['id']);
    }

    await queryBuilder.execute();
    return supplier;
  }

  async createSupplier(supplierData: Partial<Supplier>): Promise<Supplier> {
    const supplier = this.create(supplierData);
    return this.customSave(supplier);
  }

  async updateSupplier(
    id: number,
    supplierData: Partial<Supplier>,
  ): Promise<Supplier> {
    await this.update(id, supplierData);
    return this.findOneBy({ id });
  }

  async deleteSupplier(id: number): Promise<boolean> {
    const result = await this.delete(id);
    return result.affected > 0;
  }
}
