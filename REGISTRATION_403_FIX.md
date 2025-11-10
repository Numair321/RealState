# Registration 403 Error - Fix Guide

## Problem:
Getting 403 Forbidden error when trying to register as associate with the following data:
```json
{
  "name": "associate2",
  "email": "associate2@gmail.com",
  "phone": "1224567892",
  "password": "12345678",
  "confirmPassword": "12345678",
  "referralCode": "REF6F1B8BB8",
  "role": "associate"
}
```

## Root Cause:
CORS (Cross-Origin Resource Sharing) configuration issue causing preflight OPTIONS request to fail.

## Solution Applied:

### 1. Updated CorsConfig.java
**Changed from:**
- Using `setAllowedOrigins()` with specific origins from properties
- Limited configuration

**Changed to:**
- Using `setAllowedOriginPatterns("*")` to allow all origins (for development)
- Added more HTTP methods including OPTIONS and PATCH
- Added exposed headers
- Increased configuration flexibility

### 2. Updated SecurityConfig.java
**Added:**
- `/error` endpoint to permitAll list
- This allows Spring Boot error responses to pass through

---

## Steps to Fix:

### Step 1: Restart Backend
```bash
cd backend
# Stop the current backend (Ctrl+C)
# Then restart:
mvn spring-boot:run
```

### Step 2: Clear Browser Cache
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Or open in Incognito/Private mode

### Step 3: Test Registration Again
1. Go to http://localhost:3000/register (or your frontend URL)
2. Fill in the form:
   - Name: associate2
   - Email: associate2@gmail.com
   - Phone: 1224567892
   - Password: 12345678
   - Confirm Password: 12345678
   - Role: Associate - Real estate agent/broker
   - Referral Code: REF6F1B8BB8
3. Click "Create Account"
4. Should succeed now

---

## What Changed:

### File: `backend/src/main/java/com/investorsdeaal/config/CorsConfig.java`

**Before:**
```java
configuration.setAllowedOrigins(List.of(allowedOrigins.split(",")));
configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
configuration.setAllowedHeaders(Arrays.asList("*"));
configuration.setAllowCredentials(true);
```

**After:**
```java
configuration.setAllowedOriginPatterns(Arrays.asList("*"));
configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
configuration.setAllowedHeaders(Arrays.asList("*"));
configuration.setAllowCredentials(true);
configuration.setExposedHeaders(Arrays.asList("Authorization", "Content-Type"));
```

### File: `backend/src/main/java/com/investorsdeaal/config/SecurityConfig.java`

**Added:**
```java
.requestMatchers("/error").permitAll()
```

---

## Why This Fixes It:

### CORS Preflight:
When the browser makes a POST request to a different origin, it first sends an OPTIONS request (preflight) to check if the actual request is allowed. The old CORS configuration was rejecting this preflight request.

### AllowedOriginPatterns vs AllowedOrigins:
- `setAllowedOrigins()` - Strict matching, doesn't work well with credentials
- `setAllowedOriginPatterns()` - Pattern matching, works better with `allowCredentials(true)`

### Exposed Headers:
Added `Authorization` and `Content-Type` to exposed headers so the frontend can read them from responses.

---

## Testing Checklist:

### ✅ Test 1: Register as Associate
```
1. Go to /register
2. Select "Associate - Real estate agent/broker"
3. Fill all fields
4. Click "Create Account"
5. Should succeed and redirect to login
```

### ✅ Test 2: Register with Referral Code
```
1. Go to /register
2. Select "Associate"
3. Enter referral code: REF6F1B8BB8
4. Fill other fields
5. Should succeed
```

### ✅ Test 3: Register as Buyer
```
1. Go to /register
2. Select "Buyer - Looking to buy property"
3. Fill all fields
4. Should succeed and auto-login
```

### ✅ Test 4: Register as Seller
```
1. Go to /register
2. Select "Seller - Want to sell property"
3. Fill all fields
4. Should succeed and auto-login
```

---

## Troubleshooting:

### If still getting 403:

1. **Check backend is running:**
   ```bash
   curl http://localhost:5000/api/auth/health
   ```
   Should return: "Backend is running!"

2. **Check CORS preflight:**
   ```bash
   curl -X OPTIONS http://localhost:5000/api/auth/register \
     -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -v
   ```
   Should return 200 OK with CORS headers

3. **Check backend logs:**
   Look for errors in the backend console when making the request

4. **Check browser console:**
   - Open DevTools (F12)
   - Go to Console tab
   - Look for CORS errors
   - Go to Network tab
   - Check the OPTIONS request (should be 200)
   - Check the POST request (should be 200)

5. **Try without referral code:**
   Sometimes the referral code validation might fail if the code doesn't exist

6. **Check database:**
   Make sure MySQL is running and the database exists

---

## API Endpoint Details:

### Register Endpoint:
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "string",
  "email": "string",
  "phone": "string",
  "password": "string (min 8 chars)",
  "role": "buyer|seller|associate|company",
  "referralCode": "string (optional)"
}
```

### Response (Success):
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": 1,
    "name": "associate2",
    "email": "associate2@gmail.com",
    "role": "associate",
    "status": "pending",
    "referralCode": "REF12345678"
  }
}
```

### Response (Error):
```json
{
  "message": "Email already registered"
}
```

---

## Important Notes:

1. **Associates require admin approval:**
   - After registration, associate status is "PENDING"
   - Admin must approve before they can login
   - Go to Admin Dashboard > Associate Management to approve

2. **Buyers/Sellers are auto-approved:**
   - Status is set to "ACTIVE" immediately
   - Can login right after registration

3. **Referral codes:**
   - Only associates get referral codes
   - Referral code is auto-generated during registration
   - Can be used by new associates to join under existing associate

4. **Password requirements:**
   - Minimum 8 characters
   - No special character requirements (can be added if needed)

---

## Production Considerations:

For production, change CORS configuration to:
```java
configuration.setAllowedOriginPatterns(Arrays.asList(
    "https://yourdomain.com",
    "https://www.yourdomain.com"
));
```

Don't use `"*"` in production for security reasons.

---

## Summary:

✅ Updated CORS configuration to use `setAllowedOriginPatterns()`
✅ Added more HTTP methods and exposed headers
✅ Added `/error` endpoint to security config
✅ Registration should now work for all roles

**Next Step:** Restart the backend and try registering again!
