# Frontend Migration Plan (Step 3)

## Goal
Merge the useful functionality from team-specific frontends into the canonical app at `apps/frontend`.

## What was merged in this step
### From `selenium-test-Service/frontend`
- `edit-test-dialog` for structured test editing.
- `json-editor` reusable component.
- `results` pages for browsing performance/selenium execution results.

### From `testapi-Service/frontend`
- `gatling` and `jmeter` standalone pages.
- `error-dialog.component.ts` for API error feedback.

### From `code-equipe5/frontend`
- Admin dashboard support files staged into the canonical app:
  - `board-admin.service.ts`
  - `case-detail-dialog.component.*`
  - `dashboard.model.ts`
  - `report.service.ts`
  - `report.ts`

## Canonical app updates
- Added routes for `/results`, `/gatling`, and `/jmeter`.
- Added navbar entries for the merged pages.
- Added component declarations in `AppModule` for merged UI pieces.
- Extended `TestApiService` and `PerformanceTestApiService` with helper methods needed by the imported legacy dialogs/results views.

## Next steps
1. Replace remaining legacy frontend folders with thin wrappers or remove them entirely.
2. Integrate the advanced admin dashboard UI into the canonical `BoardAdminComponent`.
3. Add frontend lint/build/test jobs that target only `apps/frontend`.
