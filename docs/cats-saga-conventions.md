# CATS Redux Saga Conventions

Saga is the default side-effect mechanism for **new** CATS REST and GraphQL API calls. Existing Apollo-generated hooks and person-detail custom hooks were not migrated.

---

## Architecture

### Store

- Factory: `cats-frontend/src/app/Store.ts` (`createAppStore`)
- Registers only Redux Saga middleware (`thunk: false`)
- Restores Redux Toolkit’s default serializability check
- Starts the centralized root saga on store creation

### Root saga and feature colocation

```
cats-frontend/src/app/
  rootSaga.ts                 ← single composition point
  Store.ts
  features/<feature>/
    api/                      ← typed transport boundary
    dto/                      ← actions, reducers, types, selectors
    saga/                     ← watchers + workers
```

- Feature watchers and workers live **next to the feature**, not under a global `sagas/` tree.
- `rootSaga` forks each feature watcher with `all([fork(...)])`.
- Reference implementation: Manage People (`features/people/`).

---

## Lifecycle actions

Use typed Redux Toolkit slice actions with a consistent naming pattern:

| Stage | Name pattern | Responsibility |
|-------|--------------|----------------|
| Request | `<verb><Entity>Requested` | Record inputs needed later (e.g. search criteria), set loading, clear prior safe errors |
| Success | `<verb><Entity>Succeeded` | Store domain results / set success status |
| Failure | `<verb><Entity>Failed` | Set failed status and a safe user-facing message only |

Examples already in use:

- `searchPeopleRequested` / `searchPeopleSucceeded` / `searchPeopleFailed`
- `updatePeopleRequested` / `updatePeopleSucceeded` / `updatePeopleFailed`

**Rules**

- Action payloads and Redux state must be serializable (ISO strings for timestamps, not `Date` instances).
- Components dispatch request actions and render loading / disabled / results from selectors.
- Components must not orchestrate API sequences through status-dependent `useEffect` chains.

---

## Typed API boundary

Put Axios / GraphQL transport behind a feature API module (e.g. `PeopleApi.ts`).

The public API should:

1. Accept typed domain inputs (criteria, update payloads).
2. Submit GraphQL documents (or REST) via Axios.
3. Validate transport and GraphQL-level outcomes.
4. Return typed domain results **or** throw a domain error with a safe message.
5. Never expose raw Axios / GraphQL error objects to Redux or toasts.

### Safe error normalization

- Define a constant safe message per workflow (search vs update).
- Throw a domain error class (e.g. `PeopleSearchApiError`, `PeopleUpdateApiError`).
- For queries that may retry, include a `retryable` flag derived from transport classification — **not** from raw server text.
- For mutations, do **not** mark errors retryable; workers never auto-retry mutations.
- Treat GraphQL `errors[]` and missing payloads as permanent failures.
- For mutations that return a business `success` flag, treat `success !== true` as failure even when HTTP status is 200.

---

## Watcher selection

Choose the watcher helper intentionally. Do not default to `takeEvery`.

| Behavior | Effect helper | Use when |
|----------|---------------|----------|
| **Latest-only** | `takeLatest` | Rapid successive requests; only the newest result should win (search, typeahead) |
| **Debounce** | `takeLatest` + `delay` at worker start | Same as latest-only, but wait for a quiet period before calling the API |
| **Leading-only** | `takeLeading` | Mutations / submits where a second click while in-flight must be ignored |
| **Sequential** | `takeEvery` + explicit queueing, or process one-by-one in a worker | Ordered work that must not overlap and must not drop requests (rare; prefer `takeLeading` for “ignore duplicates”) |

**Manage People today**

- Search: `takeLatest` + 300 ms `delay` (debounce + latest-only)
- Bulk update: `takeLeading` (leading-only; no automatic retry)

---

## Cancellation

Saga cancellation alone does not stop Axios.

For cancellable workers (especially `takeLatest` search):

