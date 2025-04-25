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
  JSON: { input: any; output: any; }
  LatLngTuple: { input: any; output: any; }
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
  srAction?: Maybe<Scalars['String']['output']>;
  srValue: Scalars['Boolean']['output'];
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
  bucketId?: Maybe<Scalars['String']['output']>;
  displayName?: Maybe<Scalars['String']['output']>;
  docParticId?: Maybe<Scalars['String']['output']>;
  documentDate?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  objectId?: Maybe<Scalars['String']['output']>;
  organizationName?: Maybe<Scalars['String']['output']>;
  psnorgId?: Maybe<Scalars['String']['output']>;
  siteId: Scalars['String']['output'];
  srAction?: Maybe<Scalars['String']['output']>;
  srValue: Scalars['Boolean']['output'];
  submissionDate: Scalars['String']['output'];
  title: Scalars['String']['output'];
  userAction: Scalars['String']['output'];
  whenCreated: Scalars['DateTime']['output'];
  whenUpdated?: Maybe<Scalars['DateTime']['output']>;
};

export type DocumentInputDto = {
  apiAction?: InputMaybe<Scalars['String']['input']>;
  bucketId: Scalars['String']['input'];
  displayName?: InputMaybe<Scalars['String']['input']>;
  docParticId?: InputMaybe<Scalars['String']['input']>;
  documentDate?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  objectId: Scalars['String']['input'];
  organizationName?: InputMaybe<Scalars['String']['input']>;
  psnorgId: Scalars['String']['input'];
  siteId: Scalars['String']['input'];
  srAction: Scalars['String']['input'];
  srValue?: InputMaybe<Scalars['Boolean']['input']>;
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
  srAction?: Maybe<Scalars['String']['output']>;
  userAction?: Maybe<Scalars['String']['output']>;
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
  srAction?: Maybe<Scalars['String']['output']>;
  userAction?: Maybe<Scalars['String']['output']>;
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

export type FindSitesAndPlaces = {
  __typename?: 'FindSitesAndPlaces';
  httpStatusCode?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  places: Array<Place>;
  sites: Array<Sites>;
  success?: Maybe<Scalars['Boolean']['output']>;
  timestamp?: Maybe<Scalars['String']['output']>;
};

export type FindSitesAndPlacesResponse = {
  __typename?: 'FindSitesAndPlacesResponse';
  data: FindSitesAndPlaces;
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
  srAction?: Maybe<Scalars['String']['output']>;
  userAction?: Maybe<Scalars['String']['output']>;
  whenCreated: Scalars['DateTime']['output'];
  whenUpdated?: Maybe<Scalars['DateTime']['output']>;
  whoCreated: Scalars['String']['output'];
  whoUpdated?: Maybe<Scalars['String']['output']>;
};

export type LandHistoriesDto = {
  __typename?: 'LandHistoriesDTO';
  guid: Scalars['String']['output'];
  landUse: LandUseCd;
  lutCode: Scalars['String']['output'];
  note?: Maybe<Scalars['String']['output']>;
  profileDateReceived?: Maybe<Scalars['DateTime']['output']>;
  rwmFlag: Scalars['Float']['output'];
  rwmNoteFlag: Scalars['Float']['output'];
  site: Sites;
  siteId: Scalars['String']['output'];
  siteProfile?: Maybe<Scalars['String']['output']>;
  srAction?: Maybe<Scalars['String']['output']>;
  srValue: Scalars['Boolean']['output'];
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
  srValue?: InputMaybe<Scalars['Boolean']['input']>;
  userAction?: InputMaybe<Scalars['String']['input']>;
};

export type LandHistoryResponse = {
  __typename?: 'LandHistoryResponse';
  data: Array<LandHistoriesDto>;
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
  srAction?: Maybe<Scalars['String']['output']>;
  srValue: Scalars['Boolean']['output'];
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
  srValue?: InputMaybe<Scalars['Boolean']['input']>;
  userAction?: InputMaybe<Scalars['String']['input']>;
};

export type NotationParticipantDto = {
  __typename?: 'NotationParticipantDto';
  displayName: Scalars['String']['output'];
  eprCode: Scalars['String']['output'];
  eventId: Scalars['String']['output'];
  eventParticId: Scalars['String']['output'];
  psnorgId: Scalars['String']['output'];
  srAction?: Maybe<Scalars['String']['output']>;
  srValue: Scalars['Boolean']['output'];
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
  srValue?: InputMaybe<Scalars['Boolean']['input']>;
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
  id: Scalars['String']['output'];
  idPinNumber: Scalars['String']['output'];
  landDescription: Scalars['String']['output'];
  srAction: Scalars['String']['output'];
  srValue: Scalars['Boolean']['output'];
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
  srValue?: InputMaybe<Scalars['Boolean']['input']>;
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

export type Place = {
  __typename?: 'Place';
  id: Scalars['String']['output'];
  latdeg: Scalars['Float']['output'];
  longdeg: Scalars['Float']['output'];
  name: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  _service: _Service;
  findSiteBySiteId: FetchSiteDetail;
  findSiteBySiteIdLoggedInUser: FetchSiteDetail;
  findSitesAndPlaces: FindSitesAndPlacesResponse;
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


export type QueryFindSiteBySiteIdLoggedInUserArgs = {
  pending?: InputMaybe<Scalars['Boolean']['input']>;
  siteId: Scalars['String']['input'];
};


export type QueryFindSitesAndPlacesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  searchParam: Scalars['String']['input'];
};


export type QueryGetAssociatedSitesBySiteIdArgs = {
  pending?: InputMaybe<Scalars['Boolean']['input']>;
  siteId: Scalars['String']['input'];
};


export type QueryGetBannerTypeArgs = {
  siteId: Scalars['String']['input'];
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
  circle?: InputMaybe<RadiusSearchParams>;
  polygon?: InputMaybe<Array<Scalars['LatLngTuple']['input']>>;
  searchParam?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySearchSiteIdsArgs = {
  searchParam: Scalars['String']['input'];
};


export type QuerySearchSitesArgs = {
  filters: SiteFilters;
  page: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
  searchParam: Scalars['String']['input'];
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

export type RadiusSearchParams = {
  center: Scalars['LatLngTuple']['input'];
  radius: Scalars['Float']['input'];
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
  srValue?: InputMaybe<Scalars['Boolean']['input']>;
  userAction?: InputMaybe<Scalars['String']['input']>;
};

export type SiteAssocs = {
  __typename?: 'SiteAssocs';
  commonPid: Scalars['String']['output'];
  effectiveDate: Scalars['DateTime']['output'];
  note: Scalars['String']['output'];
  rwmFlag?: Maybe<Scalars['Float']['output']>;
  rwmNoteFlag?: Maybe<Scalars['Float']['output']>;
  site: Sites;
  siteId: Scalars['String']['output'];
  siteIdAssociatedWith: Scalars['String']['output'];
  siteIdAssociatedWith2: Sites;
  srAction?: Maybe<Scalars['String']['output']>;
  userAction?: Maybe<Scalars['String']['output']>;
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
  srAction?: Maybe<Scalars['String']['output']>;
  userAction?: Maybe<Scalars['String']['output']>;
  whenCreated: Scalars['DateTime']['output'];
  whenDeleted?: Maybe<Scalars['DateTime']['output']>;
  whenUpdated?: Maybe<Scalars['DateTime']['output']>;
  whoCreated: Scalars['String']['output'];
  whoDeleted?: Maybe<Scalars['String']['output']>;
  whoUpdated?: Maybe<Scalars['String']['output']>;
};

export type SiteDocs = {
  __typename?: 'SiteDocs';
  bucketId: Scalars['String']['output'];
  documentDate?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  note?: Maybe<Scalars['String']['output']>;
  objectId: Scalars['String']['output'];
  rwmFlag?: Maybe<Scalars['Float']['output']>;
  rwmNoteFlag?: Maybe<Scalars['Float']['output']>;
  siteDocPartics: Array<SiteDocPartics>;
  siteId: Scalars['String']['output'];
  srAction?: Maybe<Scalars['String']['output']>;
  submissionDate: Scalars['DateTime']['output'];
  title: Scalars['String']['output'];
  userAction?: Maybe<Scalars['String']['output']>;
  whenCreated: Scalars['DateTime']['output'];
  whenDeleted?: Maybe<Scalars['DateTime']['output']>;
  whenUpdated?: Maybe<Scalars['DateTime']['output']>;
  whoCreated: Scalars['String']['output'];
  whoDeleted?: Maybe<Scalars['String']['output']>;
  whoUpdated?: Maybe<Scalars['String']['output']>;
};

export type SiteFilters = {
  addrLine_1?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  commonName?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  latDegrees?: InputMaybe<Scalars['Float']['input']>;
  latMinutes?: InputMaybe<Scalars['Float']['input']>;
  latSeconds?: InputMaybe<Scalars['String']['input']>;
  latdeg?: InputMaybe<Scalars['Float']['input']>;
  latlongReliabilityFlag?: InputMaybe<Scalars['String']['input']>;
  longDegrees?: InputMaybe<Scalars['Float']['input']>;
  longMinutes?: InputMaybe<Scalars['Float']['input']>;
  longSeconds?: InputMaybe<Scalars['String']['input']>;
  longdeg?: InputMaybe<Scalars['Float']['input']>;
  /** If provided, only applies the filters to the specified sites */
  siteIds?: InputMaybe<Array<Scalars['String']['input']>>;
  siteRiskCode?: InputMaybe<Scalars['String']['input']>;
  srStatus?: InputMaybe<Scalars['String']['input']>;
  whenCreated?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  whenUpdated?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  whoCreated?: InputMaybe<Scalars['String']['input']>;
};

export type SiteParticRoles = {
  __typename?: 'SiteParticRoles';
  prCode: Scalars['String']['output'];
  prCode2: ParticRoleCd;
  rwmFlag?: Maybe<Scalars['Float']['output']>;
  spId: Scalars['String']['output'];
  srAction?: Maybe<Scalars['String']['output']>;
  userAction?: Maybe<Scalars['String']['output']>;
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
  srAction?: Maybe<Scalars['String']['output']>;
  userAction?: Maybe<Scalars['String']['output']>;
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
  srAction?: Maybe<Scalars['String']['output']>;
  srValue: Scalars['Boolean']['output'];
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
  srValue?: InputMaybe<Scalars['Boolean']['input']>;
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
  srAction?: Maybe<Scalars['String']['output']>;
  userAction?: Maybe<Scalars['String']['output']>;
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
  srValue?: InputMaybe<Scalars['Boolean']['input']>;
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
  srAction?: Maybe<Scalars['String']['output']>;
  subdivId: Scalars['String']['output'];
  userAction?: Maybe<Scalars['String']['output']>;
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
  srValue?: InputMaybe<Scalars['Boolean']['input']>;
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
  srAction?: Maybe<Scalars['String']['output']>;
  srStatus: Scalars['String']['output'];
  sstCode: Scalars['String']['output'];
  sstCode2: SiteStatusCd;
  userAction?: Maybe<Scalars['String']['output']>;
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
