export class SiteColumns {
  constructor(
    public id: number,
    public displayName: string,
    public active: boolean,
    public graphQLPropertyName: string,
    public groupId: number,
    public disabled: boolean,
    public isDefault: boolean,
    public sortOrder: number,
    public isChecked: boolean = false
  ) {}
}

const getSiteSearchResultsColumns = () => {
  const columns: SiteColumns[] = [
    {
      id: 1,
      displayName: "Site ID",
      active: true,
      graphQLPropertyName: "id",
      groupId: 1,
      disabled: false,
      isDefault: true,
      sortOrder: 1,
      isChecked:false
    },
    {
      id: 2,
      displayName: "Site Remediation Status",
      active: true,
      graphQLPropertyName: "srStatus",
      groupId: 1,
      disabled: false,
      isDefault: true,
      sortOrder: 1,
      isChecked:false
    },
    {
      id: 3,
      displayName: "Site Risk code",
      active: true,
      graphQLPropertyName: "siteRiskCode",
      groupId: 1,
      disabled: false,
      isDefault: true,
      sortOrder: 1,
      isChecked:false
    },
    {
      id: 4,
      displayName: "General Description",
      active: true,
      graphQLPropertyName: "generalDescription",
      groupId: 1,
      disabled: false,
      isDefault: true,
      sortOrder: 1,
      isChecked:false
    },
    {
      id: 5,
      displayName: "Common Name",
      active: true,
      graphQLPropertyName: "commonName",
      groupId: 2,
      disabled: false,
      isDefault: true,
      sortOrder: 1,
      isChecked:false
    },
    {
      id: 6,
      displayName: "Site Address",
      active: true,
      graphQLPropertyName: "addrLine_1,addrLine_2,addrLine_3",
      groupId: 2,
      disabled: false,
      isDefault: true,
      sortOrder: 1,
      isChecked:false
    },
    {
      id: 7,
      displayName: "City",
      active: true,
      graphQLPropertyName: "city",
      groupId: 2,
      disabled: false,
      isDefault: true,
      sortOrder: 1,
      isChecked:false
    },
    {
      id: 8,
      displayName: "Latitude",
      active: true,
      graphQLPropertyName: "latdeg",
      groupId: 2,
      disabled: false,
      isDefault: true,
      sortOrder: 1,
      isChecked:false
    },
    {
      id: 9,
      displayName: "Latitude(D,M,S)",
      active: true,
      graphQLPropertyName: "latDegrees,latMinutes,latSeconds",
      groupId: 3,
      disabled: false,
      isDefault: true,
      sortOrder: 1,
      isChecked:false
    },
    {
      id: 10,
      displayName: "Longitude",
      active: true,
      graphQLPropertyName: "longdeg",
      groupId: 3,
      disabled: false,
      isDefault: true,
      sortOrder: 1,
      isChecked:false
    },
    {
      id: 11,
      displayName: "Longitude(D,M,S)",
      active: true,
      graphQLPropertyName: "longDegrees,longMinutes,longSeconds",
      groupId: 3,
      disabled: false,
      isDefault: true,
      sortOrder: 1,
      isChecked:false
    },
    {
      id: 12,
      displayName: "Lat/Long Reliability",
      active: true,
      graphQLPropertyName: "latlongReliabilityFlag",
      groupId: 3,
      disabled: false,
      isDefault: true,
      sortOrder: 1,
      isChecked:false
    },
    {
      id: 13,
      displayName: "Created By",
      active: true,
      graphQLPropertyName: "whoCreated",
      groupId: 4,
      disabled: false,
      isDefault: true,
      sortOrder: 1,
      isChecked:false
    },
    {
      id: 14,
      displayName: "Date Created",
      active: true,
      graphQLPropertyName: "whenCreated",
      groupId: 4,
      disabled: false,
      isDefault: true,
      sortOrder: 1,
      isChecked:false
    },
    {
      id: 15,
      displayName: "Last Updated",
      active: true,
      graphQLPropertyName: "whenCreated",
      groupId: 4,
      disabled: false,
      isDefault: true,
      sortOrder: 1,
      isChecked:false
    },
    {
      id: 16,
      displayName: "Consultant Submitted",
      active: true,
      graphQLPropertyName: "consultantSubmitted",
      groupId: 4,
      disabled: false,
      isDefault: true,
      sortOrder: 1,
      isChecked:false
    },
  ];
  return columns;
};

export { getSiteSearchResultsColumns };

export default SiteColumns;
