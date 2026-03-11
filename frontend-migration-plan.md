# Frontend Migration Plan (Step 2)

## Goal
Move from team-specific frontend folders to a cleaner, product-oriented structure.

## New directory layout (this step)
- Canonical frontend moved from:
  - `test-performance-Service/frontend`
- To:
  - `apps/frontend`

## Runtime impact
- `docker-compose-local-test.yml` now builds:
  - `frontend` from `./apps/frontend`
  - `frontend-team3` from `./apps/frontend` (temporary compatibility)
- `frontend-team1` and `frontend-team2` still build from their original team folders for now.

## How to validate

### Compose config syntax
```bash
docker compose -f docker-compose-local-test.yml config
```

### Build canonical frontend image
```bash
docker compose -f docker-compose-local-test.yml build frontend
```

## Next steps
1. Move `selenium-test-Service/frontend` to `legacy/frontends/team1`.
2. Move `testapi-Service/frontend` to `legacy/frontends/team2`.
3. Remove team frontend services after parity checks and keep only `frontend`.
