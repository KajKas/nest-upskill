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
      .where('supplier.name LIKE :name', { name: `%${name}%` })
      .getMany();
  }

  async customSave(supplier: Supplier): Promise<Supplier> {
    if (supplier.id) {
      await this.update(supplier.id, {
        name: supplier.name,
        email: supplier.email,
      });
      return this.findOneBy({ id: supplier.id });
    } else {
      const result = await this.insert({
        name: supplier.name,
        email: supplier.email,
      });
      return this.findOneBy({ id: result.identifiers[0].id });
    }
  }

  async createSupplier(supplierData: Partial<Supplier>): Promise<Supplier> {
    const supplier = this.create(supplierData);
    return this.customSave(supplier);
  }

  async updateSupplier(
    id: number,
    supplierData: Partial<Supplier>,
  ): Promise<Supplier> {
    await this.update({ id }, supplierData);
    return this.findOneBy({ id });
  }

  async deleteSupplier(id: number): Promise<boolean> {
    const result = await this.delete({ id });
    return result.affected > 0;
  }
}
