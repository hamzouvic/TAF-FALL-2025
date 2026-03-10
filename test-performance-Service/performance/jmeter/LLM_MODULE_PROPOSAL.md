# LLM module proposal for `test-performance-service` (JMeter)

## 1) Current JMeter execution flow (what exists today)

### Backend flow
1. Frontend sends a POST request to:
   - `POST /api/performance/jmeter/http`
   - `POST /api/performance/jmeter/ftp`.
2. `JMeterController` sanitizes HTTP defaults and calls `JMeterService.runTest(...)`.
3. `JMeterService` calls `JMeterRunner.executeTestPlanAndGenerateReport(...)`.
4. The test plan object (`HttpTestPlan` or `FTPTestPlan`) generates a concrete JMX file (`TestPlan.jmx`) from templates.
5. `JMeterRunner` loads the JMX with JMeter APIs (`SaveService.loadTree(...)`), runs the test, writes CSV results, and generates dashboard files.
6. A response is returned with summary stats and report path.
7. The request + result are persisted to Mongo (`JMeterTestDocument`).

### Runtime filesystem behavior
- JMeter runtime folders are created under `${java.io.tmpdir}/jmeter`.
- JMeter properties and report templates are copied at startup by `JMeterConfigurator`.
- JMX templates (`HttpSamplerTemplate.jmx`, `FTPSamplerTemplate.jmx`) are copied to temp templates folder and used by the plan generator.
- A generated `TestPlan.jmx` is then executed.

### Frontend flow
- `JmeterApiComponent` collects fields (protocol, domain, path, method, threads, ramp-up, loop, etc.) and sends them to backend using `PerformanceTestApiService`.
- The frontend currently acts as a parameter collector; JMX generation and execution are backend responsibilities.

---

## 2) Proposed new structure for an LLM-powered JMeter module

Goal: generate valid JMeter tests automatically from a natural-language prompt.

### Proposed package structure (`performance/jmeter/src/main/java/...`)

```text
ca/etsmtl/taf/performance/jmeter/
  llm/
    controller/
      JMeterLLMController.java
    service/
      PromptToTestPlanService.java
      LLMClientService.java
      TestPlanValidationService.java
    model/
      LLMGenerateRequest.java
      LLMGenerateResponse.java
      LLMGenerationAudit.java
      PromptContext.java
    mapper/
      LLMResponseMapper.java
    prompt/
      PromptTemplateBuilder.java
      JMeterPromptExamples.java
    guardrail/
      AllowedMethods.java
      DomainPolicyValidator.java
      LimitsPolicyValidator.java
```

### API surface (minimal first version)
- `POST /api/performance/jmeter/llm/generate`
  - Input: natural-language prompt (+ optional constraints like environment/domain).
  - Output: normalized `HttpTestPlan` / `FTPTestPlan` JSON and explanation.
- `POST /api/performance/jmeter/llm/generate-and-run`
  - Input: same prompt.
  - Flow: generate -> validate -> run existing `JMeterService.runTest(...)`.
  - Output: generation metadata + JMeter result.

### Data flow
1. User prompt arrives.
2. `PromptTemplateBuilder` builds strict instruction for LLM (JSON schema expected).
3. `LLMClientService` calls the model.
4. `LLMResponseMapper` parses into internal request object.
5. `TestPlanValidationService` enforces limits (threads, domains, protocol, timeout, allowed methods).
6. If valid, call existing execution path (`JMeterService`).
7. Save prompt, generated plan, validation messages, and execution ID to `LLMGenerationAudit` for traceability.

---

## 3) Should we generate JMX directly or fill frontend fields?

## Option A: LLM generates **JMX file** directly
### Pros
- Very flexible; supports advanced JMeter elements quickly.
- Easier to express complex scenarios (multiple samplers, controllers, assertions).

### Cons
- Harder to validate safely (XML complexity, unsafe elements/plugins, path/script injection risk).
- Tighter coupling to JMeter internals in prompt/output.
- More difficult UX for editing/refinement in existing frontend.

## Option B: LLM generates **structured plan fields** (recommended as v1)
### Pros
- Reuses current backend pipeline (template replacement + execution).
- Easier validation and guardrails.
- Frontend can display/edit generated fields before execution.
- Safer and easier to audit.

### Cons
- Less expressive than full JMX for advanced scenarios.

## Option C: Hybrid (recommended target)
1. **Phase 1**: LLM -> structured fields only (`HttpTestPlan`/`FTPTestPlan`) and run through current flow.
2. **Phase 2**: Introduce a restricted intermediate DSL (e.g., `JMeterScenarioSpec`) to support multi-step scenarios.
3. **Phase 3**: Compile DSL to JMX server-side (never free-form raw JMX from LLM).

This gives expressiveness without sacrificing control.

---

## 4) Recommendation

Use **Option C (hybrid), starting with Phase 1**:
- In short term, generate frontend/back-end plan fields and let users review/edit in UI.
- Keep JMX generation as a deterministic backend step.
- Add strict validation + policies before execution.
- Add audit trail for prompt and generated test plan.

This approach is the safest and fastest path because it aligns with the current architecture and minimizes invasive changes.

---

## 5) First implementation milestone (small, deliverable)

1. Add `llm` package with generate endpoint only (no auto-run yet).
2. Return a validated `HttpTestPlan` JSON draft from prompt.
3. Add frontend “Generate with AI” action that pre-fills current JMeter form fields.
4. User confirms and clicks existing “Run” button.
5. Add audit persistence (prompt + generated plan + validation notes).

This milestone provides immediate value while keeping operational risk low.
