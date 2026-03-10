# Test Generation Service (Python + BAML)

Standalone microservice to generate test plans from prompts.

## JMeter endpoint
- `POST /api/performance/test-generation/jmeter`

Request:
```json
{ "prompt": "Generate a GET load test for /api/users with 20 users" }
```

Response:
```json
{
  "status": "success",
  "test_plan": {
    "protocol": "HTTP",
    "method": "GET",
    "domain": "api.example.com",
    "path": "/api/users",
    "port": "",
    "nbThreads": "20",
    "rampTime": "10",
    "duration": "60",
    "loop": "1",
    "data": ""
  },
  "explanation": "..."
}
```

## BAML organization
- `baml_src/clients.baml`: provider/model connection configuration.
- `baml_src/jmeter_generation.baml`: JMeter prompt and typed output contract.

## Run locally
```bash
cd test-performance-Service/test-generation-service
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8090
```

## Docker
Build/run from `test-performance-Service` root via docker compose service `test-generation`.
