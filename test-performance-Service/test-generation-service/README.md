# Test Generation Service (Python + BAML)

Standalone microservice to generate test plans from a prompt.

## Run
```bash
cd test-performance-Service/test-generation-service
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8090
```

## Endpoint
- `POST /api/performance/test-generation/generate`

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

## Notes
- Uses BAML when a BAML-generated client is available in runtime.
- Falls back to deterministic prompt parsing when BAML client is unavailable.
