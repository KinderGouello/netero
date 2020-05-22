export class ReferenceList {
  private listOfId: string[];

  constructor(listOfId: string[]) {
    this.listOfId = listOfId;
  }

  getList(): string[] {
    return this.listOfId;
  }
}
