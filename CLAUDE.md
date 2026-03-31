# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

metamac-portal is the ISTAC statistical data visualization portal. It provides REST APIs for exporting datasets (Excel,
TSV, CSV, PX, SVG/PNG/PDF) and a Backbone.js frontend for data visualization (tables, charts, maps). Part of the larger
Metamac/eDatos platform.

**Main branch for PRs**: `develop`

## Build Commands

### Full build (Java + frontend)

```bash
mvn clean install
```

### Build skipping tests

```bash
mvn clean install -Dmaven.test.skip=true
```

### Build only the backend (skip web-client)

```bash
mvn clean install -pl !metamac-portal-web-client
```

### Frontend only (from metamac-portal-web-client/)

```bash
# Install dependencies
npm install --ignore-scripts
# Production build
grunt build
# Development build (no CSS minification)
grunt dev
```

### Run frontend tests

```bash
# From metamac-portal-web-client/
grunt test
# BDD mode (opens browser with live reload)
grunt bdd
# Run specific test spec
grunt spec: <pattern>
```

### Run Java tests

```bash
# All tests
mvn test
# Single test class
mvn test -pl metamac-portal-core -Dtest=ExportServiceTest
# Single test method
mvn test -pl metamac-portal-core -Dtest=ExportServiceTest#testExportDatasetToTsv
```

### Dev server for frontend

```bash
# From metamac-portal-web-client/
grunt serve
```

## Architecture

### Module Structure

```
metamac-portal-parent/              → BOM, dependency versions (inherits metamac-parent)
metamac-portal-core/                → Domain model (Sculptor), services, exporters
metamac-portal-rest-common-api/     → Shared JAX-RS interface (DataExportV1_0)
metamac-portal-rest-common-impl/    → Shared REST logic (DataExportRestCommon)
metamac-portal-rest-external-api/   → External API interface (published data only)
metamac-portal-rest-external-impl/  → External API facade
metamac-portal-rest-internal-api/   → Internal API interface (includes draft data)
metamac-portal-rest-internal-impl/  → Internal API facade
metamac-portal-web-client/          → Frontend JS/LESS/Handlebars, built by Grunt, packaged as JAR
metamac-portal-web/                 → WAR that serves the frontend + exposes REST via CXF
metamac-portal-api-web/             → API WAR (Swagger UI, URL rewriting)
```

### Domain Model (Sculptor)

The domain model is defined in `metamac-portal-core/src/main/resources/btdesign/model-portal-core.btdesign`. Sculptor
generates entity JPA mappings, repository implementations, service base classes, and Spring XML configs into
`src/generated/`. Handwritten code extends generated base classes (e.g.,
`ExportServiceImpl extends ExportServiceImplBase`).

**After modifying the .btdesign file**, regenerate with:

```bash
mvn generate-sources -pl metamac-portal-core
```

### REST API Pattern (3-layer)

1. **API interface** (`*-api` modules): JAX-RS annotations (`@Path`, `@POST`, `@Consumes`)
2. **Common impl** (`DataExportRestCommon`): abstract class with export logic — fetches dataset from upstream API,
   builds `DatasetSelection`, calls `ExportService`, streams ZIP response
3. **Facade impl** (`DataExportRestExternalFacadeV10Impl` / `...InternalFacadeV10Impl`): Spring `@Service` beans, inject
   the appropriate upstream REST clients (external = published data, internal = draft data)

All export endpoints are versioned under `/v1.0` and accept both `APPLICATION_XML`/`APPLICATION_JSON` body and
`APPLICATION_FORM_URLENCODED` (`jsonBody` parameter) for HTML form POSTs.

### Frontend Stack

- **Backbone.js + Marionette** — views, routing, modules
- **Handlebars** — precompiled templates (compiled by Grunt into `HandlebarsTemplates.js`)
- **jQuery 1.9 + jQuery UI**
- **ECharts** — charting
- **LESS** → CSS (via `grunt-contrib-less`)
- **No module bundler** — files are concatenated in order via `grunt-contrib-concat` into a single `metamac.js`
- **Mocha** — JS test runner (via `grunt-mocha` with PhantomJS)
- **i18n**: 4 languages (es, en, pt, ca) in `src/main/js/metamac/translations/`

### Export Data Flow

```
Browser POST → CXF Servlet → REST Facade → DataExportRestCommon
  → fetches dataset from upstream StatisticalResources REST API
  → DatasetSelectionMapper builds filter
  → ExportService → PlainTextExporter / ExcelExporter / PxExporter / ImageExporter
  → temp file → ZIP → streamed Response
```

### Key Files

#### Domain Model & Configuration

| File | Purpose |
|---|---|
| `metamac-portal-core/src/main/resources/btdesign/model-portal-core.btdesign` | Sculptor DSL — defines entities, services, repositories |
| `metamac-portal-core/src/main/java/.../core/enume/PlainTextTypeEnum.java` | Enum for export formats (TSV, CSV_COMMA, CSV_SEMICOLON) |
| `metamac-portal-core/src/main/java/.../core/domain/DatasetSelection.java` | User's dimension/filter selection model |
| `metamac-portal-core/src/main/java/.../core/domain/ResourceAccess.java` | Wraps dataset/query + selection + language for export |
| `metamac-portal-core/src/main/java/.../core/conf/PortalConfiguration.java` | Runtime config interface (default language, thresholds) |
| `metamac-portal-core/src/main/java/.../core/conf/PortalConfigurationImpl.java` | Runtime config implementation |

