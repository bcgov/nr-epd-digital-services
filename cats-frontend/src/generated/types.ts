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

export enum ApplicationFilter {
  All = 'ALL',
  Completed = 'COMPLETED',
  Unassigned = 'UNASSIGNED'
}

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
  phone?: InputMaybe<Scalars['String']['input']>;
  postal?: InputMaybe<Scalars['String']['input']>;
  prov?: InputMaybe<Scalars['String']['input']>;
};

export type CreatePersonNote = {
  noteDescription: Scalars['String']['input'];
  personId: Scalars['Float']['input'];
};

export type DeletePersonNote = {
  id: Scalars['String']['input'];
};

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

export type Mutation = {
  __typename?: 'Mutation';
  addHousingToApplication: ApplicationHousingResponse;
  createPerson: PersonResponse;
  createPersonNote: PersonNoteResponse;
  deletePersonNote: PersonNoteResponse;
  updatePerson: PersonResponse;
  updatePersonNote: PersonNoteResponse;
};


export type MutationAddHousingToApplicationArgs = {
  input: AddHousingInputDto;
};


export type MutationCreatePersonArgs = {
  person: CreatePerson;
};


export type MutationCreatePersonNoteArgs = {
  note: CreatePersonNote;
};


export type MutationDeletePersonNoteArgs = {
  notes: Array<DeletePersonNote>;
};


export type MutationUpdatePersonArgs = {
  input: Array<UpdatePerson>;
};


export type MutationUpdatePersonNoteArgs = {
  id: Scalars['String']['input'];
  note: UpdatePersonNote;
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

export type Query = {
  __typename?: 'Query';
  _service: _Service;
  findAllPerson: PersonResponse;
  findPersonById: PersonResponse;
  getAppParticipantsByAppId: AppParticipantsResponse;
  getApplicationHousingByApplicationId: ApplicationHousingResponse;
  getPersonNotesByPersonId: PersonNoteResponse;
  searchApplications: ApplicationSearchResponse;
  searchPerson: SearchPersonResponse;
};


export type QueryFindPersonByIdArgs = {
  id: Scalars['Float']['input'];
};


export type QueryGetAppParticipantsByAppIdArgs = {
  applicationId: Scalars['Int']['input'];
  filter?: InputMaybe<AppParticipantFilter>;
};


export type QueryGetApplicationHousingByApplicationIdArgs = {
  applicationId: Scalars['Int']['input'];
};


export type QueryGetPersonNotesByPersonIdArgs = {
  id: Scalars['Float']['input'];
};


export type QuerySearchApplicationsArgs = {
  filter: ApplicationFilter;
  page: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
  searchParam: Scalars['String']['input'];
  sortBy?: InputMaybe<ApplicationSortByField>;
  sortByDir?: InputMaybe<ApplicationSortByDirection>;
};


export type QuerySearchPersonArgs = {
  page: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
  searchParam: Scalars['String']['input'];
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
  phone?: InputMaybe<Scalars['String']['input']>;
  postal?: InputMaybe<Scalars['String']['input']>;
  prov?: InputMaybe<Scalars['String']['input']>;
  updatedBy?: InputMaybe<Scalars['String']['input']>;
  updatedDatetime?: InputMaybe<Scalars['DateTime']['input']>;
};

export type UpdatePersonNote = {
  noteDescription: Scalars['String']['input'];
};

export type ViewAppParticipantsDto = {
  __typename?: 'ViewAppParticipantsDto';
  applicationId: Scalars['Float']['output'];
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

export type YesNoCodeDto = {
  __typename?: 'YesNoCodeDto';
  abbrev: Scalars['String']['output'];
  id: Scalars['Int']['output'];
};

export type _Service = {
  __typename?: '_Service';
  sdl?: Maybe<Scalars['String']['output']>;
};
