export class AddManagersCommand {
  constructor(
    public readonly supplierId: string,
    public readonly managers: number[],
  ) {}
}
// walidacja id do stringa
