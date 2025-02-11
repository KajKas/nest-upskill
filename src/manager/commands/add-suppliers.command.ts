export class AddSuppliersCommand {
  constructor(
    public readonly managerId: string,
    public readonly suppliers: number[],
  ) {}
}
