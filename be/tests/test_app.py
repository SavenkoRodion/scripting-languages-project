from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_count_endpoint_returns_200():
    response = client.get("/count")
    assert response.status_code == 200
    data = response.json()
    assert "counter" in data
    assert isinstance(data["counter"], int)


def test_counter_increments_between_calls():
    r1 = client.get("/count")
    r2 = client.get("/count")

    assert r1.status_code == 200
    assert r2.status_code == 200

    first = r1.json()["counter"]
    second = r2.json()["counter"]

    assert second == first + 1