1. Create an `AbortController` in the worker.
2. Pass `controller.signal` into the typed API / Axios call.
3. In `finally`, if `yield cancelled()`, call `controller.abort()`.

The typed API must forward the signal to Axios so superseded requests are aborted at the HTTP layer.

---

## Retry policy

### Queries (People search)

| Classification | Retry? |
|----------------|--------|
| Network / no HTTP response | Yes (transient) |
| HTTP 408, 429, 5xx | Yes (transient) |
| Other HTTP statuses | No |
| GraphQL validation / `errors[]` / missing payload | No |

**Limits (search)**

- Max retries after the initial attempt: **2** (3 attempts total)
- Backoff: `200ms * 2^attemptIndex` between attempts
- Constants live next to the worker (`PEOPLE_SEARCH_*` in `PeopleSaga.ts`)

### Mutations

**Never retry mutations automatically.** A mutation may have completed even when the response is ambiguous. Users may deliberately retry after a safe failure toast; the application must not.

---

## Loading, errors, and notifications

| Concern | Convention |
|---------|------------|
| Loading | Request action sets status (`RequestStatus.loading`); UI reads selectors (table loading, disabled mutation controls) |
| Success | Success action; optional `notifySuccess` for mutations |
| Failure | Failure action with safe message; `notifyError(safeMessage)` |
| Raw errors | Stay inside the API module / worker catch; never in Redux or toast text |

Use existing toast helpers: `notifySuccess` / `notifyError` from `components/alert/Alert`.

---

## Adding a new Saga workflow (checklist)

1. Add typed inputs/results/failure DTOs under the feature `dto/`.
2. Add a typed API operation with safe domain errors.
3. Add `*Requested` / `*Succeeded` / `*Failed` reducers and selectors.
4. Implement worker + watcher with an explicit concurrency policy.
5. `fork` the watcher from `rootSaga`.
6. Dispatch request actions from UI; disable or load from Redux status.
7. Add API, reducer, Saga (`runSaga`), and affected component tests.

---

## Testing guidance

Use native Redux Saga APIs (`runSaga`, `stdChannel`). Do not add a saga-specific test library.

Assert **externally observable** behavior:

- Dispatched lifecycle actions and resulting Redux state
- API call contracts (variables, abort signal, call counts)
- Cancellation / abort, retries and backoff, notifications
- Post-success orchestration (e.g. one search refresh after update)

Avoid coupling tests to incidental generator step order.

| Layer | What to cover | Reference |
|-------|---------------|-----------|
| API | Variables, extraction, GraphQL errors, mutation `success`, safe errors, `AbortSignal` | `PeopleApi.test.ts` |
| Reducer | Request clears errors + loading; success/failure transitions; criteria retention | `PeopleSlice.test.ts` |
| Saga | Debounce/latest-only, abort, retry, leading-only, no mutation retry, toasts, refresh | `PeopleSaga.test.ts` |
| Store | Root saga starts; request reaches success; thunk dispatch rejected | `Store.test.ts` |
| Components | Dispatch typed requests; loading/disabled controls | `Search.test.tsx`, `SearchResultsActions.test.tsx` |

---

## Implemented vs future work

### Implemented

- Root saga + feature-colocated People watchers/workers
- Typed People search and bulk-update API + lifecycle actions
- Debounced latest-only search with AbortSignal cancellation and transient retry
- Leading-only bulk updates with success/failure toasts and one post-success search refresh
- Thunk middleware removed, serializability check restored
- Native Saga / reducer / store / component tests for the above

### Not implemented (follow-ups)

- Migrating Apollo-generated application workflows to Saga
- Migrating person-detail services and custom hooks to Saga
- Replacing Apollo’s normalized cache architecture wholesale
- Backend GraphQL support for Manage People advanced filters (see below)

---

## Known limitation: Manage People advanced filters

The Manage People UI still collects advanced filter values (including date ranges) and may record them on `PeopleSearchCriteria.filter` for UI/pill state.

