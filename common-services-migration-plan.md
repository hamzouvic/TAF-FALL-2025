# Common Services Migration Plan (Step 1)

## Goal
Group shared platform services in a single location to support cleaner monorepo structure.

## New directory layout
Moved:
- `auth` -> `services/common/auth`
- `gateway` -> `services/common/gateway`
- `registry` -> `services/common/registry`
- `user` -> `services/common/user`

## Updated integrations
- `docker-compose-local-test.yml` build contexts now point to `./services/common/*` for these services.
- GitHub Actions lint workflows now execute Gradle checkstyle from `services/common/*` working directories.

## Validation checklist
1. Compose file parses correctly.
2. Workflow YAML files parse correctly.
3. Each migrated service still contains its Gradle wrapper.

## Next steps
1. Move shared deployment scripts and docs under `services/common/` or `infra/`.
2. Add path-based CI matrix for `services/common/*`.
3. Migrate team-specific backend services into `services/testing/*` with the same pattern.
