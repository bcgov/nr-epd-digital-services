# CATS TanStack Query Conventions

TanStack Query is the default data-fetching mechanism for new CATS REST and GraphQL
API calls. Existing Apollo-generated hooks and person-detail custom hooks were not
migrated by the Manage People delivery.

---

## Architecture

### Query client

- Module: `cats-frontend/src/app/query/queryClient.ts`
- Single shared `QueryClient` provided at the application root via `QueryClientProvider`
  in `cats-frontend/src/index.tsx`
- Defaults:
  - Queries: `refetchOnWindowFocus: false` (a People search must not silently re-run when
    the tab regains focus)
  - Mutations: `retry: false`
  - Query retry: TanStack Query defaults (not overridden on the client)
- React Query Devtools are **not** included

Redux remains only for the unrelated `commonData` slice. Do not put server-cache or
request-lifecycle state back into Redux for new workflows.

### Feature colocation

```
cats-frontend/src/app/
  query/queryClient.ts        ← single configured client
  helpers/useDebouncedValue.ts
  features/<feature>/
    api/                      ← typed transport boundary
    hooks/                    ← useQuery / useMutation + query keys
    *.graphql                 ← schema documents for codegen
```

- Typed API modules and query/mutation hooks live **next to the feature**, not under a
  global `queries/` or `api/` tree.
- GraphQL operations are authored as `.graphql` documents and compiled by the existing
  codegen setup. Hooks and the API module consume generated documents and types.
  Unused generated Apollo-style hooks from the codegen preset are tolerated for now.
- Reference implementation: Manage People (`features/people/`).

---

## Query keys and URL-driven criteria

Prefer URL search parameters as the source of truth for shareable list/search criteria
(term, page, page size, filters), mirroring the Applications search feature and Manage
People.

| Concern | Convention |
|---------|------------|
| Criteria storage | Router search params (`useSearchParams`) |
| Query key | Stable factory colocated with the hook (e.g. `peopleSearchKeys`) |
| Key contents | Include the full criteria object so changing any control refetches |
| Enablement | Gate with `enabled` (e.g. non-empty trimmed search term) |
| Empty input | Disabled query + no stale “current” fetch; clearing the term clears results |

**Manage People URL params:** `search`, `page`, `pageSize`, `searchMode`, `activeFilter`.

**Rules**

- Parse URL → criteria in one place (e.g. `parsePeopleSearchCriteria`).
- Keep local input state only for responsive typing; write the **debounced** value to the
  URL.
- Components must not orchestrate refetch sequences through status-dependent `useEffect`
  chains; invalidate from mutation callbacks instead.

---

## Debounce and concurrency

| Behavior | How to get it | Use when |
|----------|---------------|----------|
| **Debounce before fetch** | Debounce the value **before** writing it to the URL (~300 ms via `useDebouncedValue`) | Typeahead / search boxes |
| **Latest-only** | Query key changes with criteria; TanStack cancels the previous query and starts a new one | Rapid successive searches |
| **Leading-only (mutations)** | Disable controls while `isPending`; do not auto-retry | Activate / deactivate / delete and other submits |
| **Keep prior results** | `placeholderData: keepPreviousData` (or equivalent) while refetching / on transient failure | Tables that should not blank on error or page change |

**Manage People today**

- Search: debounce term → URL, then `useQuery` keyed on URL criteria (`enabled` when term
  present), `keepPreviousData`
- Bulk update: `useMutation` with controls disabled while pending; no automatic retry

---

## Typed API boundary

Put Axios / GraphQL transport behind a feature API module (e.g. `PeopleApi.ts`).

The public API should:

1. Accept typed domain inputs (criteria, update payloads) and an optional `AbortSignal`.
2. Submit codegen GraphQL documents (or REST) via the shared Axios instance (auth headers
   and request identifiers stay centralized).
3. Validate transport and GraphQL-level outcomes.
4. Return typed domain results **or** throw a domain error with a safe message.
5. Never expose raw Axios / GraphQL error objects to hooks, toasts, or the UI.

Runtime transport is Axios, not Apollo Client, even when documents come from the
GraphQL codegen pipeline.

### Safe error normalization

- Define a constant safe message per workflow (search vs update).
- Throw a domain error class (e.g. `PeopleApiError`) with that message.
- Treat GraphQL `errors[]` and missing payloads as failures.
- For mutations that return a business `success` flag, treat `success !== true` as
  failure even when HTTP status is 200.
- Re-throw cancellation (`CanceledError` / aborted signal) so TanStack can treat it as
  cancel, not as a user-facing failure.
- Hooks and toasts must use the safe constants — never `error.message` from Axios or
  GraphQL.

---

## Cancellation

TanStack Query cancellation alone does not stop Axios unless the signal is forwarded.

For queries:

