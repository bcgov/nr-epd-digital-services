export enum IChangeType {
  Added,
  Modified,
  Deleted,
  None,
}

export class ChangeTracker {
  changeType: IChangeType = IChangeType.None;
  label: string = '';

  constructor(changeType: IChangeType, label: string) {
    this.changeType = changeType;
    this.label = label;
  }

  toPlainObject() {
    return {
      changeType: this.changeType,
      label: this.label,
    };
  }
}
