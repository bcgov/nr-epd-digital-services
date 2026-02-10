# GraphQL API Examples

Complete examples for all queries and mutations in the Cats Service GraphQL API.

## Table of Contents

- [Person Management](#person-management)
- [Application Management](#application-management)
- [Application Participants](#application-participants)
- [Notes Management](#notes-management)
- [Housing Management](#housing-management)
- [Invoice Management](#invoice-management)
- [Staff Management](#staff-management)
- [Timesheet Management](#timesheet-management)
- [Site Management](#site-management)
- [Permissions](#permissions)
- [Dashboard](#dashboard)
- [COMS (File Management)](#coms-file-management)
- [Column Preferences](#column-preferences)

---

## Person Management

### Query: findAllPerson

Get all persons in the system.

```graphql
query {
  findAllPerson {
    message
    httpStatusCode
    success
    data {
      id
      firstName
      middleName
      lastName
      email
      phone
      mobile
      address_1
      city
      prov
      postal
      isActive
      isTaxExempt
      permissionIds
    }
  }
}
```


### Query: findPersonById

Get a specific person by ID.

```graphql
query GetPersonById($id: Float!) {
  findPersonById(id: $id) {
    message
    httpStatusCode
    success
    data {
      id
      firstName
      lastName
      email
      phone
      address_1
      city
      isActive
    }
  }
}
```

**Variables:**
```json
{
  "id": 123
}
```

### Query: searchPerson

Search for persons with pagination.

```graphql
query SearchPerson($searchParam: String!, $page: Int!, $pageSize: Int!) {
  searchPerson(searchParam: $searchParam, page: $page, pageSize: $pageSize) {
    message
    httpStatusCode
    success
    count
    page
    pageSize
    persons {
      id
      firstName
      lastName
      email
      phone
      city
    }
  }
}
```

**Variables:**
```json
{
  "searchParam": "John",
  "page": 1,
  "pageSize": 10
}
```


### Mutation: createPerson

Create a new person.

```graphql
mutation CreatePerson($person: CreatePerson!) {
  createPerson(person: $person) {
    message
    httpStatusCode
    success
  }
}
```

**Variables:**
```json
{
  "person": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "555-1234",
    "address_1": "123 Main St",
    "city": "Vancouver",
    "prov": "BC",
    "postal": "V6B 1A1",
    "isTaxExempt": false,
    "isActive": true,
    "isDeleted": false,
    "permissionIds": [1, 2]
  }
}
```

### Mutation: updatePerson

Update existing person(s).

```graphql
mutation UpdatePerson($input: [UpdatePerson!]!) {
  updatePerson(input: $input) {
    message
    httpStatusCode
    success
  }
}
```

**Variables:**
```json
{
  "input": [
    {
      "id": 123,
      "firstName": "John",
      "lastName": "Smith",
      "email": "john.smith@example.com",
      "phone": "555-5678",
      "isActive": true,
      "isTaxExempt": false,
      "isDeleted": false
    }
  ]
}
```


---

## Application Management

### Query: searchApplications

Search applications with filters and pagination.

```graphql
query SearchApplications(
  $searchParam: String!
  $page: Int!
  $pageSize: Int!
  $filter: Filter!
  $sortBy: ApplicationSortByField
  $sortByDir: ApplicationSortByDirection
) {
  searchApplications(
    searchParam: $searchParam
    page: $page
    pageSize: $pageSize
    filter: $filter
    sortBy: $sortBy
    sortByDir: $sortByDir
  ) {
    message
    httpStatusCode
    success
    count
    page
    pageSize
    applications {
      id
      siteId
      siteAddress
      applicationType
      status
      priority
      receivedDate
      dateCompleted
      staffAssigned {
        firstName
        lastName
      }
    }
  }
}
```

**Variables:**
```json
{
  "searchParam": "",
  "page": 1,
  "pageSize": 20,
  "filter": "ALL",
  "sortBy": "ID",
  "sortByDir": "DESC"
}
```

**Filter Options:** `ALL`, `UNASSIGNED`, `COMPLETED`, `OVERCAPACITY`, `ASSIGNED`, `MY_ASSIGNED`

**Sort By Options:** `ID`, `SITE_ID`, `SITE_ADDRESS`, `APPLICATION_TYPE`, `LAST_UPDATED`, `STATUS`, `PRIORITY`, `RECEIVED_DATE`, `DATE_COMPLETED`


### Query: searchApplicationsById

Search applications by ID.

```graphql
query SearchApplicationsById($query: String!) {
  searchApplicationsById(query: $query) {
    message
    success
    applications {
      id
      siteId
      siteAddress
      applicationType
      status
    }
  }
}
```

**Variables:**
```json
{
  "query": "12345"
}
```

### Query: getApplicationDetailsById

Get detailed information about an application.

```graphql
query GetApplicationDetails($id: Int!) {
  getApplicationDetailsById(id: $id) {
    message
    httpStatusCode
    success
    data {
      id
      siteId
      siteAddress
      siteCity
      csapRefNumber
      receivedDate
      queuedDate
      endDate
      isHousing
      isTaxExempt
      formId
      submissionId
      appType {
        id
        abbrev
        description
      }
      currentStatus {
        id
        abbrev
        description
      }
      priority {
        id
        abbrev
        description
      }
    }
  }
}
```

**Variables:**
```json
{
  "id": 123
}
```


### Mutation: createApplication

Create a new application.

```graphql
mutation CreateApplication($application: CreateApplication!) {
  createApplication(application: $application) {
    message
    httpStatusCode
    success
    data {
      id
    }
  }
}
```

**Variables:**
```json
{
  "application": {
    "siteIds": [456],
    "appTypeAbbrev": "CSAP",
    "receivedDate": "2024-01-15T00:00:00Z",
    "applicationStatus": [
      {
        "applicationId": 0,
        "statusTypeAbbrev": "PENDING",
        "isCurrent": true,
        "formId": "form-123",
        "submissionId": "sub-456",
        "formsflowAppId": 789
      }
    ],
    "applicationSpecificData": "{\"notes\": \"Initial submission\"}"
  }
}
```

### Mutation: updateFormsflowAppId

Update formsflow application ID.

```graphql
mutation UpdateFormsflowAppId($appStatusInput: UpdateApplicationStatusDto!) {
  updateFormsflowAppId(appStatusInput: $appStatusInput) {
    message
    httpStatusCode
    success
    data {
      formsflowAppId
    }
  }
}
```

**Variables:**
```json
{
  "appStatusInput": {
    "statusTypeAbbrev": "APPROVED",
    "formId": "form-123",
    "submissionId": "sub-456",
    "formsflowAppId": 789,
    "siteIds": [456]
  }
}
```


---

## Application Participants

### Query: getAppParticipantsByAppId

Get participants for an application.

```graphql
query GetAppParticipants($applicationId: Int!, $filter: AppParticipantFilter) {
  getAppParticipantsByAppId(applicationId: $applicationId, filter: $filter) {
    message
    httpStatusCode
    success
    data {
      id
      applicationId
      firstName
      lastName
      fullName
      description
      isMainParticipant
      effectiveStartDate
      effectiveEndDate
      participantRole {
        id
        description
        roleType
      }
      organization {
        id
        name
      }
    }
  }
}
```

**Variables:**
```json
{
  "applicationId": 123,
  "filter": "ALL"
}
```

**Filter Options:** `ALL`, `MAIN`

### Query: getAllParticipantRoles

Get all participant roles.

```graphql
query GetParticipantRoles($roleType: String) {
  getAllParticipantRoles(roleType: $roleType) {
    message
    success
    data {
      id
      description
      roleType
    }
  }
}
```

**Variables:**
```json
{
  "roleType": "APPLICANT"
}
```


### Query: getParticipantNames

Search for participant names (dropdown).

```graphql
query GetParticipantNames($searchParam: String!) {
  getParticipantNames(searchParam: $searchParam) {
    message
    success
    data {
      key
      value
    }
  }
}
```

**Variables:**
```json
{
  "searchParam": "John"
}
```

### Query: getOrganizations

Search for organizations (dropdown).

```graphql
query GetOrganizations($searchParamForOrg: String!) {
  getOrganizations(searchParamForOrg: $searchParamForOrg) {
    message
    success
    data {
      key
      value
    }
  }
}
```

**Variables:**
```json
{
  "searchParamForOrg": "Ministry"
}
```

### Mutation: createAppParticipant

Add a participant to an application.

```graphql
mutation CreateAppParticipant($newAppParticipant: CreateAppParticipantDto!) {
  createAppParticipant(newAppParticipant: $newAppParticipant) {
    message
    httpStatusCode
    success
    data {
      id
      applicationId
      personId
      participantRoleId
    }
  }
}
```

**Variables:**
```json
{
  "newAppParticipant": {
    "applicationId": 123,
    "personId": 456,
    "participantRoleId": 2,
    "organizationId": 10,
    "effectiveStartDate": "2024-01-01T00:00:00Z",
    "effectiveEndDate": null
  }
}
```


### Mutation: updateAppParticipant

Update an application participant.

```graphql
mutation UpdateAppParticipant($updateAppParticipant: UpdateAppParticipantDto!) {
  updateAppParticipant(updateAppParticipant: $updateAppParticipant) {
    message
    httpStatusCode
    success
  }
}
```

**Variables:**
```json
{
  "updateAppParticipant": {
    "id": 789,
    "applicationId": 123,
    "effectiveStartDate": "2024-01-01T00:00:00Z",
    "effectiveEndDate": "2024-12-31T23:59:59Z"
  }
}
```

---

## Notes Management

### Query: getPersonNotesByPersonId

Get notes for a person.

```graphql
query GetPersonNotes($id: Float!) {
  getPersonNotesByPersonId(id: $id) {
    message
    httpStatusCode
    success
    data {
      id
      noteDescription
      user
      date
    }
  }
}
```

**Variables:**
```json
{
  "id": 123
}
```

### Query: getApplicationNotesByApplicationId

Get notes for an application.

```graphql
query GetApplicationNotes($applicationId: Int!) {
  getApplicationNotesByApplicationId(applicationId: $applicationId) {
    message
    httpStatusCode
    success
    data {
      id
      applicationId
      noteDate
      noteText
      createdBy
      createdDateTime
      updatedBy
      updatedDateTime
    }
  }
}
```

**Variables:**
```json
{
  "applicationId": 123
}
```


### Mutation: createPersonNote

Create a note for a person.

```graphql
mutation CreatePersonNote($note: CreatePersonNote!) {
  createPersonNote(note: $note) {
    message
    httpStatusCode
    success
  }
}
```

**Variables:**
```json
{
  "note": {
    "personId": 123,
    "noteDescription": "Follow up required regarding tax exemption status."
  }
}
```

### Mutation: updatePersonNote

Update a person note.

```graphql
mutation UpdatePersonNote($id: String!, $note: UpdatePersonNote!) {
  updatePersonNote(id: $id, note: $note) {
    message
    httpStatusCode
    success
  }
}
```

**Variables:**
```json
{
  "id": "456",
  "note": {
    "noteDescription": "Updated: Tax exemption verified and approved."
  }
}
```

### Mutation: deletePersonNote

Delete person note(s).

```graphql
mutation DeletePersonNote($notes: [DeletePersonNote!]!) {
  deletePersonNote(notes: $notes) {
    message
    httpStatusCode
    success
  }
}
```

**Variables:**
```json
{
  "notes": [
    { "id": "456" },
    { "id": "789" }
  ]
}
```


### Mutation: createApplicationNote

Create a note for an application.

```graphql
mutation CreateApplicationNote(
  $applicationId: Int!
  $noteDate: DateTime!
  $noteText: String!
) {
  createApplicationNote(
    applicationId: $applicationId
    noteDate: $noteDate
    noteText: $noteText
  ) {
    message
    httpStatusCode
    success
  }
}
```

**Variables:**
```json
{
  "applicationId": 123,
  "noteDate": "2024-01-15T10:30:00Z",
  "noteText": "Site inspection completed. No issues found."
}
```

### Mutation: updateApplicationNote

Update an application note.

```graphql
mutation UpdateApplicationNote(
  $noteId: Int!
  $noteDate: DateTime!
  $noteText: String!
) {
  updateApplicationNote(
    noteId: $noteId
    noteDate: $noteDate
    noteText: $noteText
  ) {
    message
    httpStatusCode
    success
  }
}
```

**Variables:**
```json
{
  "noteId": 456,
  "noteDate": "2024-01-16T14:00:00Z",
  "noteText": "Updated: Additional documentation received."
}
```

### Mutation: deleteApplicationNotes

Delete application note(s).

```graphql
mutation DeleteApplicationNotes($noteIds: [Int!]!) {
  deleteApplicationNotes(noteIds: $noteIds) {
    message
    httpStatusCode
    success
  }
}
```

**Variables:**
```json
{
  "noteIds": [456, 789]
}
```


---

## Housing Management

### Query: getApplicationHousingByApplicationId

Get housing information for an application.

```graphql
query GetApplicationHousing($applicationId: Int!) {
  getApplicationHousingByApplicationId(applicationId: $applicationId) {
    message
    httpStatusCode
    success
    data {
      id
      housing {
        id
        numberOfUnits
        effectiveDate
        expiryDate
        isRental {
          id
          abbrev
        }
        isSocial {
          id
          abbrev
        }
        isIndigenousLed {
          id
          abbrev
        }
        housingType {
          id
          abbrev
          description
        }
        relatedApplications
      }
    }
  }
}
```

**Variables:**
```json
{
  "applicationId": 123
}
```

### Query: getHousingTypes

Get all housing types.

```graphql
query {
  getHousingTypes {
    data {
      id
      abbrev
      description
      isActive
      displayOrder
    }
  }
}
```


### Mutation: addHousingToApplication

Add housing information to an application.

```graphql
mutation AddHousing($input: AddHousingInputDto!) {
  addHousingToApplication(input: $input) {
    message
    httpStatusCode
    success
  }
}
```

**Variables:**
```json
{
  "input": {
    "applicationId": 123,
    "housingTypeId": 2,
    "numberOfUnits": 50,
    "effectiveDate": "2024-01-01T00:00:00Z",
    "expiryDate": "2029-12-31T23:59:59Z",
    "isRental": true,
    "isSocial": false,
    "isIndigenousLed": true,
    "relatedApplicationIds": [456, 789]
  }
}
```

### Mutation: updateApplicationHousing

Update housing information for an application.

```graphql
mutation UpdateHousing($input: UpdateHousingInputDto!) {
  updateApplicationHousing(input: $input) {
    message
    httpStatusCode
    success
  }
}
```

**Variables:**
```json
{
  "input": {
    "applicationHousingId": 999,
    "housingTypeId": 3,
    "numberOfUnits": 75,
    "effectiveDate": "2024-06-01T00:00:00Z",
    "isRental": true,
    "isSocial": true,
    "relatedApplicationIds": [456]
  }
}
```


---

## Invoice Management

### Query: getInvoices

Get all invoices for an application.

```graphql
query GetInvoices($applicationId: Int!) {
  getInvoices(applicationId: $applicationId) {
    message
    httpStatusCode
    success
    data {
      id
      subject
      issuedDate
      dueDate
      invoiceStatus
      taxExempt
      pstExempt
      subtotalInCents
      gstInCents
      pstInCents
      totalInCents
      invoiceNotes
      recipient {
        key
        value
      }
      invoiceItems {
        id
        description
        quantity
        unitPriceInCents
        totalInCents
        itemType
      }
      invoiceAttachments {
        id
        fileName
        bucketId
        objectId
      }
    }
  }
}
```

**Variables:**
```json
{
  "applicationId": 123
}
```

### Query: getInvoiceById

Get a specific invoice by ID.

```graphql
query GetInvoice($invoiceId: Int!) {
  getInvoiceById(invoiceId: $invoiceId) {
    message
    httpStatusCode
    success
    data {
      id
      subject
      issuedDate
      dueDate
      invoiceStatus
      totalInCents
      recipient {
        key
        value
      }
      invoiceItems {
        description
        quantity
        unitPriceInCents
      }
    }
  }
}
```

**Variables:**
```json
{
  "invoiceId": 456
}
```


### Mutation: createInvoice

Create a new invoice.

```graphql
mutation CreateInvoice($invoice: CreateInvoice!) {
  createInvoice(invoice: $invoice) {
    message
    httpStatusCode
    success
    data {
      id
      subject
      totalInCents
    }
  }
}
```

**Variables:**
```json
{
  "invoice": {
    "personId": "123",
    "subject": "Application Review Fee",
    "issuedDate": "2024-01-15T00:00:00Z",
    "dueDate": "2024-02-15T00:00:00Z",
    "invoiceStatus": "DRAFT",
    "taxExempt": false,
    "pstExempt": false,
    "subtotalInCents": 50000,
    "gstInCents": 2500,
    "pstInCents": 3500,
    "totalInCents": 56000,
    "invoiceNotes": "Payment due within 30 days",
    "applicationId": 456,
    "invoiceItems": [
      {
        "description": "Application Review Fee",
        "quantity": 1,
        "unitPriceInCents": 50000,
        "totalInCents": 50000,
        "itemType": "SERVICE"
      }
    ],
    "invoiceAttachments": [
      {
        "invoiceId": 0,
        "fileName": "supporting-doc.pdf",
        "bucketId": "invoice-bucket",
        "objectId": "obj-123"
      }
    ]
  }
}
```

**Invoice Status Options:** `DRAFT`, `SENT`, `RECEIVED`, `PAID`


### Mutation: updateInvoice

Update an existing invoice.

```graphql
mutation UpdateInvoice($invoice: UpdateInvoice!) {
  updateInvoice(invoice: $invoice) {
    message
    httpStatusCode
    success
    data {
      id
      subject
      invoiceStatus
    }
  }
}
```

**Variables:**
```json
{
  "invoice": {
    "id": 456,
    "personId": "123",
    "subject": "Application Review Fee - Updated",
    "issuedDate": "2024-01-15T00:00:00Z",
    "dueDate": "2024-02-28T00:00:00Z",
    "invoiceStatus": "SENT",
    "taxExempt": false,
    "pstExempt": false,
    "subtotalInCents": 50000,
    "gstInCents": 2500,
    "pstInCents": 3500,
    "totalInCents": 56000,
    "applicationId": 456,
    "invoiceItems": [
      {
        "id": 789,
        "description": "Application Review Fee",
        "quantity": 1,
        "unitPriceInCents": 50000,
        "totalInCents": 50000,
        "itemType": "SERVICE"
      }
    ]
  }
}
```

### Mutation: deleteInvoice

Delete an invoice.

```graphql
mutation DeleteInvoice($invoiceId: Int!) {
  deleteInvoice(invoiceId: $invoiceId) {
    message
    httpStatusCode
    success
  }
}
```

**Variables:**
```json
{
  "invoiceId": 456
}
```


---

## Staff Management

### Query: getStaffs

Get staff members with pagination and filters.

```graphql
query GetStaffs(
  $page: Int!
  $pageSize: Int!
  $filter: Filter
  $sortBy: StaffSortByField
  $sortByDir: ApplicationSortByDirection
) {
  getStaffs(
    page: $page
    pageSize: $pageSize
    filter: $filter
    sortBy: $sortBy
    sortByDir: $sortByDir
  ) {
    message
    httpStatusCode
    success
    count
    page
    pageSize
    data {
      id
      name
      assignments
      capacity
    }
  }
}
```

**Variables:**
```json
{
  "page": 1,
  "pageSize": 20,
  "filter": "ALL",
  "sortBy": "NAME",
  "sortByDir": "ASC"
}
```

**Sort By Options:** `ID`, `NAME`, `ASSIGNMENT`, `SITE_ADDRESS`, `START_DATE`, `END_DATE`, `ROLE`

### Query: getApplicationsByStaff

Get applications assigned to a staff member.

```graphql
query GetApplicationsByStaff(
  $page: Int!
  $pageSize: Int!
  $personId: Int!
  $roleId: Int
) {
  getApplicationsByStaff(
    page: $page
    pageSize: $pageSize
    personId: $personId
    roleId: $roleId
  ) {
    message
    success
    count
    data {
      id
      applicationId
      roleId
      roleDescription
      siteAddress
      effectiveStartDate
      effectiveEndDate
    }
  }
}
```

**Variables:**
```json
{
  "page": 1,
  "pageSize": 10,
  "personId": 123,
  "roleId": 2
}
```


### Query: getStaffAssignedByAppId

Get staff assigned to an application.

```graphql
query GetStaffAssigned($applicationId: Int!) {
  getStaffAssignedByAppId(applicationId: $applicationId) {
    message
    httpStatusCode
    success
    data {
      applicationServiceTypeId
      staffList {
        id
        applicationId
        personId
        roleId
        startDate
        endDate
        currentCapacity
      }
    }
  }
}
```

**Variables:**
```json
{
  "applicationId": 123
}
```

### Query: getAllActiveStaffMembers

Get all active staff members.

```graphql
query {
  getAllActiveStaffMembers {
    message
    httpStatusCode
    success
    data {
      personId
      personFullName
      currentCapacity
    }
  }
}
```

### Query: getAllActiveStaffMembersForApplicationServiceType

Get active staff for a specific service type.

```graphql
query GetStaffForServiceType($applicationServiceTypeId: Int!) {
  getAllActiveStaffMembersForApplicationServiceType(
    applicationServiceTypeId: $applicationServiceTypeId
  ) {
    message
    success
    data {
      personId
      personFullName
      currentCapacity
    }
  }
}
```

**Variables:**
```json
{
  "applicationServiceTypeId": 5
}
```

### Query: getApplicationServiceTypes

Get all application service types.

```graphql
query {
  getApplicationServiceTypes {
    message
    success
    data {
      key
      value
    }
  }
}
```


### Mutation: updateStaffAssigned

Update staff assignments for an application.

```graphql
mutation UpdateStaffAssigned(
  $staffInput: [UpdateStaffAssignedDto!]!
  $applicationServiceTypeId: Int!
  $applicationId: Int!
) {
  updateStaffAssigned(
    staffInput: $staffInput
    applicationServiceTypeId: $applicationServiceTypeId
    applicationId: $applicationId
  ) {
    message
    httpStatusCode
    success
  }
}
```

**Variables:**
```json
{
  "staffInput": [
    {
      "id": 0,
      "applicationId": 123,
      "personId": 456,
      "roleId": 2,
      "startDate": "2024-01-15T00:00:00Z",
      "endDate": null,
      "organizationId": 10,
      "action": "ADD"
    }
  ],
  "applicationServiceTypeId": 5,
  "applicationId": 123
}
```

**Action Options:** `ADD`, `UPDATE`, `DELETE`

---

## Timesheet Management

### Query: getTimesheetDaysForAssignedStaff

Get timesheet entries for staff assigned to an application.

```graphql
query GetTimesheets(
  $applicationId: Int!
  $startDate: String!
  $endDate: String!
) {
  getTimesheetDaysForAssignedStaff(
    applicationId: $applicationId
    startDate: $startDate
    endDate: $endDate
  ) {
    message
    httpStatusCode
    success
    data {
      personId
      firstName
      lastName
      email
      roleId
      roleDescription
      startDate
      endDate
      timesheetDays {
        id
        applicationId
        personId
        date
        hours
        comment
      }
    }
  }
}
```

**Variables:**
```json
{
  "applicationId": 123,
  "startDate": "2024-01-01",
  "endDate": "2024-01-31"
}
```


### Mutation: upsertTimesheetDays

Create or update timesheet entries.

```graphql
mutation UpsertTimesheets($input: UpsertTimesheetDaysInputDto!) {
  upsertTimesheetDays(input: $input) {
    message
    httpStatusCode
    success
    data {
      id
      applicationId
      personId
      date
      hours
      comment
    }
  }
}
```

**Variables:**
```json
{
  "input": {
    "entries": [
      {
        "timesheetDayId": null,
        "applicationId": 123,
        "personId": 456,
        "date": "2024-01-15",
        "hours": 8.0,
        "comment": "Site inspection and documentation"
      },
      {
        "timesheetDayId": 789,
        "applicationId": 123,
        "personId": 456,
        "date": "2024-01-16",
        "hours": 6.5,
        "comment": "Report writing"
      }
    ]
  }
}
```

---

## Site Management

### Query: getSiteDetailsBySiteId

Get detailed information about a site.

```graphql
query GetSiteDetails($siteId: String!) {
  getSiteDetailsBySiteId(siteId: $siteId) {
    data {
      id
      longdeg
      latdeg
      addrLine_1
      addrLine_2
      city
      commonName
      siteRiskCode
      whenCreated
      whenUpdated
      associatedSites {
        associatedSite {
          id
          commonName
          addrLine_1
          city
        }
      }
    }
  }
}
```

**Variables:**
```json
{
  "siteId": "12345"
}
```


---

## Permissions

### Query: getPermissions

Get all permissions and roles.

```graphql
query {
  getPermissions {
    message
    httpStatusCode
    success
    data {
      roleId
      roleDescription
      permissions {
        id
        roleId
        description
      }
    }
  }
}
```

---

## Dashboard

### Query: getRecentViewedApplications

Get recently viewed applications for the current user.

```graphql
query {
  getRecentViewedApplications {
    message
    httpStatusCode
    success
    data {
      applicationId
      siteId
      address
      applicationType
      applicationStatus
      receivedDate
      priority
    }
  }
}
```

### Query: getApplications

Get applications for dashboard view.

```graphql
query {
  getApplications {
    message
    httpStatusCode
    success
    data {
      applicationId
      siteId
      address
      applicationType
      applicationStatus
      receivedDate
      priority
    }
  }
}
```

### Query: getAllStatusTypes

Get all status types.

```graphql
query {
  getAllStatusTypes {
    id
    abbrev
    description
  }
}
```


---

## COMS (File Management)

### Query: getObject

Get a file object from COMS.

```graphql
query GetObject($objectId: String!, $downloadType: DownloadType) {
  getObject(objectId: $objectId, downloadType: $downloadType) {
    message
    httpStatusCode
    success
    data {
      bucketId
      downloadUrl
    }
  }
}
```

**Variables:**
```json
{
  "objectId": "obj-123-456",
  "downloadType": "URL"
}
```

**Download Type Options:** `URL`, `PROXY`

### Mutation: createBucket

Create a new COMS bucket.

```graphql
mutation CreateBucket($bucketName: String!, $bucketKey: String!) {
  createBucket(bucketName: $bucketName, bucketKey: $bucketKey) {
    message
    httpStatusCode
    success
    data {
      bucketId
    }
  }
}
```

**Variables:**
```json
{
  "bucketName": "invoice-attachments",
  "bucketKey": "inv-bucket-2024"
}
```

### Mutation: deleteBucket

Delete a COMS bucket.

```graphql
mutation DeleteBucket($bucketId: String!) {
  deleteBucket(bucketId: $bucketId) {
    message
    httpStatusCode
    success
  }
}
```

**Variables:**
```json
{
  "bucketId": "bucket-123"
}
```

### Mutation: deleteObject

Delete a file object from COMS.

```graphql
mutation DeleteObject($objectId: String!, $versionId: String) {
  deleteObject(objectId: $objectId, versionId: $versionId) {
    message
    httpStatusCode
    success
  }
}
```

**Variables:**
```json
{
  "objectId": "obj-123-456",
  "versionId": "v1"
}
```


---

## Column Preferences

### Query: getUserColumnPreferences

Get user's column preferences for a specific page.

```graphql
query GetColumnPreferences($page: String!) {
  getUserColumnPreferences(page: $page) {
    message
    httpStatusCode
    success
    data {
      userId
      page
      createdAt
      updatedAt
      columns {
        id
        displayName
        active
        sortOrder
        selectionOrder
      }
    }
  }
}
```

**Variables:**
```json
{
  "page": "applications"
}
```

### Mutation: saveUserColumnPreferences

Save user's column preferences.

```graphql
mutation SaveColumnPreferences($columnPreferences: SaveColumnPreferencesDto!) {
  saveUserColumnPreferences(columnPreferences: $columnPreferences) {
    message
    httpStatusCode
    success
    data {
      userId
      page
      columns {
        id
        displayName
        active
        sortOrder
      }
    }
  }
}
```

**Variables:**
```json
{
  "columnPreferences": {
    "page": "applications",
    "columns": [
      {
        "id": 1,
        "displayName": "Application ID",
        "active": true,
        "sortOrder": 1,
        "selectionOrder": 1
      },
      {
        "id": 2,
        "displayName": "Site Address",
        "active": true,
        "sortOrder": 2,
        "selectionOrder": 2
      },
      {
        "id": 3,
        "displayName": "Status",
        "active": false,
        "sortOrder": 3,
        "selectionOrder": null
      }
    ]
  }
}
```

---

## Authentication

All queries and mutations require JWT authentication. Add your token in the HTTP Headers:

```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN_HERE"
}
```

## Tips for Using GraphQL Playground

1. **Auto-completion**: Press `Ctrl+Space` to see available fields
2. **Documentation**: Click "DOCS" or "SCHEMA" on the right to browse the schema
3. **Format Query**: Press `Ctrl+Shift+F` to format your query
4. **Execute**: Press `Ctrl+Enter` to run the query
5. **Multiple Operations**: Use operation names to run specific queries

## Common Patterns

### Pagination
Most list queries support pagination:
```graphql
{
  page: 1,
  pageSize: 20
}
```

### Filtering
Use filter enums where available:
- `ALL`, `UNASSIGNED`, `COMPLETED`, `ASSIGNED`, `MY_ASSIGNED`

### Sorting
Specify sort field and direction:
```graphql
{
  sortBy: "ID",
  sortByDir: "DESC"
}
```

### Error Handling
Check the response structure:
```graphql
{
  message: "Error message",
  httpStatusCode: 400,
  success: false
}
```
