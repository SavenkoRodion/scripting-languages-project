import requests
from pathlib import Path

BASE_URL = "http://localhost:8000"
QUIZ_FILE = Path("be/data/quizzes.json")

passed = 0
failed = 0

def log(msg):
    print(msg)

def try_endpoint(path, expected_status=200):
    global passed, failed
    url = f"{BASE_URL}{path}"
    try:
        r = requests.get(url, timeout=5)
        if r.status_code != expected_status:
            failed += 1
            log(f"❌ GET {path} returned {r.status_code}, expected {expected_status}")
        else:
            passed += 1
            log(f"✅ GET {path} returned {r.status_code}")
    except Exception as e:
        failed += 1
        log(f"❌ GET {path} ERROR: {e}")

log("\nRunning Smoke Tests\n" + "="*50)

try_endpoint("/health")

try_endpoint("/docs")

if QUIZ_FILE.exists():
    passed += 1
    log(f"✅ JSON file exists: {QUIZ_FILE}")
else:
    failed += 1
    log(f"❌ JSON file missing: {QUIZ_FILE}")

try_endpoint("/quizes")

log("\n📊 Test Summary\n" + "="*50)
total = passed + failed
log(f"Total: {total}, Passed: {passed}, Failed: {failed}")
if failed == 0:
    log("✅ ALL SMOKE TESTS PASSED!")
else:
    log("❌ SOME TESTS FAILED")

exit(0 if failed == 0 else 1)