1. Accept `{ signal }` from `queryFn`.
2. Pass `signal` into the typed API operation.
3. The API must pass it to Axios (`{ signal }` on the request config).

When criteria (and thus the query key) change, TanStack aborts the previous query; the
API layer must honor that abort at the HTTP layer.

Mutations should accept an optional signal on the API operation for consistency even when
the current UI does not cancel in-flight updates.

---

## Retry policy

### Queries

Use the TanStack Query default retry behavior on the shared client unless a workflow
documents an explicit override.

Do **not** invent a parallel Redux-Saga-style classification table in application code
unless a specific workflow needs stricter control. Domain failures thrown as safe API
errors after GraphQL `errors[]` / missing payload are still subject to the client retry
defaults; prefer keeping user-facing toasts tied to settled error state (as Manage People
search does via `isError` / `errorUpdatedAt`).

### Mutations

Never retry mutations automatically. Configure `retry: false` on the mutation (and on
the shared client defaults). A mutation may have completed even when the response is
ambiguous. Users may deliberately retry after a safe failure toast; the application must
not.

---

## Loading, errors, and notifications

| Concern | Convention |
|---------|------------|
| Loading (queries) | Derive UI loading from query state (`isFetching` / `isPending` as appropriate); pass into presentational components as props when they must stay Redux-free |
| Loading (mutations) | Disable controls while `isPending` |
| Success (mutations) | `notifySuccess` after successful invalidation/refetch orchestration |
| Failure | `notifyError(safeMessage, …)` using API safe constants |
| Prior results | Prefer keeping previous data visible on failure (`keepPreviousData`) |
| Raw errors | Stay inside the API module; never in toast text |

Use existing toast helpers: `notifySuccess` / `notifyError` from `components/alert/Alert`.

---

## Post-mutation cache updates

On mutation **success**:

1. Invalidate the related query key root (e.g. `peopleSearchKeys.all`).
2. Await invalidation/refetch so the UI settles on fresh data.
3. Show the success toast once.

On mutation **failure**:

- Show the safe failure toast.
- Do **not** invalidate or refetch — a refresh must never imply the change succeeded.

Do not drive post-update refresh from component `useEffect` keyed on mutation status.

---

## Serializable payloads

Values that cross the transport boundary must be well-formed and serializable:

- Timestamps as ISO strings, not `Date` instances
- Mutation inputs matching codegen variable types

---

## Adding a new TanStack Query workflow (checklist)

1. Author the GraphQL operation (or REST contract) and generate typed documents/types.
2. Add a typed API operation with safe domain errors and `AbortSignal` forwarding.
3. Define a query-key factory (and URL parse/write helpers if the criteria are shareable).
4. Add a `useQuery` and/or `useMutation` hook colocated with the feature.
5. Wire UI to the hook: loading/disabled from query/mutation state; no Redux for server
   cache.
6. For mutations: `retry: false`, success invalidation, safe toasts.
7. Add API tests (no React), hook tests (query client + router helper), and update
   affected component tests.

---

## Testing guidance

Reuse Vitest and Testing Library. Mock the feature API module directly — do not add a
network-mocking library for these workflows.

Use the shared helpers in `utilities/test/QueryTestUtils.tsx`:

- `createTestQueryClient()` — retries disabled for deterministic tests
- `createQueryRouterWrapper` / `renderWithQueryRouter` / `renderHookWithQueryRouter` —
  fresh query client + `MemoryRouter` for URL search params

Assert **externally observable** behavior:

- API call contracts (variables, extraction, abort signal, call counts)
- Enablement gating, cancellation, cache invalidation/refetch
- Notifications and disabled/loading UI
- Safe domain errors (including mutation `success !== true` on HTTP 200)

Avoid coupling tests to incidental TanStack internals or effect ordering.

| Layer | What to cover | Reference |
|-------|---------------|-----------|
| API | Variables, extraction, GraphQL errors, mutation `success`, safe errors, `AbortSignal` | `PeopleApi.test.ts` |
| Search hook | Enablement on empty term, success data, cancellation | `usePeopleSearch.test.ts` |
| Update hook | Single post-success invalidation, toasts, no automatic retry | `usePeopleUpdate.test.ts` |
| Components | Debounced search → results; controls disabled while updating | `Search.test.tsx`, `SearchResultsActions.test.tsx` |

---

## Implemented vs future work

### Implemented

- Shared query client at the app root (`refetchOnWindowFocus: false`, mutation `retry: false`)
- Typed People API (search + bulk update) over Axios + codegen documents
- URL-driven People search with debounce-before-URL, enablement gating, AbortSignal
  cancellation, and `keepPreviousData`
- Bulk-update mutation with disabled-while-pending controls, success/failure toasts, and
  one post-success search invalidation/refetch
- People Redux slice removed; Redux retains only `commonData`
- API, hook, and Manage People component tests with shared query/router helpers

### Not implemented (follow-ups)

