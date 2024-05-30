export class Sites {
  id: number;
  siteId: number;
  address: string;
  city: string;
  region: string;
  lastUpdatedDate: string;

  constructor() {
    this.id = 0;
    this.siteId = 0;
    this.address = '';
    this.city = '';
    this.region = '';
    this.lastUpdatedDate = '';
  }
}

export class SiteResultDto {
  page: string = '';
  pageSize: string = '';
  count: String = '';
  sites: Sites[] = [];
}