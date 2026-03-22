# Frontend Merge Audit

## Compared frontend sources
- `apps/frontend`
- `test-performance-Service/frontend`
- `code-equipe5/frontend`
- `selenium-test-Service/frontend`
- `testapi-Service/frontend`

## Current merge status
- `test-performance-Service/frontend`: canonical baseline already fully reflected in `apps/frontend`.
- `code-equipe5/frontend`: unique files imported into `apps/frontend`.
- `selenium-test-Service/frontend`: remaining unique stylesheet imported for `delete-test-dialog`.
- `testapi-Service/frontend`: remaining unique `pom.xml` imported into `apps/frontend`.

## Notes
Some files still differ by content across the legacy frontends even when the file paths are the same. Those overlaps now require feature-by-feature reconciliation instead of simple file copying.

## Next reconciliation targets
1. `board-admin/*`
2. `performance-test-api/*`
3. `interface-test-api/test-api/*`
4. shared environment and package configuration files