The active `searchPerson` GraphQL operation does not accept those filter inputs. They are **not** sent by `PeopleApi.searchPeople`.

---

## Migration roadmap: Apollo and custom hooks

> This section inventories candidates. It does not mean those workflows were migrated. Each migration must plan an explicit replacement for Apollo capabilities listed below.

### Capabilities that need a replacement strategy

Before moving a workflow off Apollo, decide how Saga (and Redux or another store) will replace:

| Apollo capability | Why it matters | Replacement questions |
|-------------------|----------------|----------------------|
| **Normalized cache** | Shared entities update across screens | Where does canonical data live? How are dependents invalidated? |
| **Generated types / hooks** | Codegen from `.graphql` | Keep codegen for documents/types? Hand-typed DTO boundary like People? |
| **Request deduplication** | Identical in-flight queries coalesce | Use latest-only watchers, skip duplicate dispatches, or accept parallel calls? |
| **Refetch / `refetchQueries`** | Post-mutation consistency | Dispatch explicit refresh request actions (as People update → search) |
| **`fetchPolicy` (`cache-and-network`, `network-only`)** | Stale-while-revalidate vs always network | Encode policy in watcher/worker + Redux status |
| **Component loading / error** | Hooks expose `loading` / `error` | Map to request/success/failure selectors + safe toasts |

Mechanical “swap hook for saga” without answering these will regress UX.

### Inventory (migration candidates)

#### Already on Saga

- Manage People search
- Manage People bulk activate / deactivate / delete

#### Hand-written Axios + hooks (natural early Saga candidates)

| Area | Location | Notes |
|------|----------|-------|
| Person detail | `features/people/person/services/PersonService.ts`, hooks, `Person.tsx` | Axios GraphQL; local loading/error; `Person.tsx` often calls service directly |
| Person notes | `NoteService.ts`, note hooks | Same pattern as person detail |
| Person permissions | Apollo `PersonPermissions.graphql` | Still Apollo (`cache-and-network`) |

#### Apollo-generated GraphQL (by feature)

| Feature | Typical patterns | Migration notes |
|---------|------------------|-----------------|
| Application search | `network-only`, pagination/filters, refetch | Closest UX cousin to People search |
| Application header / FormIO shell | Query + chained FormIO REST | Split GraphQL vs third-party REST concerns |
| Application details + site | `skip`, dependent queries | Explicit sequencing in workers |
| Assignment / staff | Parallel queries, `refetch` after save, `refetchQueries` from Details | Strong cache-invalidation story required |
| Participants | List + CRUD + typeahead `skip` | Debounce candidates for name/org search |
| Application notes | Query + mutations → `refetch` / `onCompleted` | Mirror post-mutation refresh pattern |
| Housing | List + mutations → refetch; related-app search | |
| Timesheets | `cache-and-network`; clear edits on refetch | |
| Invoices | Largest surface; `cache-and-network`; `refetchQueries`; Axios email/upload | Hybrid GraphQL + REST |
| Dashboard | `cache-and-network` list queries | |
| Staff directory | Queries gated with `skip` until modal open | |
| Column preferences | Shared get/save; refetch after save | Cross-cuts search UIs |

#### REST / non-GraphQL outliers

| Area | Notes |
|------|-------|
| Associated files (BC Box) | Axios in component effects |
| Invoice send / upload | `cats.service.ts` multipart / email |
| FormIO / FormsFlow | Axios from application tab |
| Geocoder | Helper used by Person UI |

---

## Quick reference paths

| Concern | Path |
|---------|------|
| Store factory | `cats-frontend/src/app/Store.ts` |
| Root saga | `cats-frontend/src/app/rootSaga.ts` |
| People saga | `cats-frontend/src/app/features/people/saga/PeopleSaga.ts` |
| People API | `cats-frontend/src/app/features/people/api/PeopleApi.ts` |
| People slice | `cats-frontend/src/app/features/people/dto/PeopleSlice.ts` |
