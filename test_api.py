import json
import urllib.request
import urllib.error


def test_api(path, payload, desc):
    data = json.dumps(payload).encode()
    req = urllib.request.Request(
        f"https://snaphire-1.onrender.com{path}",
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            body = resp.read().decode()
            print(f"{desc}: {resp.status} {body}")
            return json.loads(body)
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f"{desc}: {e.code} {body}")
        return None


# Step 1: Send OTP
print("=== Step 1: Send OTP ===")
test_api("/auth/send-otp", {"phone": "+919999999999", "role": "worker"}, "send-otp")

# Step 2: Verify OTP
print("\n=== Step 2: Verify OTP ===")
test_api(
    "/auth/verify-otp",
    {"phone": "+919999999999", "otp": "123456", "role": "worker"},
    "verify-otp",
)
