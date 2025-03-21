export class Peoples {
  id: string;
  firstName: string;
  lastName: string;
  isTaxExempt: boolean;
  address: string;
  email: string;
  isActive: boolean;
  lastUpdatedDate: string;
  isEnvConsultant: boolean;
  loginUserName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  province: string;
  country: string;
  postalCode: string;

  constructor() {
    this.id = '';
    this.firstName = '';
    this.address = '';
    this.lastName = '';
    this.email = '';
    this.lastUpdatedDate = '';
    this.isTaxExempt = false;
    this.isEnvConsultant = false;
    this.isActive = false;
    this.loginUserName = '';
    this.addressLine1 = '';
    this.addressLine2 = '';
    this.city = '';
    this.province = '';
    this.country = '';
    this.postalCode = '';
  }
}

export class PeopleResultDto {
  page: string = '';
  pageSize: string = '';
  count: String = '';
  peoples: Peoples[] = [];
}
