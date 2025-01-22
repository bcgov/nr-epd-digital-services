export class Peoples {
  id: number;
  firstName: string;
  lastName: string;
  address: string;
  email: string;
  taxExempt: boolean;
  active: boolean;
  lastUpdatedDate: string;

  constructor() {
    this.id = 0;
    this.firstName = "";
    this.address = "";
    this.lastName = "";
    this.email = "";
    this.lastUpdatedDate = "";
    this.taxExempt = false;
    this.active = false;
  }
}

export class PeopleResultDto {
  page: string = "";
  pageSize: string = "";
  count: String = "";
  peoples: Peoples[] = [];
}
