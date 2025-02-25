import { CreateSupplierCommand } from './create-supplier.command';

describe('CreateSupplierCommand', () => {
  it('should create a valid command', async () => {
    const payload = {
      name: 'Test Supplier',
      email: 'test@example.com',
      managers: [1, 2, 3],
    };

    const command = new CreateSupplierCommand(payload);

    expect(command.name).toBe(payload.name);
    expect(command.email).toBe(payload.email);
    expect(command.managers).toEqual(payload.managers);

    const errors = await command.validate();
    expect(errors).toHaveLength(0);
  });

  it('should fail validation with invalid name - too short', async () => {
    const command = new CreateSupplierCommand({
      name: 'a',
      email: 'test@test.com',
      managers: [1],
    });

    const errors = await command.validate();
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('name');
  });

  it('should fail validation with invalid name - not a string', async () => {
    const command = new CreateSupplierCommand({
      name: 1 as any,
      email: 'test@test.com',
      managers: [1],
    });

    const errors = await command.validate();
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('name');
  });

  it('should fail validation with invalid email', async () => {
    const command = new CreateSupplierCommand({
      name: 'Test Supplier',
      email: 'invalid-email',
      managers: [1],
    });

    const errors = await command.validate();
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('email');
  });

  it('should fail validation with invalid managers', async () => {
    const command = new CreateSupplierCommand({
      name: 'Test Supplier',
      email: 'test@test.com',
      managers: [0, -1],
    });

    const errors = await command.validate();
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('managers');
  });

  it('should fail validation with non-numeric managers', async () => {
    const command = new CreateSupplierCommand({
      name: 'Test Supplier',
      email: 'test@test.com',
      managers: ['1' as any],
    });

    const errors = await command.validate();
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('managers');
  });

  it('should fail validation with all fields invalid', async () => {
    const command = new CreateSupplierCommand({
      name: 'a',
      email: 'invalid-email',
      managers: ['1' as any],
    });

    const errors = await command.validate();
    expect(errors).toHaveLength(3);
    expect(errors.some((error) => error.property === 'name')).toBeTruthy();
    expect(errors.some((error) => error.property === 'email')).toBeTruthy();
    expect(errors.some((error) => error.property === 'managers')).toBeTruthy();
  });
});
