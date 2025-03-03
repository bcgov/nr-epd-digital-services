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

export type AppParticipantsDto = {
  __typename?: 'AppParticipantsDto';
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

export type AppParticipantsResponse = {
  __typename?: 'AppParticipantsResponse';
  data?: Maybe<Array<AppParticipantsDto>>;
  httpStatusCode?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  timestamp?: Maybe<Scalars['String']['output']>;
};

export type CreatePersonInput = {
  address_1: Scalars['String']['input'];
  address_2: Scalars['String']['input'];
  city: Scalars['String']['input'];
  country: Scalars['String']['input'];
  createdBy: Scalars['String']['input'];
  createdDatetime: Scalars['DateTime']['input'];
  email: Scalars['String']['input'];
  fax: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  id: Scalars['Float']['input'];
  isActive: Scalars['Boolean']['input'];
  isDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  isEnvConsultant: Scalars['Boolean']['input'];
  isTaxExempt: Scalars['Boolean']['input'];
  lastName: Scalars['String']['input'];
  loginUserName: Scalars['String']['input'];
  middleName: Scalars['String']['input'];
  mobile: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  postal: Scalars['String']['input'];
  prov: Scalars['String']['input'];
  rowVersionCount: Scalars['Float']['input'];
  updatedBy: Scalars['String']['input'];
  updatedDatetime: Scalars['DateTime']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createPerson: Person;
  updatePerson: UpdateExternalUserResponse;
};


export type MutationCreatePersonArgs = {
  input: CreatePersonInput;
};


export type MutationUpdatePersonArgs = {
  input: Array<CreatePersonInput>;
};

export type Person = {
  __typename?: 'Person';
  address_1: Scalars['String']['output'];
  address_2: Scalars['String']['output'];
  city: Scalars['String']['output'];
  country: Scalars['String']['output'];
  createdBy: Scalars['String']['output'];
  createdDatetime: Scalars['String']['output'];
  email: Scalars['String']['output'];
  fax: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['Float']['output'];
  isActive: Scalars['String']['output'];
  isDeleted: Scalars['String']['output'];
  isEnvConsultant: Scalars['Boolean']['output'];
  isTaxExempt: Scalars['Boolean']['output'];
  lastName: Scalars['String']['output'];
  loginUserName: Scalars['String']['output'];
  middleName: Scalars['String']['output'];
  mobile: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  postal: Scalars['String']['output'];
  prov: Scalars['String']['output'];
  rowVersionCount: Scalars['String']['output'];
  updatedBy: Scalars['String']['output'];
  updatedDatetime: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  _service: _Service;
  findAllPerson: Array<Person>;
  findPersonById: Person;
  getAppParticipantsByAppId: AppParticipantsResponse;
  searchPerson: SearchPersonResponse;
};


export type QueryFindPersonByIdArgs = {
  id: Scalars['Float']['input'];
};


export type QueryGetAppParticipantsByAppIdArgs = {
  applicationId: Scalars['Int']['input'];
  pending?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QuerySearchPersonArgs = {
  page: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
  searchParam: Scalars['String']['input'];
};

export type SearchPersonResponse = {
  __typename?: 'SearchPersonResponse';
  count: Scalars['Float']['output'];
  page: Scalars['Float']['output'];
  pageSize: Scalars['Float']['output'];
  persons: Array<Person>;
};

export type UpdateExternalUserResponse = {
  __typename?: 'UpdateExternalUserResponse';
  httpStatusCode?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  recordUpdated: Scalars['Boolean']['output'];
  success?: Maybe<Scalars['Boolean']['output']>;
  timestamp?: Maybe<Scalars['String']['output']>;
};

export type _Service = {
  __typename?: '_Service';
  sdl?: Maybe<Scalars['String']['output']>;
};
