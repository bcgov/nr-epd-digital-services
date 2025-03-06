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

export type ApplicationResultDto = {
  __typename?: 'ApplicationResultDto';
  applicationType: Scalars['String']['output'];
  id: Scalars['String']['output'];
  lastUpdated: Scalars['String']['output'];
  priority: Scalars['String']['output'];
  siteAddress: Scalars['String']['output'];
  siteId: Scalars['String']['output'];
  staffAssigned: Array<ViewPerson>;
  status: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type ApplicationSearchResponse = {
  __typename?: 'ApplicationSearchResponse';
  applications: Array<ApplicationResultDto>;
  count: Scalars['Int']['output'];
  page: Scalars['Int']['output'];
  pageSize: Scalars['Int']['output'];
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

export type Mutation = {
  __typename?: 'Mutation';
  createPerson: PersonResponse;
  createPersonNote: PersonNoteResponse;
  deletePersonNote: PersonNoteResponse;
  updatePerson: PersonResponse;
  updatePersonNote: PersonNoteResponse;
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
  getPersonNotesByPersonId: PersonNoteResponse;
  searchApplications: ApplicationSearchResponse;
  searchPerson: SearchPersonResponse;
};


export type QueryFindPersonByIdArgs = {
  id: Scalars['Float']['input'];
};


export type QueryGetAppParticipantsByAppIdArgs = {
  applicationId: Scalars['Int']['input'];
  pending?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryGetPersonNotesByPersonIdArgs = {
  id: Scalars['Float']['input'];
};


export type QuerySearchApplicationsArgs = {
  filter: ApplicationFilter;
  page: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
  searchParam: Scalars['String']['input'];
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

export type _Service = {
  __typename?: '_Service';
  sdl?: Maybe<Scalars['String']['output']>;
};
