export class OrganizationType {
  id: String = "";
  org_name: String = "";
}

export class Region {
  id: String = "";
  region_name: String = ";";
}

export class LookupValues {
  organizationTypes: OrganizationType[] = [];
  regions: Region[] = [];
}