#### Core Services & Exporters

| File | Purpose |
|---|---|
| `metamac-portal-core/src/main/java/.../core/serviceimpl/ExportServiceImpl.java` | Core export orchestration logic |
| `metamac-portal-core/src/main/java/.../core/serviceimpl/PermalinksServiceImpl.java` | Permalink CRUD service |
| `metamac-portal-core/src/main/java/.../core/serviceimpl/validators/ExportServiceInvocationValidatorImpl.java` | Input validation for export requests |
| `metamac-portal-core/src/main/java/.../core/exporters/PlainTextExporter.java` | TSV/CSV file writer |
| `metamac-portal-core/src/main/java/.../core/exporters/ExcelExporter.java` | XLSX export (Apache POI / SXSSFWorkbook) |
| `metamac-portal-core/src/main/java/.../core/exporters/PxExporter.java` | PC-Axis format export |
| `metamac-portal-core/src/main/java/.../core/exporters/ImageExporter.java` | SVG to PNG/PDF (Apache Batik/FOP) |

#### REST API Layer

| File | Purpose |
|---|---|
| `metamac-portal-rest-common-api/src/main/java/.../common/export/v1_0/service/DataExportV1_0.java` | Shared JAX-RS interface (all endpoints defined here) |
| `metamac-portal-rest-external-api/src/main/java/.../external/export/v1_0/service/DataExportV1_0.java` | External API interface (extends common) |
| `metamac-portal-rest-internal-api/src/main/java/.../internal/export/v1_0/service/DataExportV1_0.java` | Internal API interface (extends common) |
| `metamac-portal-rest-common-impl/src/main/java/.../common/export/v1_0/DataExportRestCommon.java` | Abstract base with all export logic |
| `metamac-portal-rest-common-impl/src/main/java/.../common/export/v1_0/mapper/DatasetSelectionMapper.java` | Maps user selection to API filter parameters |
| `metamac-portal-rest-external-impl/src/main/java/.../external/export/v1_0/service/DataExportRestExternalFacadeV10Impl.java` | External facade (published data) |
| `metamac-portal-rest-internal-impl/src/main/java/.../internal/export/v1_0/service/DataExportRestInternalFacadeV10Impl.java` | Internal facade (draft + published data) |

#### Frontend (metamac-portal-web-client/)

| File | Purpose |
|---|---|
| `Gruntfile.coffee` | Build pipeline (build, dev, test, serve tasks) |
| `src/main/js/metamac/modules/dataset/DatasetDownloadView.js` | Download UI — triggers exports, handles blob responses |
| `src/main/js/metamac/modules/dataset/DatasetView.js` | Main dataset page view |
| `src/main/js/metamac/modules/dataset/DatasetVisualizationView.js` | Visualization container (table/chart/map) |
| `src/main/js/metamac/components/modal/ExportOptionsModalView.js` | Export options modal (decimal separator, attributes) |
| `src/main/js/metamac/translations/es.js` | Spanish i18n (primary language) |
| `src/main/js/metamac/translations/en.js` | English i18n |
| `src/main/preview.html` | Local preview/dev entry point |

#### Web & Deployment

| File | Purpose |
|---|---|
| `metamac-portal-web/src/main/webapp/WEB-INF/web.xml` | Servlet descriptor |
| `metamac-portal-web/src/main/webapp/WEB-INF/config/spring/applicationContext.xml` | Spring context (imports core) |
| `metamac-portal-api-web/src/main/webapp/WEB-INF/urlrewrite.xml` | URL rewrite rules for API routing |

#### Tests

| File | Purpose |
|---|---|
| `metamac-portal-core/src/test/java/.../core/serviceapi/ExportServiceTest.java` | Main export service test suite |

## Testing

- **Java**: JUnit 4 + Spring + Mockito. Tests use `@TransactionConfiguration(defaultRollback=true)`. HSQLDB in-memory
  for unit tests; PostgreSQL for integration. Sculptor generates test base interfaces (`ExportServiceTestBase`).
- **JavaScript**: Mocha via PhantomJS. Test runner at `src/test/javascript/runner/runner.html`.

## CI/CD

GitLab CI (`.gitlab-ci.yml`). JDK 8, Maven 3.5. Stages: build → release → demo → pre → pro. Produces two WAR artifacts:
`metamac-portal-web` and `metamac-portal-api-web`.

## Conventions

- The `develop` branch is the main integration branch; `master` is for releases
- REST API interfaces must be kept in sync across common/external/internal API modules — a new endpoint must be added to
  all three
- When adding a new `PlainTextTypeEnum` value, update: btdesign → ExportService interface → ExportServiceImpl → REST API
  interfaces → DataExportRestCommon → frontend DatasetDownloadView.js → translations

### Code Naming

- **All code in English**: classes, methods, variables, constants
- **CamelCase** for variables and methods

### Java 7 Compatibility

This is a legacy project built with JDK 8 but maintaining Java 7 style. Do NOT use:

- Lambdas (`->`)
- Streams (`.stream()`, `.collect()`)
- `Optional`
- `java.time.*` (use **Joda Time** instead: `org.joda.time.DateTime`)
- Method references (`::`)

Use traditional for-each loops, null checks, anonymous inner classes, and `org.joda.time` for dates.

### Generated vs Manual Code

- `src/generated/` — auto-generated by Sculptor. Do not modify.
- `src/main/java/` — handwritten code that extends generated base classes.
