import { CreateSupplierCommand } from './create-supplier.command';

describe('CreateSupplierCommand', () => {
  describe('when valid payload provided', () => {
    it('should not return errors', async () => {
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
  });

  describe('when too short name provided', () => {
    it('should fail with proper error', async () => {
      const command = new CreateSupplierCommand({
        name: 'a',
        email: 'test@test.com',
        managers: [1],
      });

      const errors = await command.validate();
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('name');
    });
  });

  describe('when name is not a string', () => {
    it('should fail with proper error', async () => {
      const command = new CreateSupplierCommand({
        name: 1 as any,
        email: 'test@test.com',
        managers: [1],
      });

      const errors = await command.validate();
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('name');
    });
  });

  describe('when email is invalid', () => {
    it('should fail with proper error', async () => {
      const command = new CreateSupplierCommand({
        name: 'Test Supplier',
        email: 'invalid-email',
        managers: [1],
      });

      const errors = await command.validate();
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('email');
    });
  });

  describe('when managers are invalid', () => {
    it('should fail with proper error', async () => {
      const command = new CreateSupplierCommand({
        name: 'Test Supplier',
        email: 'test@test.com',
        managers: [0, -1],
      });

      const errors = await command.validate();
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('managers');
    });
  });

  describe('when managers are not numeric', () => {
    it('should fail with proper error', async () => {
      const command = new CreateSupplierCommand({
        name: 'Test Supplier',
        email: 'test@test.com',
        managers: ['1' as any],
      });

      const errors = await command.validate();
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('managers');
    });
  });

  describe('when all fields are invalid', () => {
    it('should fail with proper error', async () => {
      const command = new CreateSupplierCommand({
        name: 'a',
        email: 'invalid-email',
        managers: ['1' as any],
      });

      const errors = await command.validate();
      expect(errors).toHaveLength(3);
      expect(errors.some((error) => error.property === 'name')).toBeTruthy();
      expect(errors.some((error) => error.property === 'email')).toBeTruthy();
      expect(
        errors.some((error) => error.property === 'managers'),
      ).toBeTruthy();
    });
  });
});
