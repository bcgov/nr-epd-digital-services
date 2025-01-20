export class Peoples {
  id: number;
  peopleId: number;
  address: string;
  city: string;
  region: string;
  lastUpdatedDate: string;

  constructor() {
    this.id = 0;
    this.peopleId = 0;
    this.address = "";
    this.city = "";
    this.region = "";
    this.lastUpdatedDate = "";
  }
}

export class PeopleResultDto {
  page: string = "";
  pageSize: string = "";
  count: String = "";
  peoples: Peoples[] = [];
}
