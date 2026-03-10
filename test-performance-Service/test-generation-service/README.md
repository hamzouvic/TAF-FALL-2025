# Test Generation Service (Python + BAML)

Standalone microservice to generate test plans from prompts.

## JMeter endpoint
- `POST /api/performance/test-generation/jmeter`

## Where to put your API key
The BAML client (`baml_src/clients.baml`) reads this environment variable:
- `OPENAI_API_KEY`

You can set it in 2 common ways:

1) **Local shell run**
```bash
export OPENAI_API_KEY="sk-..."
cd test-performance-Service/test-generation-service
uvicorn app.main:app --host 0.0.0.0 --port 8090
```

2) **Docker compose run** (recommended)
- Put `OPENAI_API_KEY=sk-...` in `test-performance-Service/.env`.
- `docker-compose.yml` passes it to the `test-generation` service.

## BAML organization
- `baml_src/clients.baml`: provider/model connection configuration.
- `baml_src/jmeter_generation.baml`: JMeter prompt and typed output contract.

## Guaranteed working prompt (Google endpoint)
Use this prompt (works with the deterministic fallback and BAML flow):

```text
Generate a JMeter HTTP test with method GET.
Domain: google.com
Path: /
Protocol: HTTPS
Users: 1
RampUp: 1
Duration: 10 seconds
Loops: 1
No body data.
```

### Quick verification
```bash
curl -X POST http://localhost:8090/api/performance/test-generation/jmeter \
  -H 'Content-Type: application/json' \
  -d '{
    "prompt": "Generate a JMeter HTTP test with method GET. Domain: google.com Path: / Protocol: HTTPS Users: 1 RampUp: 1 Duration: 10 seconds Loops: 1 No body data."
  }'
```

Expected result includes:
- `domain: "google.com"`
- `path: "/"`
- `method: "GET"`
- numeric string load fields (`nbThreads`, `rampTime`, `duration`, `loop`).
