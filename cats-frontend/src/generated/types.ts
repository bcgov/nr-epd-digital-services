export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  _Any: { input: any; output: any; }
  _FieldSet: { input: any; output: any; }
  link__Import: { input: any; output: any; }
};

export type AddHousingInputDto = {
  applicationId: Scalars['Int']['input'];
  effectiveDate: Scalars['DateTime']['input'];
  expiryDate?: InputMaybe<Scalars['DateTime']['input']>;
  housingTypeId: Scalars['Int']['input'];
  isIndigenousLed?: InputMaybe<Scalars['Boolean']['input']>;
  isRental?: InputMaybe<Scalars['Boolean']['input']>;
  isSocial?: InputMaybe<Scalars['Boolean']['input']>;
  numberOfUnits: Scalars['Int']['input'];
  relatedApplicationIds?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type AppNoteDto = {
  __typename?: 'AppNoteDto';
  applicationId: Scalars['Int']['output'];
  createdBy: Scalars['String']['output'];
  createdDateTime: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  noteDate: Scalars['String']['output'];
  noteText: Scalars['String']['output'];
  updatedBy: Scalars['String']['output'];
  updatedDateTime: Scalars['DateTime']['output'];
};

export enum AppParticipantFilter {
  All = 'ALL',
  Main = 'MAIN'
}

export type AppParticipantsResponse = {
  __typename?: 'AppParticipantsResponse';
  data?: Maybe<Array<ViewAppParticipantsDto>>;
  httpStatusCode?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  timestamp?: Maybe<Scalars['String']['output']>;
};

export type ApplicationDetailsResponse = {
  __typename?: 'ApplicationDetailsResponse';
  data?: Maybe<ViewApplicationDetails>;
  httpStatusCode?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  timestamp?: Maybe<Scalars['String']['output']>;
};

export type ApplicationHousingDto = {
  __typename?: 'ApplicationHousingDto';
  housing: HousingDto;
  id: Scalars['Int']['output'];
};

export type ApplicationHousingResponse = {
  __typename?: 'ApplicationHousingResponse';
  data: Array<ApplicationHousingDto>;
  httpStatusCode?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  timestamp?: Maybe<Scalars['String']['output']>;
};

export type ApplicationNotesResponse = {
  __typename?: 'ApplicationNotesResponse';
  data: Array<AppNoteDto>;
  httpStatusCode?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  timestamp?: Maybe<Scalars['String']['output']>;
};

export type ApplicationResponse = {
  __typename?: 'ApplicationResponse';
  data?: Maybe<Array<ViewApplication>>;
  httpStatusCode?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  timestamp?: Maybe<Scalars['String']['output']>;
};

export type ApplicationResultDto = {
  __typename?: 'ApplicationResultDto';
  applicationType: Scalars['String']['output'];
  id: Scalars['String']['output'];
  lastUpdated: Scalars['String']['output'];
  priority: Scalars['String']['output'];
  siteAddress: Scalars['String']['output'];
  siteId: Scalars['String']['output'];
  staffAssigned: Array<ApplicationResultPersonDto>;
  status: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type ApplicationResultPersonDto = {
  __typename?: 'ApplicationResultPersonDto';
  firstName: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
};

export type ApplicationSearchResponse = {
  __typename?: 'ApplicationSearchResponse';
  applications: Array<ApplicationResultDto>;
  count?: Maybe<Scalars['Float']['output']>;
  httpStatusCode?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  page?: Maybe<Scalars['Float']['output']>;
  pageSize?: Maybe<Scalars['Float']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  timestamp?: Maybe<Scalars['String']['output']>;
};

export enum ApplicationSortByDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export enum ApplicationSortByField {
  ApplicationType = 'APPLICATION_TYPE',
  Id = 'ID',
  LastUpdated = 'LAST_UPDATED',
  Priority = 'PRIORITY',
  SiteAddress = 'SITE_ADDRESS',
  SiteId = 'SITE_ID',
  Status = 'STATUS'
}

export type ApplicationStatusDto = {
  applicationId: Scalars['Float']['input'];
  formId: Scalars['String']['input'];
  formsflowAppId: Scalars['Float']['input'];
  id?: InputMaybe<Scalars['Float']['input']>;
  isCurrent: Scalars['Boolean']['input'];
  statusTypeAbbrev: Scalars['String']['input'];
  submissionId: Scalars['String']['input'];
};

export type ApplicationStatusResponse = {
  __typename?: 'ApplicationStatusResponse';
  data?: Maybe<Array<ViewApplicationStatus>>;
  httpStatusCode?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  timestamp?: Maybe<Scalars['String']['output']>;
};

export type CreateAppParticipantDto = {
  applicationId: Scalars['Float']['input'];
  createdBy?: InputMaybe<Scalars['String']['input']>;
  createdDateTime?: InputMaybe<Scalars['DateTime']['input']>;
  effectiveEndDate?: InputMaybe<Scalars['DateTime']['input']>;
  effectiveStartDate: Scalars['DateTime']['input'];
  isMainParticipant?: InputMaybe<Scalars['Boolean']['input']>;
  organizationId?: InputMaybe<Scalars['Float']['input']>;
  participantRoleId: Scalars['Float']['input'];
  personId: Scalars['Float']['input'];
};

export type CreateAppParticipantsResponse = {
  __typename?: 'CreateAppParticipantsResponse';
  data?: Maybe<Array<ViewAppParticipantEntityDto>>;
  httpStatusCode?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  timestamp?: Maybe<Scalars['String']['output']>;
};

export type CreateApplication = {
  appTypeAbbrev: Scalars['String']['input'];
  applicationStatus: Array<ApplicationStatusDto>;
  receivedDate: Scalars['DateTime']['input'];
  siteId: Scalars['Float']['input'];
};

export type CreatePerson = {
  address_1?: InputMaybe<Scalars['String']['input']>;
  address_2?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  createdBy?: InputMaybe<Scalars['String']['input']>;
  createdDatetime?: InputMaybe<Scalars['DateTime']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  fax?: InputMaybe<Scalars['String']['input']>;
  firstName: Scalars['String']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  isEnvConsultant?: InputMaybe<Scalars['Boolean']['input']>;
  isTaxExempt?: InputMaybe<Scalars['Boolean']['input']>;
  lastName: Scalars['String']['input'];
  loginUserName?: InputMaybe<Scalars['String']['input']>;
  middleName?: InputMaybe<Scalars['String']['input']>;
  mobile?: InputMaybe<Scalars['String']['input']>;
  permissionIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  phone?: InputMaybe<Scalars['String']['input']>;
  postal?: InputMaybe<Scalars['String']['input']>;
  prov?: InputMaybe<Scalars['String']['input']>;
};

export type CreatePersonNote = {
  noteDescription: Scalars['String']['input'];
  personId: Scalars['Float']['input'];
};

export type DashboardResponse = {
  __typename?: 'DashboardResponse';
  data?: Maybe<Array<ViewDashboard>>;
  httpStatusCode?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  timestamp?: Maybe<Scalars['String']['output']>;
};

export type DeletePersonNote = {
  id: Scalars['String']['input'];
};

export type DetailField = {
  __typename?: 'DetailField';
  abbrev: Scalars['String']['output'];
  description: Scalars['String']['output'];
  id: Scalars['Float']['output'];
};

export type DropdownDto = {
  __typename?: 'DropdownDto';
  key: Scalars['String']['output'];
  metaData: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type DropdownResponse = {
  __typename?: 'DropdownResponse';
  data?: Maybe<Array<DropdownDto>>;
  httpStatusCode?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  timestamp?: Maybe<Scalars['String']['output']>;
};

export enum Filter {
  All = 'ALL',
  Completed = 'COMPLETED',
  Overcapacity = 'OVERCAPACITY',
  Unassigned = 'UNASSIGNED'
}

export type HousingDto = {
  __typename?: 'HousingDto';
  effectiveDate?: Maybe<Scalars['DateTime']['output']>;
  expiryDate?: Maybe<Scalars['DateTime']['output']>;
  housingType: HousingType;
  id: Scalars['Int']['output'];
  isIndigenousLed: YesNoCodeDto;
  isRental: YesNoCodeDto;
  isSocial: YesNoCodeDto;
  numberOfUnits: Scalars['Int']['output'];
  relatedApplications: Array<Scalars['Int']['output']>;
};

export type HousingType = {
  __typename?: 'HousingType';
  abbrev: Scalars['String']['output'];
  description: Scalars['String']['output'];
  id: Scalars['Int']['output'];
};

export type HousingTypeDto = {
  __typename?: 'HousingTypeDto';
  abbrev?: Maybe<Scalars['String']['output']>;
  description: Scalars['String']['output'];
  displayOrder: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  isActive: Scalars['Boolean']['output'];
};

export type HousingTypeResponse = {
  __typename?: 'HousingTypeResponse';
  data: Array<HousingTypeDto>;
};

export type InvoiceByApplicationIdDto = {
  __typename?: 'InvoiceByApplicationIdDto';
  dueDate: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  issuedDate: Scalars['DateTime']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  subject: Scalars['String']['output'];
  totalInCents: Scalars['Int']['output'];
};

export type InvoiceDto = {
  __typename?: 'InvoiceDto';
  applicationId: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  createdBy?: Maybe<Scalars['String']['output']>;
  dueDate: Scalars['DateTime']['output'];
  gstInCents: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  invoiceId?: Maybe<Scalars['Int']['output']>;
  issuedDate: Scalars['DateTime']['output'];
  lineItems: Array<InvoiceLineItemDto>;
  notes?: Maybe<Scalars['String']['output']>;
  pstExempt: Scalars['Boolean']['output'];
  pstInCents: Scalars['Int']['output'];
  recipientId: Scalars['Int']['output'];
  status: InvoiceStatus;
  subject: Scalars['String']['output'];
  subtotalInCents: Scalars['Int']['output'];
  taxExempt: Scalars['Boolean']['output'];
  totalInCents: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
  updatedBy: Scalars['String']['output'];
};

export type InvoiceInputDto = {
  applicationId: Scalars['Int']['input'];
  dueDate: Scalars['DateTime']['input'];
  gstInCents: Scalars['Int']['input'];
  invoiceId?: InputMaybe<Scalars['Int']['input']>;
  issuedDate: Scalars['DateTime']['input'];
  lineItems: Array<InvoiceLineItemInputDto>;
  notes?: InputMaybe<Scalars['String']['input']>;
  pstExempt: Scalars['Boolean']['input'];
  pstInCents: Scalars['Int']['input'];
  recipientId: Scalars['Int']['input'];
  status: InvoiceStatus;
  subject: Scalars['String']['input'];
  subtotalInCents: Scalars['Int']['input'];
  taxExempt: Scalars['Boolean']['input'];
  totalInCents: Scalars['Int']['input'];
};

export type InvoiceLineItemDto = {
  __typename?: 'InvoiceLineItemDto';
  createdAt: Scalars['DateTime']['output'];
  createdBy: Scalars['String']['output'];
  description: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  quantity: Scalars['Int']['output'];
  totalInCents: Scalars['Int']['output'];
  type: Scalars['String']['output'];
  unitPriceInCents: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
  updatedBy: Scalars['String']['output'];
};

export type InvoiceLineItemInputDto = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  createdBy?: InputMaybe<Scalars['String']['input']>;
  description: Scalars['String']['input'];
  id?: InputMaybe<Scalars['Float']['input']>;
  quantity: Scalars['Int']['input'];
  totalInCents: Scalars['Int']['input'];
  type: Scalars['String']['input'];
  unitPriceInCents: Scalars['Int']['input'];
};

export type InvoiceResponse = {
  __typename?: 'InvoiceResponse';
  httpStatusCode?: Maybe<Scalars['Int']['output']>;
  invoice?: Maybe<InvoiceDto>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  timestamp?: Maybe<Scalars['String']['output']>;
};

/** The status of an invoice */
export enum InvoiceStatus {
  Draft = 'DRAFT',
  Paid = 'PAID',
  Received = 'RECEIVED',
  Sent = 'SENT'
}

export type InvoicesByApplicationIdResponse = {
  __typename?: 'InvoicesByApplicationIdResponse';
  httpStatusCode?: Maybe<Scalars['Int']['output']>;
  invoices?: Maybe<Array<InvoiceByApplicationIdDto>>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  timestamp?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addHousingToApplication: ApplicationHousingResponse;
  createAppParticipant: CreateAppParticipantsResponse;
  createApplication: ApplicationResponse;
  createApplicationNote: ApplicationNotesResponse;
  createInvoice: InvoiceResponse;
  createPerson: PersonResponse;
  createPersonNote: PersonNoteResponse;
  deleteApplicationNotes: ApplicationNotesResponse;
  deleteInvoice: ResponseDto;
  deletePersonNote: PersonNoteResponse;
  updateAppParticipant: UpdateAppParticipantsResponse;
  updateApplicationHousing: ApplicationHousingResponse;
  updateApplicationNote: ApplicationNotesResponse;
  updateFormsflowAppId: ApplicationStatusResponse;
  updateInvoice: InvoiceResponse;
  updatePerson: PersonResponse;
  updatePersonNote: PersonNoteResponse;
  updateStaffAssigned: ResponseDto;
  upsertTimesheetDays: TimesheetDayResponse;
};


export type MutationAddHousingToApplicationArgs = {
  input: AddHousingInputDto;
};


export type MutationCreateAppParticipantArgs = {
  newAppParticipant: CreateAppParticipantDto;
};


export type MutationCreateApplicationArgs = {
  application: CreateApplication;
};


export type MutationCreateApplicationNoteArgs = {
  applicationId: Scalars['Int']['input'];
  noteDate: Scalars['DateTime']['input'];
  noteText: Scalars['String']['input'];
};


export type MutationCreateInvoiceArgs = {
  invoiceData: InvoiceInputDto;
};


export type MutationCreatePersonArgs = {
  person: CreatePerson;
};


export type MutationCreatePersonNoteArgs = {
  note: CreatePersonNote;
};


export type MutationDeleteApplicationNotesArgs = {
  noteIds: Array<Scalars['Int']['input']>;
};


export type MutationDeleteInvoiceArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeletePersonNoteArgs = {
  notes: Array<DeletePersonNote>;
};


export type MutationUpdateAppParticipantArgs = {
  updateAppParticipant: UpdateAppParticipantDto;
};


export type MutationUpdateApplicationHousingArgs = {
  input: UpdateHousingInputDto;
};


export type MutationUpdateApplicationNoteArgs = {
  noteDate: Scalars['DateTime']['input'];
  noteId: Scalars['Int']['input'];
  noteText: Scalars['String']['input'];
};


export type MutationUpdateFormsflowAppIdArgs = {
  appStatusInput: UpdateApplicationStatusDto;
};


export type MutationUpdateInvoiceArgs = {
  id: Scalars['Int']['input'];
  updateData: InvoiceInputDto;
};


export type MutationUpdatePersonArgs = {
  input: Array<UpdatePerson>;
};


export type MutationUpdatePersonNoteArgs = {
  id: Scalars['String']['input'];
  note: UpdatePersonNote;
};


export type MutationUpdateStaffAssignedArgs = {
  applicationId: Scalars['Int']['input'];
  applicationServiceTypeId: Scalars['Int']['input'];
  staffInput: Array<UpdateStaffAssignedDto>;
};


export type MutationUpsertTimesheetDaysArgs = {
  input: UpsertTimesheetDaysInputDto;
};

export type ParticipantsRolesResponse = {
  __typename?: 'ParticipantsRolesResponse';
  data?: Maybe<Array<ViewParticipantsRolesDto>>;
  httpStatusCode?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  timestamp?: Maybe<Scalars['String']['output']>;
};

export type PermissionsResponse = {
  __typename?: 'PermissionsResponse';
  data?: Maybe<Array<RoleWithPermissions>>;
  httpStatusCode?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  timestamp?: Maybe<Scalars['String']['output']>;
};

export type PersonNoteResponse = {
  __typename?: 'PersonNoteResponse';
  data?: Maybe<Array<ViewPersonNote>>;
  httpStatusCode?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  timestamp?: Maybe<Scalars['String']['output']>;
};

export type PersonResponse = {
  __typename?: 'PersonResponse';
  data?: Maybe<Array<ViewPerson>>;
  httpStatusCode?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  timestamp?: Maybe<Scalars['String']['output']>;
};

export type PersonWithTimesheetDaysDto = {
  __typename?: 'PersonWithTimesheetDaysDto';
  email?: Maybe<Scalars['String']['output']>;
  firstName: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  personId: Scalars['Int']['output'];
  timesheetDays: Array<TimesheetDayDto>;
};

export type PersonWithTimesheetDaysResponse = {
  __typename?: 'PersonWithTimesheetDaysResponse';
  data?: Maybe<Array<PersonWithTimesheetDaysDto>>;
  httpStatusCode?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  timestamp?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  _service: _Service;
  findAllPerson: PersonResponse;
  findPersonById: PersonResponse;
  getAllActiveStaffMembers: ViewStaffWithCapacityResponse;
  getAllActiveStaffMembersForApplicationServiceType: ViewStaffWithCapacityResponse;
  getAllParticipantRoles: ParticipantsRolesResponse;
  getAppParticipantsByAppId: AppParticipantsResponse;
  getApplicationDetailsById: ApplicationDetailsResponse;
  getApplicationHousingByApplicationId: ApplicationHousingResponse;
  getApplicationNotesByApplicationId: ApplicationNotesResponse;
  getApplicationServiceTypes: DropdownResponse;
  getApplications: DashboardResponse;
  getApplicationsByStaff: ViewApplicationResponse;
  getHousingTypes: HousingTypeResponse;
  getInvoiceById: InvoiceResponse;
  getInvoicesByApplicationId: InvoicesByApplicationIdResponse;
  getOrganizations: DropdownResponse;
  getParticipantNames: DropdownResponse;
  getPermissions: PermissionsResponse;
  getPersonNotesByPersonId: PersonNoteResponse;
  getRecentViewedApplications: DashboardResponse;
  getSiteDetailsBySiteId: SiteDetailsResponse;
  getStaffAssignedByAppId: ViewStaffAssignedResponse;
  getStaffs: StaffResponse;
  getTimesheetDaysForAssignedStaff: PersonWithTimesheetDaysResponse;
  searchApplications: ApplicationSearchResponse;
  searchApplicationsById: ApplicationSearchResponse;
  searchPerson: SearchPersonResponse;
};


export type QueryFindPersonByIdArgs = {
  id: Scalars['Float']['input'];
};


export type QueryGetAllActiveStaffMembersForApplicationServiceTypeArgs = {
  applicationServiceTypeId: Scalars['Int']['input'];
};


export type QueryGetAllParticipantRolesArgs = {
  roleType?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetAppParticipantsByAppIdArgs = {
  applicationId: Scalars['Int']['input'];
  filter?: InputMaybe<AppParticipantFilter>;
};


export type QueryGetApplicationDetailsByIdArgs = {
  id: Scalars['Int']['input'];
};


export type QueryGetApplicationHousingByApplicationIdArgs = {
  applicationId: Scalars['Int']['input'];
};


export type QueryGetApplicationNotesByApplicationIdArgs = {
  applicationId: Scalars['Int']['input'];
};


export type QueryGetApplicationsByStaffArgs = {
  page: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
  personId: Scalars['Int']['input'];
  roleId?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<StaffSortByField>;
  sortByDir?: InputMaybe<ApplicationSortByDirection>;
};


export type QueryGetInvoiceByIdArgs = {
  id: Scalars['Int']['input'];
};


export type QueryGetInvoicesByApplicationIdArgs = {
  applicationId: Scalars['Int']['input'];
};


export type QueryGetOrganizationsArgs = {
  searchParamForOrg: Scalars['String']['input'];
};


export type QueryGetParticipantNamesArgs = {
  searchParam: Scalars['String']['input'];
};


export type QueryGetPersonNotesByPersonIdArgs = {
  id: Scalars['Float']['input'];
};


export type QueryGetSiteDetailsBySiteIdArgs = {
  siteId: Scalars['String']['input'];
};


export type QueryGetStaffAssignedByAppIdArgs = {
  applicationId: Scalars['Int']['input'];
};


export type QueryGetStaffsArgs = {
  filter?: InputMaybe<Filter>;
  page: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
  sortBy?: InputMaybe<StaffSortByField>;
  sortByDir?: InputMaybe<ApplicationSortByDirection>;
};


export type QueryGetTimesheetDaysForAssignedStaffArgs = {
  applicationId: Scalars['Int']['input'];
  endDate: Scalars['String']['input'];
  startDate: Scalars['String']['input'];
};


export type QuerySearchApplicationsArgs = {
  filter: Filter;
  page: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
  searchParam: Scalars['String']['input'];
  sortBy?: InputMaybe<ApplicationSortByField>;
  sortByDir?: InputMaybe<ApplicationSortByDirection>;
};


export type QuerySearchApplicationsByIdArgs = {
  query: Scalars['String']['input'];
};


export type QuerySearchPersonArgs = {
  page: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
  searchParam: Scalars['String']['input'];
};

export type ResponseDto = {
  __typename?: 'ResponseDto';
  httpStatusCode?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  timestamp?: Maybe<Scalars['String']['output']>;
};

export type RoleWithPermissions = {
  __typename?: 'RoleWithPermissions';
  permissions: Array<ViewPermissions>;
  roleDescription: Scalars['String']['output'];
  roleId: Scalars['Float']['output'];
};

export type SearchPersonResponse = {
  __typename?: 'SearchPersonResponse';
  count?: Maybe<Scalars['Float']['output']>;
  httpStatusCode?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  page?: Maybe<Scalars['Float']['output']>;
  pageSize?: Maybe<Scalars['Float']['output']>;
  persons: Array<ViewPerson>;
  success?: Maybe<Scalars['Boolean']['output']>;
  timestamp?: Maybe<Scalars['String']['output']>;
};

export type SiteAssocs = {
  __typename?: 'SiteAssocs';
  associatedSite: SiteDetailsDto;
};

export type SiteDetailsDto = {
  __typename?: 'SiteDetailsDTO';
  addrLine_1?: Maybe<Scalars['String']['output']>;
  addrLine_2?: Maybe<Scalars['String']['output']>;
  addrLine_3?: Maybe<Scalars['String']['output']>;
  addrLine_4?: Maybe<Scalars['String']['output']>;
  associatedSites: Array<SiteAssocs>;
  city?: Maybe<Scalars['String']['output']>;
  commonName?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  latdeg?: Maybe<Scalars['Float']['output']>;
  longdeg?: Maybe<Scalars['Float']['output']>;
  siteRiskCode?: Maybe<Scalars['String']['output']>;
  whenCreated: Scalars['String']['output'];
  whenUpdated?: Maybe<Scalars['String']['output']>;
};

export type SiteDetailsResponse = {
  __typename?: 'SiteDetailsResponse';
  data?: Maybe<SiteDetailsDto>;
};

export type StaffAssignedDto = {
  __typename?: 'StaffAssignedDto';
  applicationServiceTypeId?: Maybe<Scalars['Float']['output']>;
  staffList: Array<ViewStaffAssignedDto>;
};

export type StaffResponse = {
  __typename?: 'StaffResponse';
  count?: Maybe<Scalars['Float']['output']>;
  data: Array<ViewStaff>;
  httpStatusCode?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  page?: Maybe<Scalars['Float']['output']>;
  pageSize?: Maybe<Scalars['Float']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  timestamp?: Maybe<Scalars['String']['output']>;
};

export enum StaffSortByField {
  Assignment = 'ASSIGNMENT',
  EndDate = 'END_DATE',
  Id = 'ID',
  Name = 'NAME',
  Role = 'ROLE',
  SiteAddress = 'SITE_ADDRESS',
  StartDate = 'START_DATE'
}

export type TimesheetDayDto = {
  __typename?: 'TimesheetDayDto';
  applicationId: Scalars['Int']['output'];
  date: Scalars['DateTime']['output'];
  hours?: Maybe<Scalars['Float']['output']>;
  id: Scalars['Int']['output'];
  personId: Scalars['Int']['output'];
};

export type TimesheetDayResponse = {
  __typename?: 'TimesheetDayResponse';
  data: Array<TimesheetDayDto>;
  httpStatusCode?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  timestamp?: Maybe<Scalars['String']['output']>;
};

export type TimesheetDayUpsertInputDto = {
  applicationId: Scalars['Int']['input'];
  date: Scalars['String']['input'];
  hours?: InputMaybe<Scalars['Float']['input']>;
  personId: Scalars['Int']['input'];
  timesheetDayId?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateAppParticipantDto = {
  applicationId: Scalars['Float']['input'];
  effectiveEndDate?: InputMaybe<Scalars['DateTime']['input']>;
  effectiveStartDate: Scalars['DateTime']['input'];
  id: Scalars['Float']['input'];
};

export type UpdateAppParticipantsResponse = {
  __typename?: 'UpdateAppParticipantsResponse';
  data?: Maybe<Array<ViewAppParticipantEntityDto>>;
  httpStatusCode?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  timestamp?: Maybe<Scalars['String']['output']>;
};

export type UpdateApplicationStatusDto = {
  formId: Scalars['String']['input'];
  formsflowAppId: Scalars['Float']['input'];
  statusTypeAbbrev: Scalars['String']['input'];
  submissionId: Scalars['String']['input'];
};

export type UpdateHousingInputDto = {
  applicationHousingId: Scalars['Int']['input'];
  effectiveDate?: InputMaybe<Scalars['DateTime']['input']>;
  expiryDate?: InputMaybe<Scalars['DateTime']['input']>;
  housingTypeId?: InputMaybe<Scalars['Int']['input']>;
  isIndigenousLed?: InputMaybe<Scalars['Boolean']['input']>;
  isRental?: InputMaybe<Scalars['Boolean']['input']>;
  isSocial?: InputMaybe<Scalars['Boolean']['input']>;
  numberOfUnits?: InputMaybe<Scalars['Int']['input']>;
  relatedApplicationIds?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type UpdatePerson = {
  address_1?: InputMaybe<Scalars['String']['input']>;
  address_2?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  fax?: InputMaybe<Scalars['String']['input']>;
  firstName: Scalars['String']['input'];
  id: Scalars['Float']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  isEnvConsultant?: InputMaybe<Scalars['Boolean']['input']>;
  isTaxExempt?: InputMaybe<Scalars['Boolean']['input']>;
  lastName: Scalars['String']['input'];
  loginUserName?: InputMaybe<Scalars['String']['input']>;
  middleName?: InputMaybe<Scalars['String']['input']>;
  mobile?: InputMaybe<Scalars['String']['input']>;
  permissionIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  phone?: InputMaybe<Scalars['String']['input']>;
  postal?: InputMaybe<Scalars['String']['input']>;
  prov?: InputMaybe<Scalars['String']['input']>;
  updatedBy?: InputMaybe<Scalars['String']['input']>;
  updatedDatetime?: InputMaybe<Scalars['DateTime']['input']>;
};

export type UpdatePersonNote = {
  noteDescription: Scalars['String']['input'];
};

export type UpdateStaffAssignedDto = {
  action: Scalars['String']['input'];
  applicationId: Scalars['Float']['input'];
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  id: Scalars['Float']['input'];
  organizationId?: InputMaybe<Scalars['Float']['input']>;
  personId: Scalars['Float']['input'];
  roleId: Scalars['Float']['input'];
  startDate: Scalars['DateTime']['input'];
};

export type UpsertTimesheetDaysInputDto = {
  entries: Array<TimesheetDayUpsertInputDto>;
};

export type ViewAppParticipantEntityDto = {
  __typename?: 'ViewAppParticipantEntityDto';
  applicationId: Scalars['Float']['output'];
  createdBy: Scalars['String']['output'];
  createdDateTime: Scalars['DateTime']['output'];
  effectiveEndDate?: Maybe<Scalars['DateTime']['output']>;
  effectiveStartDate: Scalars['DateTime']['output'];
  id: Scalars['Float']['output'];
  isMainParticipant: Scalars['Boolean']['output'];
  organizationId?: Maybe<Scalars['Float']['output']>;
  participantRoleId: Scalars['Float']['output'];
  personId: Scalars['Float']['output'];
  rowVersionCount?: Maybe<Scalars['Float']['output']>;
  updatedBy?: Maybe<Scalars['String']['output']>;
  updatedDateTime?: Maybe<Scalars['DateTime']['output']>;
};

export type ViewAppParticipantsDto = {
  __typename?: 'ViewAppParticipantsDto';
  applicationId: Scalars['Float']['output'];
  createdBy: Scalars['String']['output'];
  createdDateTime: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  effectiveEndDate?: Maybe<Scalars['DateTime']['output']>;
  effectiveStartDate: Scalars['DateTime']['output'];
  firstName: Scalars['String']['output'];
  fullName: Scalars['String']['output'];
  id: Scalars['Float']['output'];
  isMainParticipant: Scalars['Boolean']['output'];
  isMinistry: Scalars['Boolean']['output'];
  lastName: Scalars['String']['output'];
  name: Scalars['String']['output'];
  organization?: Maybe<ViewOrganizationsDto>;
  participantRole: ViewParticipantsRolesDto;
  person: ViewParticipantNamesDto;
  rowVersionCount?: Maybe<Scalars['Float']['output']>;
  updatedBy?: Maybe<Scalars['String']['output']>;
  updatedDateTime?: Maybe<Scalars['DateTime']['output']>;
};

export type ViewApplication = {
  __typename?: 'ViewApplication';
  id: Scalars['Float']['output'];
};

export type ViewApplicationDetails = {
  __typename?: 'ViewApplicationDetails';
  appType?: Maybe<DetailField>;
  csapRefNumber?: Maybe<Scalars['String']['output']>;
  currentStatus?: Maybe<DetailField>;
  endDate?: Maybe<Scalars['DateTime']['output']>;
  formId?: Maybe<Scalars['String']['output']>;
  id: Scalars['Float']['output'];
  isHousing: Scalars['Boolean']['output'];
  isTaxExempt: Scalars['Boolean']['output'];
  outcome?: Maybe<DetailField>;
  priority?: Maybe<DetailField>;
  queuedDate?: Maybe<Scalars['DateTime']['output']>;
  receivedDate: Scalars['DateTime']['output'];
  reviewProcess?: Maybe<DetailField>;
  siteAddress: Scalars['String']['output'];
  siteCity: Scalars['String']['output'];
  siteId: Scalars['Float']['output'];
  siteType?: Maybe<DetailField>;
  submissionId?: Maybe<Scalars['String']['output']>;
};

export type ViewApplicationResponse = {
  __typename?: 'ViewApplicationResponse';
  count?: Maybe<Scalars['Float']['output']>;
  data: Array<ViewApplications>;
  httpStatusCode?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  page?: Maybe<Scalars['Float']['output']>;
  pageSize?: Maybe<Scalars['Float']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  timestamp?: Maybe<Scalars['String']['output']>;
};

export type ViewApplicationStatus = {
  __typename?: 'ViewApplicationStatus';
  formsflowAppId: Scalars['Float']['output'];
};

export type ViewApplications = {
  __typename?: 'ViewApplications';
  applicationId: Scalars['Float']['output'];
  effectiveEndDate?: Maybe<Scalars['DateTime']['output']>;
  effectiveStartDate: Scalars['DateTime']['output'];
  id: Scalars['Float']['output'];
  roleDescription: Scalars['String']['output'];
  roleId: Scalars['Float']['output'];
  siteAddress: Scalars['String']['output'];
};

export type ViewDashboard = {
  __typename?: 'ViewDashboard';
  address?: Maybe<Scalars['String']['output']>;
  applicationId: Scalars['Float']['output'];
  applicationStatus?: Maybe<Scalars['String']['output']>;
  applicationType?: Maybe<Scalars['String']['output']>;
  priority?: Maybe<Scalars['String']['output']>;
  receivedDate?: Maybe<Scalars['DateTime']['output']>;
  siteId?: Maybe<Scalars['Float']['output']>;
};

export type ViewOrganizationsDto = {
  __typename?: 'ViewOrganizationsDto';
  id?: Maybe<Scalars['Float']['output']>;
  name: Scalars['String']['output'];
};

export type ViewParticipantNamesDto = {
  __typename?: 'ViewParticipantNamesDto';
  firstName: Scalars['String']['output'];
  fullName: Scalars['String']['output'];
  id: Scalars['Float']['output'];
  lastName: Scalars['String']['output'];
  middleName?: Maybe<Scalars['String']['output']>;
};

export type ViewParticipantsRolesDto = {
  __typename?: 'ViewParticipantsRolesDto';
  description: Scalars['String']['output'];
  id: Scalars['Float']['output'];
  roleType?: Maybe<Scalars['String']['output']>;
};

export type ViewPermissions = {
  __typename?: 'ViewPermissions';
  description: Scalars['String']['output'];
  id: Scalars['Float']['output'];
  roleId: Scalars['Float']['output'];
};

export type ViewPerson = {
  __typename?: 'ViewPerson';
  address_1?: Maybe<Scalars['String']['output']>;
  address_2?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  createdBy: Scalars['String']['output'];
  createdDatetime: Scalars['DateTime']['output'];
  email?: Maybe<Scalars['String']['output']>;
  fax?: Maybe<Scalars['String']['output']>;
  firstName: Scalars['String']['output'];
  id: Scalars['Float']['output'];
  isActive: Scalars['Boolean']['output'];
  isDeleted: Scalars['Boolean']['output'];
  isEnvConsultant?: Maybe<Scalars['Boolean']['output']>;
  isTaxExempt: Scalars['Boolean']['output'];
  lastName: Scalars['String']['output'];
  loginUserName?: Maybe<Scalars['String']['output']>;
  middleName?: Maybe<Scalars['String']['output']>;
  mobile?: Maybe<Scalars['String']['output']>;
  permissionIds?: Maybe<Array<Scalars['Int']['output']>>;
  phone?: Maybe<Scalars['String']['output']>;
  postal?: Maybe<Scalars['String']['output']>;
  prov?: Maybe<Scalars['String']['output']>;
  rowVersionCount: Scalars['Float']['output'];
  updatedBy?: Maybe<Scalars['String']['output']>;
  updatedDatetime?: Maybe<Scalars['DateTime']['output']>;
};

export type ViewPersonNote = {
  __typename?: 'ViewPersonNote';
  date?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  noteDescription: Scalars['String']['output'];
  user?: Maybe<Scalars['String']['output']>;
};

export type ViewStaff = {
  __typename?: 'ViewStaff';
  assignments: Scalars['Float']['output'];
  capacity: Scalars['Float']['output'];
  id: Scalars['Float']['output'];
  name: Scalars['String']['output'];
};

export type ViewStaffAssignedDto = {
  __typename?: 'ViewStaffAssignedDto';
  applicationId: Scalars['Float']['output'];
  currentCapacity?: Maybe<Scalars['Float']['output']>;
  endDate?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['Float']['output'];
  personId: Scalars['Float']['output'];
  roleId: Scalars['Float']['output'];
  startDate: Scalars['DateTime']['output'];
};

export type ViewStaffAssignedResponse = {
  __typename?: 'ViewStaffAssignedResponse';
  data?: Maybe<StaffAssignedDto>;
  httpStatusCode?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  timestamp?: Maybe<Scalars['String']['output']>;
};

export type ViewStaffWithCapacityDto = {
  __typename?: 'ViewStaffWithCapacityDTO';
  currentCapacity?: Maybe<Scalars['Float']['output']>;
  personFullName: Scalars['String']['output'];
  personId: Scalars['Float']['output'];
};

export type ViewStaffWithCapacityResponse = {
  __typename?: 'ViewStaffWithCapacityResponse';
  data?: Maybe<Array<ViewStaffWithCapacityDto>>;
  httpStatusCode?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  timestamp?: Maybe<Scalars['String']['output']>;
};

export type YesNoCodeDto = {
  __typename?: 'YesNoCodeDto';
  abbrev: Scalars['String']['output'];
  id: Scalars['Int']['output'];
};

export type _Service = {
  __typename?: '_Service';
  sdl?: Maybe<Scalars['String']['output']>;
};
