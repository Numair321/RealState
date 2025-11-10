# JWT Token Expiration Fix

## Problem:
```
JWT expired 10091920 milliseconds ago at 2025-11-10T04:45:54.000Z. 
Current time: 2025-11-10T07:34:05.920Z. 
Allowed clock skew: 0 milliseconds.
```

This means your login token has expired and you need to login again.

---

## Quick Fix (Immediate):

### Option 1: Logout and Login Again
1. Click "Logout" button in your app
2. Go to login page
3. Enter your credentials
4. Login again
5. You'll get a fresh token

### Option 2: Clear Browser Storage
1. Open DevTools (F12)
2. Go to Application tab (Chrome) or Storage tab (Firefox)
3. Click "Local Storage"
4. Click your domain (localhost:3000)
5. Delete `token` and `user` items
6. Refresh page
7. Login again

---

## Permanent Fix Applied:

### Changed Token Expiration Time:

**Before:**
- Token expires after: **24 hours** (86400000 milliseconds)
- Good for: Production with daily logins

**After:**
- Token expires after: **7 days** (604800000 milliseconds)
- Good for: Development and testing

### File Changed:
`backend/src/main/resources/application.properties`

```properties
# Before:
jwt.expiration=86400000  # 24 hours

# After:
jwt.expiration=604800000  # 7 days
```

---

## Token Expiration Options:

Choose based on your needs:

### Development (Recommended):
```properties
jwt.expiration=604800000  # 7 days
```

### Production (More Secure):
```properties
jwt.expiration=86400000   # 24 hours
```

### Extended Development:
```properties
jwt.expiration=2592000000 # 30 days
```

### Short Session (High Security):
```properties
jwt.expiration=3600000    # 1 hour
```

---

## How to Apply Changes:

1. **Restart Backend:**
   ```bash
   cd backend
   # Stop current backend (Ctrl+C)
   mvn spring-boot:run
   ```

2. **Logout from Frontend:**
   - Click Logout button
   - Or clear browser local storage

3. **Login Again:**
   - Go to login page
   - Enter credentials
   - New token will have 7-day expiration

---

## Understanding JWT Expiration:

### What is JWT?
JSON Web Token - A secure way to transmit information between frontend and backend.

### Why Does It Expire?
- **Security**: Limits damage if token is stolen
- **Session Management**: Forces periodic re-authentication
- **User Activity**: Ensures active users only

### What Happens When Expired?
1. Backend rejects the token
2. API calls return 401 Unauthorized
3. Frontend redirects to login page
4. User must login again

---

## Automatic Token Refresh (Future Enhancement):

For better user experience, you can implement automatic token refresh:

### How It Works:
1. Backend issues two tokens:
   - **Access Token**: Short-lived (15 minutes)
   - **Refresh Token**: Long-lived (7 days)

2. When access token expires:
   - Frontend automatically uses refresh token
   - Gets new access token
   - User stays logged in

3. When refresh token expires:
   - User must login again

### Implementation (Not included yet):
Would require:
- New `/api/auth/refresh` endpoint
- Refresh token storage
- Automatic refresh logic in frontend
- Token refresh interceptor

---

## Current Behavior:

### With 7-Day Expiration:
- Login once
- Stay logged in for 7 days
- After 7 days, must login again
- Good for development and testing

### Token Storage:
- Stored in browser's localStorage
- Key: `token`
- Cleared on logout
- Cleared on expiration (401 error)

---

## Troubleshooting:

### Still Getting Expired Token Error?

1. **Clear Browser Storage:**
   ```javascript
   // Open browser console and run:
   localStorage.clear()
   ```

2. **Check Backend is Running:**
   ```bash
   curl http://localhost:5000/api/auth/health
   ```

3. **Verify Token in Storage:**
   - Open DevTools (F12)
   - Application > Local Storage
   - Check if `token` exists
   - If exists, delete it and login again

4. **Check System Time:**
   - Make sure your computer's time is correct
   - JWT uses timestamps for expiration
   - Wrong system time can cause issues

---

## API Interceptor (Already Implemented):

The frontend already handles expired tokens automatically:

**File:** `frontend/src/services/api.js`

```javascript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'  // Auto-redirect to login
    }
    return Promise.reject(error)
  }
)
```

This means:
- When token expires
- Backend returns 401
- Frontend automatically logs you out
- Redirects to login page

---

## Summary:

✅ **Immediate Fix:** Logout and login again
✅ **Permanent Fix:** Increased token expiration to 7 days
✅ **Auto-Redirect:** Already handles expired tokens
✅ **Next Step:** Restart backend and login again

**Token will now last 7 days instead of 24 hours!**
