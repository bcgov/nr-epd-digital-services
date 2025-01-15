import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  JSON: { input: any; output: any; }
  _Any: { input: any; output: any; }
  federation__FieldSet: { input: any; output: any; }
  link__Import: { input: any; output: any; }
};

export type AddSiteToFolioDto = {
  /** Primary key column of Folio talbe, not `folioId` */
  id: Scalars['Float']['input'];
  siteId: Scalars['String']['input'];
};

export type AssociatedSiteDto = {
  __typename?: 'AssociatedSiteDto';
  effectiveDate: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  note?: Maybe<Scalars['String']['output']>;
  siteId: Scalars['String']['output'];
  siteIdAssociatedWith: Scalars['String']['output'];
  srAction: Scalars['String']['output'];
  userAction: Scalars['String']['output'];
};

export type AssociatedSiteResponse = {
  __typename?: 'AssociatedSiteResponse';
  data?: Maybe<Array<AssociatedSiteDto>>;
  httpStatusCode?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  timestamp?: Maybe<Scalars['String']['output']>;
};

export type BannerTypeData = {
  __typename?: 'BannerTypeData';
  bannerType: Scalars['String']['output'];
};

export type BannerTypeResponse = {
  __typename?: 'BannerTypeResponse';
  data?: Maybe<BannerTypeData>;
  httpStatusCode: Scalars['Int']['output'];
  message: Scalars['String']['output'];
};

export type BceRegionCd = {
  __typename?: 'BceRegionCd';
  code: Scalars['String']['output'];
  description: Scalars['String']['output'];
};

export type BulkApproveRejectChangesDto = {
  fromSiteDetails: Scalars['Boolean']['input'];
  isApproved: Scalars['Boolean']['input'];
  sites: Array<SiteRecordsForSrAction>;
};

export type Cart = {
  __typename?: 'Cart';
  id: Scalars['String']['output'];
  price: Scalars['Float']['output'];
  site?: Maybe<Sites>;
  siteId: Scalars['String']['output'];
  userId: Scalars['String']['output'];
  whenCreated: Scalars['DateTime']['output'];
  whenUpdated?: Maybe<Scalars['DateTime']['output']>;
  whoCreated: Scalars['String']['output'];
  whoUpdated?: Maybe<Scalars['String']['output']>;
};

export type CartDto = {
  price: Scalars['Float']['input'];
  siteId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
  whoCreated: Scalars['String']['input'];
};

export type CartDeleteDto = {
  cartId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};

export type CartDeleteDtoWithSiteId = {
  siteId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};

export type CartResponse = {
  __typename?: 'CartResponse';
  data?: Maybe<Array<Cart>>;
  httpStatusCode?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  timestamp?: Maybe<Scalars['String']['output']>;
};

export type ClassificationCd = {
  __typename?: 'ClassificationCd';
  code: Scalars['String']['output'];
  description: Scalars['String']['output'];
};

export type ConditionsText = {
  __typename?: 'ConditionsText';
  conditionsComment: Scalars['String']['output'];
  eventId: Scalars['String']['output'];
  rwmFlag: Scalars['Float']['output'];
  whenCreated: Scalars['DateTime']['output'];
  whenUpdated: Scalars['DateTime']['output'];
  whoCreated: Scalars['String']['output'];
  whoUpdated: Scalars['String']['output'];
};

export type CreateSnapshotDto = {
  siteId: Scalars['String']['input'];
};

export type DisclosureResponse = {
  __typename?: 'DisclosureResponse';
  data?: Maybe<Array<SiteProfiles>>;
  httpStatusCode?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  timestamp?: Maybe<Scalars['String']['output']>;
};

export type DocParticRoleCd = {
  __typename?: 'DocParticRoleCd';
  code: Scalars['String']['output'];
  description: Scalars['String']['output'];
};

export type DocumentDto = {
  __typename?: 'DocumentDto';
  displayName?: Maybe<Scalars['String']['output']>;
  docParticId?: Maybe<Scalars['String']['output']>;
  documentDate?: Maybe<Scalars['String']['output']>;
  filePath?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  psnorgId?: Maybe<Scalars['String']['output']>;
  siteId: Scalars['String']['output'];
  srAction: Scalars['String']['output'];
  submissionDate: Scalars['String']['output'];
  title: Scalars['String']['output'];
  userAction: Scalars['String']['output'];
};

export type DocumentInputDto = {
  apiAction?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  docParticId?: InputMaybe<Scalars['String']['input']>;
  documentDate?: InputMaybe<Scalars['String']['input']>;
  filePath?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  psnorgId: Scalars['String']['input'];
  siteId: Scalars['String']['input'];
  srAction: Scalars['String']['input'];
  submissionDate: Scalars['String']['input'];
  title: Scalars['String']['input'];
  userAction?: InputMaybe<Scalars['String']['input']>;
};

export type DocumentResponse = {
  __typename?: 'DocumentResponse';
  data?: Maybe<Array<DocumentDto>>;
  httpStatusCode?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  timestamp?: Maybe<Scalars['String']['output']>;
};

