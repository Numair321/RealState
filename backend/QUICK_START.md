# Quick Start Guide

## Prerequisites Check

```bash
# Check Java
java -version
# Should show: java version "17.x.x"

# Check Maven
mvn -version
# Should show: Apache Maven 3.x.x

# Check MySQL
mysql --version
# Should show: mysql Ver 8.x.x
```

## Step 1: Setup Database

Open MySQL Workbench or command line:

```sql
CREATE DATABASE IF NOT EXISTS investorsdeaal_db;
USE investorsdeaal_db;
```

## Step 2: Configure Backend

Edit `src/main/resources/application.properties`:

```properties
# Update these if needed
spring.datasource.username=root
spring.datasource.password=your_password
```

## Step 3: Start Backend

### Option A: Using Batch Script (Windows)
```bash
cd backend
start-backend.bat
```

### Option B: Using Maven
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Option C: Using IDE
1. Open `backend` folder in IntelliJ IDEA or VS Code
2. Run `RealEstateMLMApplication.java`

## Step 4: Verify Backend is Running

Open browser or use curl:
```bash
curl http://localhost:5000/api/auth/health
```

Should return: `Backend is running!`

## Step 5: Test Registration

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"John Doe\",\"email\":\"john@example.com\",\"phone\":\"9876543210\",\"password\":\"password123\",\"role\":\"buyer\"}"
```

Should return JWT token and user data.

## Step 6: Test Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"john@example.com\",\"password\":\"password123\"}"
```

Should return JWT token.

## Step 7: Check Database

In MySQL Workbench:
```sql
USE investorsdeaal_db;
SHOW TABLES;
SELECT * FROM users;
```

You should see the registered user!

## Common Issues

### Issue: Port 5000 already in use
**Solution:** Change port in `application.properties`
```properties
server.port=8080
```

### Issue: Database connection refused
**Solution:** Start MySQL service
```bash
net start MySQL80
```

### Issue: Build fails
**Solution:** Clean and rebuild
```bash
mvn clean install -U
```

### Issue: Java version error
**Solution:** Set JAVA_HOME
```bash
set JAVA_HOME=C:\Program Files\Java\jdk-17
```

## Next Steps

1. ✅ Backend is running
2. 🔄 Complete remaining services
3. 🔄 Test all endpoints
4. 🔄 Connect frontend

## API Testing Tools

### Using Postman:
1. Import collection (create one with all endpoints)
2. Set base URL: `http://localhost:5000/api`
3. Test each endpoint

### Using curl (Windows PowerShell):
```powershell
# Register
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -ContentType "application/json" -Body '{"name":"Test","email":"test@test.com","phone":"1234567890","password":"test123","role":"buyer"}'

# Login
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -ContentType "application/json" -Body '{"email":"test@test.com","password":"test123"}'
```

## Success Indicators

✅ Backend starts without errors
✅ Health endpoint returns 200
✅ Can register new user
✅ Can login with credentials
✅ JWT token is generated
✅ Database tables are created
✅ User data is saved in database

## Development Workflow

1. Make code changes
2. Stop backend (Ctrl+C)
3. Restart: `mvn spring-boot:run`
4. Test changes

Or use Spring Boot DevTools for auto-reload!

## Logs Location

Console output shows all logs.
Check for:
- `Started RealEstateMLMApplication` - Backend started
- `Tomcat started on port(s): 5000` - Server ready
- SQL queries - Database operations

## Ready for Next Phase!

Once backend is running successfully, we'll add:
- Property management APIs
- Lead management APIs
- Commission calculation
- File upload
- And more!
