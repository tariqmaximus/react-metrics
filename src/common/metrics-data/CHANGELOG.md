# Changelog for metrics-data

All notable changes to this package will be documented in this file.

## [Unreleased] - 2026-05-18

### Added
- Vite build configuration (`lib/vite.config.js`) and library outputs (`dist/*`).
- Type declaration files: `index.d.ts` and `MetricsData.d.ts`.
- Dynamic `customFilter.fields` support in `FilterComponent` for advanced filters.
- CSS variable aliases to unify token usage across styles.
- README section documenting `customFilter.fields` schema and example.

### Changed
- Updated `lib/package.json` exports and publish config for `metrics-data`.

### Fixed
- Resolved mixed CSS token usage and improved theming variable coverage.