export type DropdownDto = {
  __typename?: 'DropdownDto';
  key: Scalars['String']['output'];
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

export type DropdownResponseWithMetaData = {
  __typename?: 'DropdownResponseWithMetaData';
  data?: Maybe<Array<NotationDropdownDto>>;
  httpStatusCode?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  timestamp?: Maybe<Scalars['String']['output']>;
};

export type EventPartics = {
  __typename?: 'EventPartics';
  eprCode: Scalars['String']['output'];
  eventId: Scalars['String']['output'];
  psnorg?: Maybe<PeopleOrgs>;
  psnorgId: Scalars['String']['output'];
  rwmFlag?: Maybe<Scalars['Float']['output']>;
  spId: Scalars['String']['output'];
  srAction: Scalars['String']['output'];
  userAction: Scalars['String']['output'];
  whenCreated: Scalars['DateTime']['output'];
  whenUpdated: Scalars['DateTime']['output'];
  whoCreated: Scalars['String']['output'];
  whoUpdated: Scalars['String']['output'];
};

export type EventTypeCd = {
  __typename?: 'EventTypeCd';
  code: Scalars['String']['output'];
  description: Scalars['String']['output'];
  eclsCode: Scalars['String']['output'];
  reqCompletionDate: Scalars['String']['output'];
  reqRegionalApproval: Scalars['String']['output'];
  reqRegistrarApproval: Scalars['String']['output'];
  reqRemediationPlan: Scalars['String']['output'];
  reqSuccess: Scalars['String']['output'];
  siteRegistryVisible: Scalars['String']['output'];
  sstCode?: Maybe<Scalars['String']['output']>;
};

export type Events = {
  __typename?: 'Events';
  completionDate?: Maybe<Scalars['DateTime']['output']>;
  conditionsTexts?: Maybe<Array<ConditionsText>>;
  eclsCode: Scalars['String']['output'];
  etypCode: Scalars['String']['output'];
  eventDate: Scalars['DateTime']['output'];
  eventPartics?: Maybe<Array<EventPartics>>;
  eventTypeCd: EventTypeCd;
  id: Scalars['String']['output'];
  note?: Maybe<Scalars['String']['output']>;
  psnorgId: Scalars['String']['output'];
  regionAppFlag?: Maybe<Scalars['String']['output']>;
  regionDate?: Maybe<Scalars['DateTime']['output']>;
  regionUserid?: Maybe<Scalars['String']['output']>;
  requiredAction?: Maybe<Scalars['String']['output']>;
  requirementDueDate?: Maybe<Scalars['DateTime']['output']>;
  requirementReceivedDate?: Maybe<Scalars['DateTime']['output']>;
  rwmApprovalDate?: Maybe<Scalars['DateTime']['output']>;
  rwmFlag?: Maybe<Scalars['Float']['output']>;
  rwmNoteFlag?: Maybe<Scalars['Float']['output']>;
  site: Sites;
  siteId: Scalars['String']['output'];
  spId: Scalars['String']['output'];
  srAction: Scalars['String']['output'];
  userAction: Scalars['String']['output'];
  whenCreated: Scalars['DateTime']['output'];
  whenUpdated?: Maybe<Scalars['DateTime']['output']>;
  whoCreated: Scalars['String']['output'];
  whoUpdated?: Maybe<Scalars['String']['output']>;
};

export type FetchSiteDetail = {
  __typename?: 'FetchSiteDetail';
  data?: Maybe<Sites>;
  httpStatusCode?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  timestamp?: Maybe<Scalars['String']['output']>;
};

export type FetchSiteResponse = {
  __typename?: 'FetchSiteResponse';
  data: Array<Sites>;
  httpStatusCode?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  timestamp?: Maybe<Scalars['String']['output']>;
};

export type Folio = {
  __typename?: 'Folio';
  description: Scalars['String']['output'];
  folioContents?: Maybe<Array<FolioContents>>;
  folioId: Scalars['String']['output'];
  id: Scalars['Float']['output'];
  userId: Scalars['String']['output'];
  whenCreated: Scalars['DateTime']['output'];
  whenUpdated?: Maybe<Scalars['DateTime']['output']>;
  whoCreated: Scalars['String']['output'];
  whoUpdated?: Maybe<Scalars['String']['output']>;
};

export type FolioContentDto = {
  folioId: Scalars['String']['input'];
  id: Scalars['Float']['input'];
  siteId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
  whoCreated: Scalars['String']['input'];
};

export type FolioContentResponse = {
  __typename?: 'FolioContentResponse';
  data?: Maybe<Array<FolioContents>>;
  httpStatusCode?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  timestamp?: Maybe<Scalars['String']['output']>;
};

export type FolioContents = {
  __typename?: 'FolioContents';
  folio: Folio;
  folioId: Scalars['Float']['output'];
  id: Scalars['String']['output'];
  site: Sites;
  siteId: Scalars['String']['output'];
  whenCreated: Scalars['DateTime']['output'];
  whenUpdated?: Maybe<Scalars['DateTime']['output']>;
  whoCreated: Scalars['String']['output'];
  whoUpdated?: Maybe<Scalars['String']['output']>;
};

export type FolioDto = {
  description: Scalars['String']['input'];
  folioId: Scalars['String']['input'];
  id: Scalars['Float']['input'];
  userId: Scalars['String']['input'];
  whenUpdated: Scalars['String']['input'];
  whoCreated: Scalars['String']['input'];
};

export type FolioMinDto = {
  id: Scalars['Float']['input'];
  userId: Scalars['String']['input'];
};

export type FolioResponse = {
  __typename?: 'FolioResponse';
  data?: Maybe<Array<Folio>>;
  httpStatusCode?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  timestamp?: Maybe<Scalars['String']['output']>;
};

export type LandHistories = {
  __typename?: 'LandHistories';
  guid: Scalars['String']['output'];
  landUse: LandUseCd;
  lutCode: Scalars['String']['output'];
  note?: Maybe<Scalars['String']['output']>;
  profileDateReceived?: Maybe<Scalars['DateTime']['output']>;
  rwmFlag: Scalars['Float']['output'];
  rwmNoteFlag: Scalars['Float']['output'];
  siteId: Scalars['String']['output'];
  siteProfile?: Maybe<Scalars['String']['output']>;
  srAction: Scalars['String']['output'];
  userAction: Scalars['String']['output'];
  whenCreated: Scalars['DateTime']['output'];
  whenUpdated?: Maybe<Scalars['DateTime']['output']>;
  whoCreated: Scalars['String']['output'];
  whoUpdated?: Maybe<Scalars['String']['output']>;
};

export type LandHistoriesInputDto = {
  apiAction?: InputMaybe<Scalars['String']['input']>;
  landUseCode?: InputMaybe<Scalars['String']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
  originalLandUseCode?: InputMaybe<Scalars['String']['input']>;
  shouldDelete?: Scalars['Boolean']['input'];
  srAction: Scalars['String']['input'];
  userAction?: InputMaybe<Scalars['String']['input']>;
};

export type LandHistoryResponse = {
  __typename?: 'LandHistoryResponse';
  data: Array<LandHistories>;
  httpStatusCode?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  timestamp?: Maybe<Scalars['String']['output']>;
};

export type LandUseCd = {
  __typename?: 'LandUseCd';
  code: Scalars['String']['output'];
  description: Scalars['String']['output'];
};

export type LandUseCodeResponse = {
  __typename?: 'LandUseCodeResponse';
  data: Array<LandUseCd>;
  httpStatusCode?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  timestamp?: Maybe<Scalars['String']['output']>;
};

export type Mailout = {
  __typename?: 'Mailout';
  bcerCode: Scalars['String']['output'];
  comments: Scalars['String']['output'];
  commonCityName: Scalars['String']['output'];
  commonName: Scalars['String']['output'];
  complete: Scalars['String']['output'];
  completeDate: Scalars['DateTime']['output'];
  displayName: Scalars['String']['output'];
  mailingDate: Scalars['DateTime']['output'];
  orgAddress_2: Scalars['String']['output'];
  orgAddress_3: Scalars['String']['output'];
  organizationAddress: Scalars['String']['output'];
  organizationCityName: Scalars['String']['output'];
  postalCode: Scalars['String']['output'];
  provState: Scalars['String']['output'];
  psnorgId: Scalars['String']['output'];
  recordDate: Scalars['DateTime']['output'];
  responseDate: Scalars['DateTime']['output'];
  revise: Scalars['String']['output'];
  siteId: Scalars['String']['output'];
  updateNotation: Scalars['String']['output'];
  updateNotationDate: Scalars['DateTime']['output'];
  whenCreated: Scalars['DateTime']['output'];
  whenUpdated: Scalars['DateTime']['output'];
  whoCreated: Scalars['String']['output'];
  whoUpdated: Scalars['String']['output'];
};

export type MapSearchResponse = {
  __typename?: 'MapSearchResponse';
  data: Array<Sites>;
  httpStatusCode?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  timestamp?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addCartItem: CartResponse;
  addFolioItem: FolioResponse;
  addRecentView: RecentViewResponse;
  addSiteToFolio: FolioResponse;
  bulkAproveRejectChanges: SrApproveRejectResponse;
  createSnapshotForSites: SnapshotResponse;
  deleteCartItem: CartResponse;
  deleteCartItemWithSiteId: CartResponse;
  deleteFolioItem: FolioResponse;
  deleteSitesInFolio: FolioResponse;
  updateFolioItem: FolioResponse;
  updateSiteDetails: SaveSiteDetailsResponse;
};


export type MutationAddCartItemArgs = {
  cartDTO: Array<CartDto>;
};


export type MutationAddFolioItemArgs = {
  folioDTO: FolioDto;
};


export type MutationAddRecentViewArgs = {
  recentView: RecentViewDto;
};


export type MutationAddSiteToFolioArgs = {
  addSiteToFolioDTO: Array<AddSiteToFolioDto>;
};


export type MutationBulkAproveRejectChangesArgs = {
  approveRejectDTO: BulkApproveRejectChangesDto;
};


export type MutationCreateSnapshotForSitesArgs = {
  inputDto: Array<CreateSnapshotDto>;
};


export type MutationDeleteCartItemArgs = {
  cartDeleteDTO: Array<CartDeleteDto>;
};


export type MutationDeleteCartItemWithSiteIdArgs = {
  cartDeleteDTO: Array<CartDeleteDtoWithSiteId>;
};


export type MutationDeleteFolioItemArgs = {
  folioId: Scalars['Float']['input'];
};


export type MutationDeleteSitesInFolioArgs = {
  folioDTO: Array<FolioContentDto>;
};


export type MutationUpdateFolioItemArgs = {
  folioDTO: Array<FolioDto>;
};


export type MutationUpdateSiteDetailsArgs = {
  siteDetailsDTO: SaveSiteDetailsDto;
};

export type NotationDropdownDto = {
  __typename?: 'NotationDropdownDto';
  dropdownDto: Array<DropdownDto>;
  metaData: Scalars['String']['output'];
};

export type NotationDto = {
  __typename?: 'NotationDto';
  completionDate?: Maybe<Scalars['DateTime']['output']>;
  eclsCode: Scalars['String']['output'];
  etypCode: Scalars['String']['output'];
  id: Scalars['String']['output'];
  notationParticipant?: Maybe<Array<NotationParticipantDto>>;
  note?: Maybe<Scalars['String']['output']>;
  psnorgId: Scalars['String']['output'];
  requiredAction?: Maybe<Scalars['String']['output']>;
  requirementDueDate?: Maybe<Scalars['DateTime']['output']>;
  requirementReceivedDate?: Maybe<Scalars['DateTime']['output']>;
  siteId: Scalars['String']['output'];
  srAction: Scalars['String']['output'];
  userAction: Scalars['String']['output'];
};

export type NotationIputDto = {
  apiAction?: InputMaybe<Scalars['String']['input']>;
  completionDate?: InputMaybe<Scalars['DateTime']['input']>;
  eclsCode: Scalars['String']['input'];
  etypCode: Scalars['String']['input'];
  id: Scalars['String']['input'];
  notationParticipant?: InputMaybe<Array<NotationParticipantInputDto>>;
  note?: InputMaybe<Scalars['String']['input']>;
  psnorgId: Scalars['String']['input'];
  requiredAction?: InputMaybe<Scalars['String']['input']>;
  requirementDueDate?: InputMaybe<Scalars['DateTime']['input']>;
  requirementReceivedDate?: InputMaybe<Scalars['DateTime']['input']>;
  siteId: Scalars['String']['input'];
  srAction: Scalars['String']['input'];
  userAction?: InputMaybe<Scalars['String']['input']>;
};

export type NotationParticipantDto = {
  __typename?: 'NotationParticipantDto';
  displayName: Scalars['String']['output'];
  eprCode: Scalars['String']['output'];
  eventId: Scalars['String']['output'];
  eventParticId: Scalars['String']['output'];
  psnorgId: Scalars['String']['output'];
  srAction: Scalars['String']['output'];
  userAction: Scalars['String']['output'];
};

export type NotationParticipantInputDto = {
  apiAction?: InputMaybe<Scalars['String']['input']>;
  displayName: Scalars['String']['input'];
  eprCode: Scalars['String']['input'];
  eventId: Scalars['String']['input'];
  eventParticId: Scalars['String']['input'];
  psnorgId: Scalars['String']['input'];
  srAction: Scalars['String']['input'];
  userAction?: InputMaybe<Scalars['String']['input']>;
};

export type NotationResponse = {
  __typename?: 'NotationResponse';
  data?: Maybe<Array<NotationDto>>;
  httpStatusCode?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  timestamp?: Maybe<Scalars['String']['output']>;
};

export type ParcelDescriptionDto = {
  __typename?: 'ParcelDescriptionDto';
  dateNoted: Scalars['DateTime']['output'];
  descriptionType: Scalars['String']['output'];
  id: Scalars['Float']['output'];
  idPinNumber: Scalars['String']['output'];
  landDescription: Scalars['String']['output'];
  srAction: Scalars['String']['output'];
  userAction: Scalars['String']['output'];
};

export type ParcelDescriptionInputDto = {
  apiAction?: InputMaybe<Scalars['String']['input']>;
  dateNoted: Scalars['DateTime']['input'];
  descriptionType: Scalars['String']['input'];
  id: Scalars['String']['input'];
  idPinNumber: Scalars['String']['input'];
  landDescription: Scalars['String']['input'];
  srAction: Scalars['String']['input'];
  userAction?: InputMaybe<Scalars['String']['input']>;
};

export type ParcelDescriptionsResponse = {
  __typename?: 'ParcelDescriptionsResponse';
  count?: Maybe<Scalars['Float']['output']>;
  data?: Maybe<Array<ParcelDescriptionDto>>;
  httpStatusCode?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  page?: Maybe<Scalars['Float']['output']>;
  pageSize?: Maybe<Scalars['Float']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  timestamp?: Maybe<Scalars['String']['output']>;
};

export type ParticRoleCd = {
  __typename?: 'ParticRoleCd';
  code: Scalars['String']['output'];
  description: Scalars['String']['output'];
};

export type PeopleOrgs = {
  __typename?: 'PeopleOrgs';
  bcerCode: Scalars['String']['output'];
  contactName: Scalars['String']['output'];
  displayName: Scalars['String']['output'];
  endDate: Scalars['DateTime']['output'];
  entityType: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  location: Scalars['String']['output'];
  mailUserid: Scalars['String']['output'];
  middleName: Scalars['String']['output'];
  organizationName?: Maybe<Scalars['String']['output']>;
  whenCreated: Scalars['DateTime']['output'];
  whenUpdated: Scalars['DateTime']['output'];
  whoCreated: Scalars['String']['output'];
  whoUpdated: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  _service: _Service;
  findSiteBySiteId: FetchSiteDetail;
  getAssociatedSitesBySiteId: AssociatedSiteResponse;
  getBannerType: BannerTypeResponse;
  getCartItemsForUser: CartResponse;
  getFolioItemsForUser: FolioResponse;
  getIDIRUserListForDropDown: DropdownResponse;
  getLandHistoriesForSite: LandHistoryResponse;
  getLandUseCodes: LandUseCodeResponse;
  getNotationClassCd: DropdownResponse;
  getNotationParticipantRoleCd: DropdownResponse;
  getNotationTypeCd: DropdownResponseWithMetaData;
  getParcelDescriptionsBySiteId: ParcelDescriptionsResponse;
  getParticipantRoleCd: DropdownResponse;
  getPendingSiteForSRApproval: QueryResultForPendingSitesResponse;
  getPeopleOrgsCd: DropdownResponse;
  getRecentViewsByUserId: RecentViewResponse;
  getSiteDisclosureBySiteId: DisclosureResponse;
  getSiteDocumentsBySiteId: DocumentResponse;
  getSiteNotationBySiteId: NotationResponse;
  getSiteParticipantBySiteId: SiteParticsResponse;
  getSitesForFolio: FolioContentResponse;
  getSnapshots: SnapshotResponse;
  getSnapshotsById: SnapshotResponse;
  getSnapshotsBySiteId: SnapshotResponse;
  getSnapshotsByUserId: SnapshotResponse;
  mapSearch: MapSearchResponse;
  searchSiteIds: DropdownResponse;
  searchSites: SearchSiteResponse;
  sites: FetchSiteResponse;
};


export type QueryFindSiteBySiteIdArgs = {
  pending?: InputMaybe<Scalars['Boolean']['input']>;
  siteId: Scalars['String']['input'];
};


export type QueryGetAssociatedSitesBySiteIdArgs = {
  pending?: InputMaybe<Scalars['Boolean']['input']>;
  siteId: Scalars['String']['input'];
};


export type QueryGetBannerTypeArgs = {
  siteId: Scalars['String']['input'];
};


export type QueryGetCartItemsForUserArgs = {
  userId: Scalars['String']['input'];
};


export type QueryGetLandHistoriesForSiteArgs = {
  pending?: InputMaybe<Scalars['Boolean']['input']>;
  searchTerm?: InputMaybe<Scalars['String']['input']>;
  siteId: Scalars['String']['input'];
  sortDirection?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetParcelDescriptionsBySiteIdArgs = {
  page: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
  pending?: InputMaybe<Scalars['Boolean']['input']>;
  searchParam: Scalars['String']['input'];
  siteId: Scalars['Int']['input'];
  sortBy: Scalars['String']['input'];
  sortByDir: Scalars['String']['input'];
};


export type QueryGetPendingSiteForSrApprovalArgs = {
  page: Scalars['String']['input'];
  pageSize: Scalars['String']['input'];
  searchParam?: InputMaybe<SearchParams>;
};


export type QueryGetPeopleOrgsCdArgs = {
  entityType?: InputMaybe<Scalars['String']['input']>;
  searchParam?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetRecentViewsByUserIdArgs = {
  userId: Scalars['String']['input'];
};


export type QueryGetSiteDisclosureBySiteIdArgs = {
  pending?: InputMaybe<Scalars['Boolean']['input']>;
  siteId: Scalars['String']['input'];
};


export type QueryGetSiteDocumentsBySiteIdArgs = {
  pending?: InputMaybe<Scalars['Boolean']['input']>;
  siteId: Scalars['String']['input'];
};


export type QueryGetSiteNotationBySiteIdArgs = {
  pending?: InputMaybe<Scalars['Boolean']['input']>;
  siteId: Scalars['String']['input'];
};


export type QueryGetSiteParticipantBySiteIdArgs = {
  pending?: InputMaybe<Scalars['Boolean']['input']>;
  siteId: Scalars['String']['input'];
};


export type QueryGetSitesForFolioArgs = {
  folioDTO: FolioMinDto;
};


export type QueryGetSnapshotsByIdArgs = {
  id: Scalars['Int']['input'];
};


export type QueryGetSnapshotsBySiteIdArgs = {
  siteId: Scalars['String']['input'];
};


export type QueryGetSnapshotsByUserIdArgs = {
  userId: Scalars['String']['input'];
};


export type QueryMapSearchArgs = {
  searchParam?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySearchSiteIdsArgs = {
  searchParam: Scalars['String']['input'];
};


export type QuerySearchSitesArgs = {
  addrLine_1?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  commonName?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  latDegrees?: InputMaybe<Scalars['String']['input']>;
  latMinutes?: InputMaybe<Scalars['String']['input']>;
  latSeconds?: InputMaybe<Scalars['String']['input']>;
  latdeg?: InputMaybe<Scalars['String']['input']>;
  latlongReliabilityFlag?: InputMaybe<Scalars['String']['input']>;
  longDegrees?: InputMaybe<Scalars['String']['input']>;
  longMinutes?: InputMaybe<Scalars['String']['input']>;
  longSeconds?: InputMaybe<Scalars['String']['input']>;
  longdeg?: InputMaybe<Scalars['String']['input']>;
  page: Scalars['String']['input'];
  pageSize: Scalars['String']['input'];
  searchParam: Scalars['String']['input'];
  siteRiskCode?: InputMaybe<Scalars['String']['input']>;
  srStatus?: InputMaybe<Scalars['String']['input']>;
  whenCreated?: InputMaybe<Scalars['String']['input']>;
  whenUpdated?: InputMaybe<Scalars['String']['input']>;
  whoCreated?: InputMaybe<Scalars['String']['input']>;
};

export type QueryResultForPendingSites = {
  __typename?: 'QueryResultForPendingSites';
  data?: Maybe<Array<SitePendingApprovalRecords>>;
  httpStatusCode?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  timestamp?: Maybe<Scalars['String']['output']>;
  totalRecords: Scalars['Float']['output'];
};

export type QueryResultForPendingSitesResponse = {
  __typename?: 'QueryResultForPendingSitesResponse';
  data: QueryResultForPendingSites;
  httpStatusCode?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  timestamp?: Maybe<Scalars['String']['output']>;
};

export type RecentViewDto = {
  address: Scalars['String']['input'];
  city: Scalars['String']['input'];
  generalDescription?: InputMaybe<Scalars['String']['input']>;
  siteId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
  whenUpdated?: InputMaybe<Scalars['DateTime']['input']>;
};

export type RecentViewResponse = {
  __typename?: 'RecentViewResponse';
  data?: Maybe<Array<RecentViews>>;
  httpStatusCode?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  timestamp?: Maybe<Scalars['String']['output']>;
};

export type RecentViews = {
  __typename?: 'RecentViews';
  address: Scalars['String']['output'];
  city: Scalars['String']['output'];
  generalDescription?: Maybe<Scalars['String']['output']>;
  siteId: Scalars['String']['output'];
  userId: Scalars['String']['output'];
  whenUpdated?: Maybe<Scalars['DateTime']['output']>;
};

export type SrApproveRejectResponse = {
  __typename?: 'SRApproveRejectResponse';
  data?: Maybe<Array<SitePendingApprovalDto>>;
  httpStatusCode?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  timestamp?: Maybe<Scalars['String']['output']>;
};

export type SaveSiteDetailsDto = {
  documents?: InputMaybe<Array<DocumentInputDto>>;
  events?: InputMaybe<Array<NotationIputDto>>;
  eventsParticipants?: InputMaybe<Array<NotationParticipantInputDto>>;
  landHistories?: InputMaybe<Array<LandHistoriesInputDto>>;
  parcelDescriptions?: InputMaybe<Array<ParcelDescriptionInputDto>>;
  profiles?: InputMaybe<Array<SiteProfilesInputDto>>;
  siteAssociations?: InputMaybe<Array<SiteAssociationsInputDto>>;
  siteId: Scalars['String']['input'];
  siteParticipants?: InputMaybe<Array<SiteParticsInputDto>>;
  sitesSummary?: InputMaybe<SiteSummaryDto>;
};

export type SaveSiteDetailsResponse = {
  __typename?: 'SaveSiteDetailsResponse';
  data: Array<Sites>;
  httpStatusCode?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  timestamp?: Maybe<Scalars['String']['output']>;
};

export type SearchParams = {
  addrLine?: InputMaybe<Scalars['String']['input']>;
  changes?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  whenUpdated?: InputMaybe<Scalars['String']['input']>;
  whoCreated?: InputMaybe<Scalars['String']['input']>;
};

export type SearchSiteResponse = {
  __typename?: 'SearchSiteResponse';
  count: Scalars['Float']['output'];
  page: Scalars['Float']['output'];
  pageSize: Scalars['Float']['output'];
  sites: Array<Sites>;
};

export type SiteAssociationsInputDto = {
  apiAction?: InputMaybe<Scalars['String']['input']>;
  effectiveDate: Scalars['DateTime']['input'];
  id: Scalars['String']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
  siteId: Scalars['String']['input'];
  siteIdAssociatedWith: Scalars['String']['input'];
  srAction: Scalars['String']['input'];
  userAction?: InputMaybe<Scalars['String']['input']>;
};

export type SiteAssocs = {
  __typename?: 'SiteAssocs';
  commonPid: Scalars['String']['output'];
  effectiveDate: Scalars['DateTime']['output'];
  note: Scalars['String']['output'];
  rwmFlag?: Maybe<Scalars['Float']['output']>;
  rwmNoteFlag?: Maybe<Scalars['Float']['output']>;
  siteId: Scalars['String']['output'];
  siteIdAssociatedWith: Scalars['String']['output'];
  srAction: Scalars['String']['output'];
  userAction: Scalars['String']['output'];
  whenCreated: Scalars['DateTime']['output'];
  whenUpdated: Scalars['DateTime']['output'];
  whoCreated: Scalars['String']['output'];
  whoUpdated: Scalars['String']['output'];
};

export type SiteCrownLandContaminated = {
  __typename?: 'SiteCrownLandContaminated';
  actualCostOfRemediations: Scalars['Float']['output'];
  contaminationOtherDesc: Scalars['String']['output'];
  estimatedCostOfRemediations: Scalars['Float']['output'];
  id: Scalars['String']['output'];
  whenCreated: Scalars['DateTime']['output'];
  whenUpdated: Scalars['DateTime']['output'];
  whoCreated: Scalars['String']['output'];
  whoUpdated: Scalars['String']['output'];
};

export type SiteDocPartics = {
  __typename?: 'SiteDocPartics';
  dprCode: Scalars['String']['output'];
  dprCode2: DocParticRoleCd;
  id: Scalars['String']['output'];
  psnorg: PeopleOrgs;
  psnorgId: Scalars['String']['output'];
  rwmFlag?: Maybe<Scalars['Float']['output']>;
  sdocId: Scalars['String']['output'];
  spId: Scalars['String']['output'];
  srAction: Scalars['String']['output'];
  userAction: Scalars['String']['output'];
  whenCreated: Scalars['DateTime']['output'];
  whenUpdated?: Maybe<Scalars['DateTime']['output']>;
  whoCreated: Scalars['String']['output'];
  whoUpdated?: Maybe<Scalars['String']['output']>;
};

export type SiteDocs = {
  __typename?: 'SiteDocs';
  documentDate?: Maybe<Scalars['DateTime']['output']>;
  filePath?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  note?: Maybe<Scalars['String']['output']>;
  rwmFlag?: Maybe<Scalars['Float']['output']>;
  rwmNoteFlag?: Maybe<Scalars['Float']['output']>;
  siteDocPartics: Array<SiteDocPartics>;
  siteId: Scalars['String']['output'];
  srAction: Scalars['String']['output'];
  submissionDate: Scalars['DateTime']['output'];
  title: Scalars['String']['output'];
  userAction: Scalars['String']['output'];
  whenCreated: Scalars['DateTime']['output'];
  whenUpdated?: Maybe<Scalars['DateTime']['output']>;
  whoCreated: Scalars['String']['output'];
  whoUpdated?: Maybe<Scalars['String']['output']>;
};

export type SiteParticRoles = {
  __typename?: 'SiteParticRoles';
  prCode: Scalars['String']['output'];
  prCode2: ParticRoleCd;
  rwmFlag?: Maybe<Scalars['Float']['output']>;
  spId: Scalars['String']['output'];
  srAction: Scalars['String']['output'];
  userAction: Scalars['String']['output'];
  whenCreated: Scalars['DateTime']['output'];
  whenUpdated?: Maybe<Scalars['DateTime']['output']>;
  whoCreated: Scalars['String']['output'];
  whoUpdated?: Maybe<Scalars['String']['output']>;
};

export type SitePartics = {
  __typename?: 'SitePartics';
  effectiveDate: Scalars['DateTime']['output'];
  endDate?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  note?: Maybe<Scalars['String']['output']>;
  psnorg: PeopleOrgs;
  psnorgId: Scalars['String']['output'];
  rwmFlag?: Maybe<Scalars['Float']['output']>;
  rwmNoteFlag?: Maybe<Scalars['Float']['output']>;
  siteId: Scalars['String']['output'];
  siteParticRoles: Array<SiteParticRoles>;
  srAction: Scalars['String']['output'];
  userAction: Scalars['String']['output'];
  whenCreated: Scalars['DateTime']['output'];
  whenUpdated?: Maybe<Scalars['DateTime']['output']>;
  whoCreated: Scalars['String']['output'];
  whoUpdated?: Maybe<Scalars['String']['output']>;
};

export type SiteParticsDto = {
  __typename?: 'SiteParticsDto';
  description: Scalars['String']['output'];
  displayName: Scalars['String']['output'];
  effectiveDate: Scalars['DateTime']['output'];
  endDate?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  note?: Maybe<Scalars['String']['output']>;
  particRoleId: Scalars['String']['output'];
  prCode: Scalars['String']['output'];
  psnorgId: Scalars['String']['output'];
  siteId: Scalars['String']['output'];
  srAction: Scalars['String']['output'];
  userAction: Scalars['String']['output'];
};

export type SiteParticsInputDto = {
  apiAction?: InputMaybe<Scalars['String']['input']>;
  description: Scalars['String']['input'];
  displayName: Scalars['String']['input'];
  effectiveDate: Scalars['DateTime']['input'];
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  id: Scalars['String']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
  particRoleId: Scalars['String']['input'];
  prCode: Scalars['String']['input'];
  psnorgId: Scalars['String']['input'];
  siteId: Scalars['String']['input'];
  srAction: Scalars['String']['input'];
  userAction?: InputMaybe<Scalars['String']['input']>;
};

export type SiteParticsResponse = {
  __typename?: 'SiteParticsResponse';
  data?: Maybe<Array<SiteParticsDto>>;
  httpStatusCode?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  timestamp?: Maybe<Scalars['String']['output']>;
};

export type SitePendingApprovalDto = {
  __typename?: 'SitePendingApprovalDTO';
  httpStatusCode?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  timestamp?: Maybe<Scalars['String']['output']>;
};

export type SitePendingApprovalRecords = {
  __typename?: 'SitePendingApprovalRecords';
  address: Scalars['String']['output'];
  changes: Scalars['String']['output'];
  id: Scalars['String']['output'];
  siteId: Scalars['String']['output'];
  whenUpdated: Scalars['DateTime']['output'];
  whoUpdated: Scalars['String']['output'];
};

export type SiteProfiles = {
  __typename?: 'SiteProfiles';
  comments?: Maybe<Scalars['String']['output']>;
  dateCompleted: Scalars['DateTime']['output'];
  govDocumentsComment?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  investigationRequired?: Maybe<Scalars['String']['output']>;
  latDegrees?: Maybe<Scalars['Float']['output']>;
  latMinutes?: Maybe<Scalars['Float']['output']>;
  latSeconds?: Maybe<Scalars['String']['output']>;
  localAuthAddress1?: Maybe<Scalars['String']['output']>;
  localAuthAddress2?: Maybe<Scalars['String']['output']>;
  localAuthAgency?: Maybe<Scalars['String']['output']>;
  localAuthDateForwarded?: Maybe<Scalars['DateTime']['output']>;
  localAuthDateRecd?: Maybe<Scalars['DateTime']['output']>;
  localAuthDateSubmitted?: Maybe<Scalars['DateTime']['output']>;
  localAuthEmail?: Maybe<Scalars['String']['output']>;
  localAuthFaxAreaCode?: Maybe<Scalars['String']['output']>;
  localAuthFaxNo?: Maybe<Scalars['String']['output']>;
  localAuthName?: Maybe<Scalars['String']['output']>;
  localAuthPhoneAreaCode?: Maybe<Scalars['String']['output']>;
  localAuthPhoneNo?: Maybe<Scalars['String']['output']>;
  longDegrees?: Maybe<Scalars['Float']['output']>;
  longMinutes?: Maybe<Scalars['Float']['output']>;
  longSeconds?: Maybe<Scalars['String']['output']>;
  numberOfPids?: Maybe<Scalars['Float']['output']>;
  numberOfPins?: Maybe<Scalars['Float']['output']>;
  ownerParticId?: Maybe<Scalars['String']['output']>;
  plannedActivityComment?: Maybe<Scalars['String']['output']>;
  rwmDateDecision?: Maybe<Scalars['DateTime']['output']>;
  rwmDateReceived?: Maybe<Scalars['DateTime']['output']>;
  rwmFaxAreaCode?: Maybe<Scalars['String']['output']>;
  rwmFaxNo?: Maybe<Scalars['String']['output']>;
  rwmParticId?: Maybe<Scalars['String']['output']>;
  rwmPhoneAreaCode?: Maybe<Scalars['String']['output']>;
  rwmPhoneNo?: Maybe<Scalars['String']['output']>;
  siteAddress?: Maybe<Scalars['String']['output']>;
  siteCity?: Maybe<Scalars['String']['output']>;
  siteDisclosureComment?: Maybe<Scalars['String']['output']>;
  siteId: Scalars['String']['output'];
  sitePostalCode?: Maybe<Scalars['String']['output']>;
  siteRegDateEntered?: Maybe<Scalars['DateTime']['output']>;
  siteRegDateRecd?: Maybe<Scalars['DateTime']['output']>;
  siteRegParticId?: Maybe<Scalars['String']['output']>;
  srAction: Scalars['String']['output'];
  userAction: Scalars['String']['output'];
  whenCreated: Scalars['DateTime']['output'];
  whenUpdated?: Maybe<Scalars['DateTime']['output']>;
  whoCreated: Scalars['String']['output'];
  whoUpdated?: Maybe<Scalars['String']['output']>;
};

export type SiteProfilesInputDto = {
  apiAction?: InputMaybe<Scalars['String']['input']>;
  dateCompleted: Scalars['DateTime']['input'];
  govDocumentsComment?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  localAuthDateForwarded?: InputMaybe<Scalars['DateTime']['input']>;
  localAuthDateRecd?: InputMaybe<Scalars['DateTime']['input']>;
  localAuthDateSubmitted?: InputMaybe<Scalars['DateTime']['input']>;
  plannedActivityComment?: InputMaybe<Scalars['String']['input']>;
  rwmDateDecision?: InputMaybe<Scalars['DateTime']['input']>;
  rwmDateReceived?: InputMaybe<Scalars['DateTime']['input']>;
  rwmParticId?: InputMaybe<Scalars['String']['input']>;
  siteDisclosureComment?: InputMaybe<Scalars['String']['input']>;
  siteId: Scalars['String']['input'];
  siteRegDateEntered?: InputMaybe<Scalars['DateTime']['input']>;
  siteRegDateRecd?: InputMaybe<Scalars['DateTime']['input']>;
  srAction: Scalars['String']['input'];
  userAction?: InputMaybe<Scalars['String']['input']>;
};

export type SiteRecordsForSrAction = {
  address: Scalars['String']['input'];
  changes: Scalars['String']['input'];
  id: Scalars['String']['input'];
  siteId: Scalars['String']['input'];
  whenUpdated: Scalars['String']['input'];
  whoUpdated: Scalars['String']['input'];
};

export type SiteRiskCd = {
  __typename?: 'SiteRiskCd';
  code: Scalars['String']['output'];
  description: Scalars['String']['output'];
};

export type SiteStatusCd = {
  __typename?: 'SiteStatusCd';
  code: Scalars['String']['output'];
  description: Scalars['String']['output'];
};

export type SiteSubdivisions = {
  __typename?: 'SiteSubdivisions';
  dateNoted: Scalars['DateTime']['output'];
  initialIndicator: Scalars['String']['output'];
  sendToSr: Scalars['String']['output'];
  siteId: Scalars['String']['output'];
  siteSubdivId: Scalars['String']['output'];
  sprofDateCompleted: Scalars['DateTime']['output'];
  srAction: Scalars['String']['output'];
  subdivId: Scalars['String']['output'];
  userAction: Scalars['String']['output'];
  whenCreated: Scalars['DateTime']['output'];
  whenUpdated: Scalars['DateTime']['output'];
  whoCreated: Scalars['String']['output'];
  whoUpdated: Scalars['String']['output'];
};

export type SiteSummaryDto = {
  addrLine_1: Scalars['String']['input'];
  addrLine_2?: InputMaybe<Scalars['String']['input']>;
  addrLine_3?: InputMaybe<Scalars['String']['input']>;
  addrLine_4?: InputMaybe<Scalars['String']['input']>;
  addrType?: InputMaybe<Scalars['String']['input']>;
  apiAction?: InputMaybe<Scalars['String']['input']>;
  bcerCode?: InputMaybe<Scalars['String']['input']>;
  city: Scalars['String']['input'];
  classCode?: InputMaybe<Scalars['String']['input']>;
  commonName?: InputMaybe<Scalars['String']['input']>;
  consultantSubmitted?: InputMaybe<Scalars['String']['input']>;
  generalDescription?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  latDegrees?: InputMaybe<Scalars['Float']['input']>;
  latMinutes?: InputMaybe<Scalars['Float']['input']>;
  latSeconds?: InputMaybe<Scalars['Float']['input']>;
  latdeg?: InputMaybe<Scalars['Float']['input']>;
  latlongReliabilityFlag?: InputMaybe<Scalars['String']['input']>;
  longDegrees?: InputMaybe<Scalars['Float']['input']>;
  longMinutes?: InputMaybe<Scalars['Float']['input']>;
  longSeconds?: InputMaybe<Scalars['Float']['input']>;
  longdeg?: InputMaybe<Scalars['Float']['input']>;
  postalCode?: InputMaybe<Scalars['String']['input']>;
  provState?: InputMaybe<Scalars['String']['input']>;
  regionalFileNo?: InputMaybe<Scalars['String']['input']>;
  rwmFlag?: InputMaybe<Scalars['Float']['input']>;
  rwmGeneralDescFlag?: InputMaybe<Scalars['Float']['input']>;
  siteRiskCode?: InputMaybe<Scalars['String']['input']>;
  srAction: Scalars['String']['input'];
  srStatus?: InputMaybe<Scalars['String']['input']>;
  sstCode?: InputMaybe<Scalars['String']['input']>;
  userAction?: InputMaybe<Scalars['String']['input']>;
  victoriaFileNo?: InputMaybe<Scalars['String']['input']>;
  whenCreated?: InputMaybe<Scalars['DateTime']['input']>;
  whenUpdated?: InputMaybe<Scalars['DateTime']['input']>;
  whoCreated?: InputMaybe<Scalars['String']['input']>;
  whoUpdated?: InputMaybe<Scalars['String']['input']>;
};

export type Sites = {
  __typename?: 'Sites';
  addrLine_1: Scalars['String']['output'];
  addrLine_2?: Maybe<Scalars['String']['output']>;
  addrLine_3?: Maybe<Scalars['String']['output']>;
  addrLine_4?: Maybe<Scalars['String']['output']>;
  addrType: Scalars['String']['output'];
  bcerCode: Scalars['String']['output'];
  bcerCode2: BceRegionCd;
  cart?: Maybe<Array<Cart>>;
  city: Scalars['String']['output'];
  classCode?: Maybe<Scalars['String']['output']>;
  classCode2: ClassificationCd;
  commonName: Scalars['String']['output'];
  consultantSubmitted?: Maybe<Scalars['String']['output']>;
  events: Array<Events>;
  folioContents?: Maybe<Array<FolioContents>>;
  generalDescription?: Maybe<Scalars['String']['output']>;
  geometry?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  landHistories: Array<LandHistories>;
  latDegrees?: Maybe<Scalars['Float']['output']>;
  latMinutes?: Maybe<Scalars['Float']['output']>;
  latSeconds?: Maybe<Scalars['Float']['output']>;
  latdeg?: Maybe<Scalars['Float']['output']>;
  latlongReliabilityFlag: Scalars['String']['output'];
  longDegrees?: Maybe<Scalars['Float']['output']>;
  longMinutes?: Maybe<Scalars['Float']['output']>;
  longSeconds?: Maybe<Scalars['Float']['output']>;
  longdeg?: Maybe<Scalars['Float']['output']>;
  mailouts: Array<Mailout>;
  postalCode?: Maybe<Scalars['String']['output']>;
  provState: Scalars['String']['output'];
  recentViewedSites?: Maybe<Array<RecentViews>>;
  regionalFileNo?: Maybe<Scalars['String']['output']>;
  rwmFlag: Scalars['Float']['output'];
  rwmGeneralDescFlag: Scalars['Float']['output'];
  siteAssocs: Array<SiteAssocs>;
  siteAssocs2: Array<SiteAssocs>;
  siteCrownLandContaminated: SiteCrownLandContaminated;
  siteDocs: Array<SiteDocs>;
  sitePartics: Array<SitePartics>;
  siteProfiles: Array<SiteProfiles>;
  siteRiskCode: Scalars['String']['output'];
  siteRiskCode2: SiteRiskCd;
  siteSubdivisions: SiteSubdivisions;
  srAction: Scalars['String']['output'];
  srStatus: Scalars['String']['output'];
  sstCode: Scalars['String']['output'];
  sstCode2: SiteStatusCd;
  userAction: Scalars['String']['output'];
  victoriaFileNo?: Maybe<Scalars['String']['output']>;
  whenCreated: Scalars['DateTime']['output'];
  whenUpdated?: Maybe<Scalars['DateTime']['output']>;
  whoCreated: Scalars['String']['output'];
  whoUpdated?: Maybe<Scalars['String']['output']>;
};

export type SnapshotResponse = {
  __typename?: 'SnapshotResponse';
  data?: Maybe<Array<Snapshots>>;
  httpStatusCode?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  timestamp?: Maybe<Scalars['String']['output']>;
};

export type Snapshots = {
  __typename?: 'Snapshots';
  siteId: Scalars['String']['output'];
  snapshotData: Scalars['JSON']['output'];
  transactionId: Scalars['String']['output'];
  userId: Scalars['String']['output'];
  whenCreated: Scalars['DateTime']['output'];
  whenUpdated?: Maybe<Scalars['DateTime']['output']>;
  whoCreated: Scalars['String']['output'];
  whoUpdated?: Maybe<Scalars['String']['output']>;
};

export type _Service = {
  __typename?: '_Service';
  sdl?: Maybe<Scalars['String']['output']>;
};

export enum Link__Purpose {
  /** `EXECUTION` features provide metadata necessary for operation execution. */
  Execution = 'EXECUTION',
  /** `SECURITY` features provide metadata necessary to securely resolve fields. */
  Security = 'SECURITY'
}

export type Folio_GetFolioItemsForUserQueryVariables = Exact<{ [key: string]: never; }>;


export type Folio_GetFolioItemsForUserQuery = { __typename?: 'Query', getFolioItemsForUser: { __typename?: 'FolioResponse', data?: Array<{ __typename?: 'Folio', id: number, userId: string, folioId: string, description: string, whoCreated: string, whenUpdated?: any | null }> | null } };

export type Folio_AddSiteToFolioMutationVariables = Exact<{
  addSiteToFolioDTO: Array<AddSiteToFolioDto> | AddSiteToFolioDto;
}>;


export type Folio_AddSiteToFolioMutation = { __typename?: 'Mutation', addSiteToFolio: { __typename?: 'FolioResponse', message?: string | null, httpStatusCode?: number | null, success?: boolean | null } };

export type MapSearchQueryVariables = Exact<{
  searchParam?: InputMaybe<Scalars['String']['input']>;
}>;


export type MapSearchQuery = { __typename?: 'Query', mapSearch: { __typename?: 'MapSearchResponse', data: Array<{ __typename?: 'Sites', id: string, addrLine_1: string, latdeg?: number | null, longdeg?: number | null }> } };

export type MapSearch_FindSiteBySiteIdQueryVariables = Exact<{
  siteId: Scalars['String']['input'];
}>;


export type MapSearch_FindSiteBySiteIdQuery = { __typename?: 'Query', findSiteBySiteId: { __typename?: 'FetchSiteDetail', data?: { __typename?: 'Sites', id: string, addrLine_1: string, addrLine_2?: string | null, addrLine_3?: string | null, addrLine_4?: string | null, city: string, latDegrees?: number | null, latMinutes?: number | null, latSeconds?: number | null, longDegrees?: number | null, longMinutes?: number | null, longSeconds?: number | null, generalDescription?: string | null, siteRiskCode: string } | null } };


export const Folio_GetFolioItemsForUserDocument = gql`
    query Folio_getFolioItemsForUser {
  getFolioItemsForUser {
    data {
      id
      userId
      folioId
      description
      whoCreated
      whenUpdated
    }
  }
}
    `;

/**
 * __useFolio_GetFolioItemsForUserQuery__
 *
 * To run a query within a React component, call `useFolio_GetFolioItemsForUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useFolio_GetFolioItemsForUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFolio_GetFolioItemsForUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useFolio_GetFolioItemsForUserQuery(baseOptions?: Apollo.QueryHookOptions<Folio_GetFolioItemsForUserQuery, Folio_GetFolioItemsForUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Folio_GetFolioItemsForUserQuery, Folio_GetFolioItemsForUserQueryVariables>(Folio_GetFolioItemsForUserDocument, options);
      }
export function useFolio_GetFolioItemsForUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Folio_GetFolioItemsForUserQuery, Folio_GetFolioItemsForUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Folio_GetFolioItemsForUserQuery, Folio_GetFolioItemsForUserQueryVariables>(Folio_GetFolioItemsForUserDocument, options);
        }
export function useFolio_GetFolioItemsForUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<Folio_GetFolioItemsForUserQuery, Folio_GetFolioItemsForUserQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Folio_GetFolioItemsForUserQuery, Folio_GetFolioItemsForUserQueryVariables>(Folio_GetFolioItemsForUserDocument, options);
        }
export type Folio_GetFolioItemsForUserQueryHookResult = ReturnType<typeof useFolio_GetFolioItemsForUserQuery>;
export type Folio_GetFolioItemsForUserLazyQueryHookResult = ReturnType<typeof useFolio_GetFolioItemsForUserLazyQuery>;
export type Folio_GetFolioItemsForUserSuspenseQueryHookResult = ReturnType<typeof useFolio_GetFolioItemsForUserSuspenseQuery>;
export type Folio_GetFolioItemsForUserQueryResult = Apollo.QueryResult<Folio_GetFolioItemsForUserQuery, Folio_GetFolioItemsForUserQueryVariables>;
export const Folio_AddSiteToFolioDocument = gql`
    mutation Folio_addSiteToFolio($addSiteToFolioDTO: [AddSiteToFolioDTO!]!) {
  addSiteToFolio(addSiteToFolioDTO: $addSiteToFolioDTO) {
    message
    httpStatusCode
    success
  }
}
    `;
export type Folio_AddSiteToFolioMutationFn = Apollo.MutationFunction<Folio_AddSiteToFolioMutation, Folio_AddSiteToFolioMutationVariables>;

/**
 * __useFolio_AddSiteToFolioMutation__
 *
 * To run a mutation, you first call `useFolio_AddSiteToFolioMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useFolio_AddSiteToFolioMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [folioAddSiteToFolioMutation, { data, loading, error }] = useFolio_AddSiteToFolioMutation({
 *   variables: {
 *      addSiteToFolioDTO: // value for 'addSiteToFolioDTO'
 *   },
 * });
 */
export function useFolio_AddSiteToFolioMutation(baseOptions?: Apollo.MutationHookOptions<Folio_AddSiteToFolioMutation, Folio_AddSiteToFolioMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Folio_AddSiteToFolioMutation, Folio_AddSiteToFolioMutationVariables>(Folio_AddSiteToFolioDocument, options);
      }
export type Folio_AddSiteToFolioMutationHookResult = ReturnType<typeof useFolio_AddSiteToFolioMutation>;
export type Folio_AddSiteToFolioMutationResult = Apollo.MutationResult<Folio_AddSiteToFolioMutation>;
export type Folio_AddSiteToFolioMutationOptions = Apollo.BaseMutationOptions<Folio_AddSiteToFolioMutation, Folio_AddSiteToFolioMutationVariables>;
export const MapSearchDocument = gql`
    query mapSearch($searchParam: String) {
  mapSearch(searchParam: $searchParam) {
    data {
      id
      addrLine_1
      latdeg
      longdeg
    }
  }
}
    `;

/**
 * __useMapSearchQuery__
 *
 * To run a query within a React component, call `useMapSearchQuery` and pass it any options that fit your needs.
 * When your component renders, `useMapSearchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMapSearchQuery({
 *   variables: {
 *      searchParam: // value for 'searchParam'
 *   },
 * });
 */
export function useMapSearchQuery(baseOptions?: Apollo.QueryHookOptions<MapSearchQuery, MapSearchQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MapSearchQuery, MapSearchQueryVariables>(MapSearchDocument, options);
      }
export function useMapSearchLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MapSearchQuery, MapSearchQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MapSearchQuery, MapSearchQueryVariables>(MapSearchDocument, options);
        }
export function useMapSearchSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MapSearchQuery, MapSearchQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MapSearchQuery, MapSearchQueryVariables>(MapSearchDocument, options);
        }
export type MapSearchQueryHookResult = ReturnType<typeof useMapSearchQuery>;
export type MapSearchLazyQueryHookResult = ReturnType<typeof useMapSearchLazyQuery>;
export type MapSearchSuspenseQueryHookResult = ReturnType<typeof useMapSearchSuspenseQuery>;
export type MapSearchQueryResult = Apollo.QueryResult<MapSearchQuery, MapSearchQueryVariables>;
export const MapSearch_FindSiteBySiteIdDocument = gql`
    query MapSearch_findSiteBySiteId($siteId: String!) {
  findSiteBySiteId(siteId: $siteId) {
    data {
      id
      addrLine_1
      addrLine_2
      addrLine_3
      addrLine_4
      city
      latDegrees
      latMinutes
      latSeconds
      longDegrees
      longMinutes
      longSeconds
      generalDescription
      siteRiskCode
    }
  }
}
    `;

/**
 * __useMapSearch_FindSiteBySiteIdQuery__
 *
 * To run a query within a React component, call `useMapSearch_FindSiteBySiteIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useMapSearch_FindSiteBySiteIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMapSearch_FindSiteBySiteIdQuery({
 *   variables: {
 *      siteId: // value for 'siteId'
 *   },
 * });
 */
export function useMapSearch_FindSiteBySiteIdQuery(baseOptions: Apollo.QueryHookOptions<MapSearch_FindSiteBySiteIdQuery, MapSearch_FindSiteBySiteIdQueryVariables> & ({ variables: MapSearch_FindSiteBySiteIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MapSearch_FindSiteBySiteIdQuery, MapSearch_FindSiteBySiteIdQueryVariables>(MapSearch_FindSiteBySiteIdDocument, options);
      }
export function useMapSearch_FindSiteBySiteIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MapSearch_FindSiteBySiteIdQuery, MapSearch_FindSiteBySiteIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MapSearch_FindSiteBySiteIdQuery, MapSearch_FindSiteBySiteIdQueryVariables>(MapSearch_FindSiteBySiteIdDocument, options);
        }
export function useMapSearch_FindSiteBySiteIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MapSearch_FindSiteBySiteIdQuery, MapSearch_FindSiteBySiteIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MapSearch_FindSiteBySiteIdQuery, MapSearch_FindSiteBySiteIdQueryVariables>(MapSearch_FindSiteBySiteIdDocument, options);
        }
export type MapSearch_FindSiteBySiteIdQueryHookResult = ReturnType<typeof useMapSearch_FindSiteBySiteIdQuery>;
export type MapSearch_FindSiteBySiteIdLazyQueryHookResult = ReturnType<typeof useMapSearch_FindSiteBySiteIdLazyQuery>;
export type MapSearch_FindSiteBySiteIdSuspenseQueryHookResult = ReturnType<typeof useMapSearch_FindSiteBySiteIdSuspenseQuery>;
export type MapSearch_FindSiteBySiteIdQueryResult = Apollo.QueryResult<MapSearch_FindSiteBySiteIdQuery, MapSearch_FindSiteBySiteIdQueryVariables>;