- Migrating Apollo-generated application workflows to TanStack Query
- Migrating person-detail services and custom hooks to TanStack Query
- Replacing Apollo’s normalized cache architecture wholesale
- Backend GraphQL support for Manage People advanced filters (see below)
- Folding persisted filter pills (local storage) into the URL

---

## Known limitation: Manage People advanced filters

The Manage People UI still collects advanced filter values (including date ranges) and
persists filter pills in local storage for UI state.

The active `searchPerson` GraphQL operation does not accept those filter inputs. They are
**not** sent by `PeopleApi.searchPeople`.

---

## Migration roadmap: Apollo and custom hooks

> This section inventories candidates. It does not mean those workflows were migrated.
> Each migration must plan an explicit replacement for Apollo capabilities listed below.

### Capabilities that need a replacement strategy

Before moving a workflow off Apollo, decide how TanStack Query (plus URL or local UI
state) will replace:

| Apollo capability | Why it matters | Replacement questions |
|-------------------|----------------|----------------------|
| **Normalized cache** | Shared entities update across screens | Query-key design and invalidation breadth? Entity cache vs list keys only? |
| **Generated types / hooks** | Codegen from `.graphql` | Keep codegen for documents/types (People pattern) vs Apollo runtime hooks? |
| **Request deduplication** | Identical in-flight queries coalesce | Rely on TanStack’s identical-key dedupe; align keys deliberately |
| **Refetch / `refetchQueries`** | Post-mutation consistency | `invalidateQueries` / `setQueryData` (as People update → search) |
| **`fetchPolicy` (`cache-and-network`, `network-only`)** | Stale-while-revalidate vs always network | `staleTime`, `gcTime`, `placeholderData`, explicit `refetch` |
| **Component loading / error** | Hooks expose `loading` / `error` | Map to `isPending` / `isFetching` / `isError` + safe toasts |

Mechanical “swap Apollo hook for `useQuery`” without answering these will regress UX.

### Inventory (migration candidates)

#### Already on TanStack Query

- Manage People search
- Manage People bulk activate / deactivate / delete

#### Hand-written Axios + hooks (natural early TanStack candidates)

| Area | Location | Notes |
|------|----------|-------|
| Person detail | `features/people/person/services/PersonService.ts`, hooks, `Person.tsx` | Axios GraphQL; local loading/error; `Person.tsx` often calls service directly |
| Person notes | `NoteService.ts`, note hooks | Same pattern as person detail |
| Person create | `useCreatePerson` → PersonService | |
| Person permissions | Apollo `PersonPermissions.graphql` | Still Apollo (`cache-and-network`) |

#### Apollo-generated GraphQL (by feature)

| Feature | Typical patterns | Migration notes |
|---------|------------------|-----------------|
| Application search | `network-only`, pagination/filters, refetch | Closest UX cousin to People search (URL criteria) |
| Application header / FormIO shell | Query + chained FormIO REST | Split GraphQL vs third-party REST concerns |
| Application details + site | `skip`, dependent queries | `enabled` + keyed dependents; explicit invalidation |
| Assignment / staff | Parallel queries, `refetch` after save, `refetchQueries` from Details | Strong cache-invalidation story required |
| Participants | List + CRUD + typeahead `skip` | Debounce candidates for name/org search |
| Application notes | Query + mutations → `refetch` / `onCompleted` | Mirror post-mutation invalidation pattern |
| Housing | List + mutations → refetch; related-app search | |
| Timesheets | `cache-and-network`; clear edits on refetch | |
| Invoices | Largest surface; `cache-and-network`; `refetchQueries`; Axios email/upload | Hybrid GraphQL + REST |
| Dashboard | `cache-and-network` list queries | |
| Staff directory | Queries gated with `skip` until modal open | Map `skip` → `enabled` |
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
| Query client | `cats-frontend/src/app/query/queryClient.ts` |
| App providers | `cats-frontend/src/index.tsx` |
| Redux store (common data only) | `cats-frontend/src/app/Store.ts` |
| People API | `cats-frontend/src/app/features/people/api/PeopleApi.ts` |
| Search hook + keys/parser | `cats-frontend/src/app/features/people/hooks/usePeopleSearch.ts` |
| Update hook | `cats-frontend/src/app/features/people/hooks/usePeopleUpdate.ts` |
| Debounce helper | `cats-frontend/src/app/helpers/useDebouncedValue.ts` |
| Manage People UI | `cats-frontend/src/app/features/people/Search.tsx` |
| Bulk actions UI | `cats-frontend/src/app/features/people/searchResults/SearchResultsActions.tsx` |
| Test helpers | `cats-frontend/src/utilities/test/QueryTestUtils.tsx` |
| Apollo client (legacy) | `cats-frontend/src/apollo.ts` |
| Migration PRD / issues | `docs/cats-people-tanstack-query/` |
