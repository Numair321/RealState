# Backend Installation Guide - Windows

## Step 1: Install Java JDK 17

### Option A: Using Chocolatey (Recommended)
```powershell
# Install Chocolatey first (if not installed)
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install Java 17
choco install openjdk17 -y
```

### Option B: Manual Installation
1. Download JDK 17 from: https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html
2. Run the installer
3. Add to PATH:
   - Right-click "This PC" → Properties → Advanced System Settings
   - Environment Variables → System Variables → Path → Edit
   - Add: `C:\Program Files\Java\jdk-17\bin`

### Verify Installation:
```bash
java -version
javac -version
```

Should show: `java version "17.x.x"`

---

## Step 2: Install Apache Maven

### Option A: Using Chocolatey
```powershell
choco install maven -y
```

### Option B: Manual Installation
1. Download Maven from: https://maven.apache.org/download.cgi
2. Extract to: `C:\Program Files\Apache\maven`
3. Add to PATH:
   - Environment Variables → System Variables → Path → Edit
   - Add: `C:\Program Files\Apache\maven\bin`
4. Create MAVEN_HOME variable:
   - Environment Variables → System Variables → New
   - Variable name: `MAVEN_HOME`
   - Variable value: `C:\Program Files\Apache\maven`

### Verify Installation:
```bash
mvn -version
```

Should show: `Apache Maven 3.x.x`

---

## Step 3: Install MySQL Server & Workbench

### Option A: Using MySQL Installer (Recommended)
1. Download MySQL Installer: https://dev.mysql.com/downloads/installer/
2. Run installer and select:
   - MySQL Server 8.0
   - MySQL Workbench
   - MySQL Shell (optional)
3. During setup:
   - Choose "Development Computer"
   - Set root password: `root` (or your preferred password)
   - Create user: `investorsdeaal` with password: `admin123`

### Option B: Using Chocolatey
```powershell
choco install mysql -y
choco install mysql.workbench -y
```

### Verify Installation:
```bash
mysql --version
```

### Start MySQL Service:
```powershell
# Start MySQL service
net start MySQL80

# Or using Services
services.msc
# Find MySQL80 → Right-click → Start
```

---

## Step 4: Setup MySQL Database

### Using MySQL Workbench:
1. Open MySQL Workbench
2. Connect to localhost (root user)
3. Run this SQL:

```sql
-- Create database
CREATE DATABASE IF NOT EXISTS investorsdeaal_db;

-- Create user (if not exists)
CREATE USER IF NOT EXISTS 'investorsdeaal'@'localhost' IDENTIFIED BY 'admin123';

-- Grant privileges
GRANT ALL PRIVILEGES ON investorsdeaal_db.* TO 'investorsdeaal'@'localhost';
FLUSH PRIVILEGES;

-- Use database
USE investorsdeaal_db;

-- Verify
SHOW DATABASES;
```

### Using Command Line:
```bash
# Login to MySQL
mysql -u root -p

# Run the above SQL commands
```

---

## Step 5: Configure Backend

### Update application.properties:

Navigate to: `backend/src/main/resources/application.properties`

Update these values:
```properties
# If using root user
spring.datasource.username=root
spring.datasource.password=your_root_password

# OR if using investorsdeaal user
spring.datasource.username=investorsdeaal
spring.datasource.password=admin123
```

---

## Step 6: Install Maven Dependencies

Open PowerShell/CMD in the `backend` folder:

```bash
# Navigate to backend folder
cd backend

# Clean and install dependencies
mvn clean install

# This will download all dependencies from pom.xml
# First time will take 5-10 minutes
```

### If you get errors:

**Error: JAVA_HOME not set**
```powershell
# Set JAVA_HOME temporarily
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"

# Or permanently in System Environment Variables
```

**Error: Maven not found**
```powershell
# Restart PowerShell/CMD after Maven installation
# Or add Maven to PATH manually
```

---

## Step 7: Run the Backend

```bash
# Option 1: Using Maven
mvn spring-boot:run

# Option 2: Using Java (after building)
mvn clean package
java -jar target/real-estate-mlm-1.0.0.jar
```

### Expected Output:
```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.2.0)

InvestorsDeaal Backend is running on port 5000
```

---

## Step 8: Verify Installation

### Check if backend is running:
```bash
# Open browser or use curl
curl http://localhost:5000/api/health

# Or open in browser
http://localhost:5000
```

### Check database connection:
```bash
# In MySQL Workbench, run:
USE investorsdeaal_db;
SHOW TABLES;

# Should show tables created by Hibernate
```

---

## Troubleshooting

### Port 5000 already in use:
```properties
# Change port in application.properties
server.port=8080
```

### MySQL connection refused:
```bash
# Check if MySQL is running
net start MySQL80

# Check MySQL port
netstat -an | findstr 3306
```

### Maven build fails:
```bash
# Clear Maven cache
mvn dependency:purge-local-repository

# Rebuild
mvn clean install -U
```

### Java version mismatch:
```bash
# Check Java version
java -version

# Should be 17.x.x
# If not, uninstall other Java versions or set JAVA_HOME correctly
```

---

## IDE Setup (Optional but Recommended)

### IntelliJ IDEA Community Edition:
1. Download: https://www.jetbrains.com/idea/download/
2. Open backend folder as Maven project
3. Wait for dependencies to download
4. Run RealEstateMLMApplication.java

### VS Code:
1. Install extensions:
   - Extension Pack for Java
   - Spring Boot Extension Pack
2. Open backend folder
3. Run using Spring Boot Dashboard

---

## Quick Start Commands

```bash
# Full setup from scratch
cd backend
mvn clean install
mvn spring-boot:run

# Backend will be available at:
# http://localhost:5000
```

---

## Next Steps

After successful installation:
1. ✅ Backend running on port 5000
2. ✅ MySQL database created
3. ✅ Tables auto-created by Hibernate
4. 🔄 Create remaining Services & Controllers
5. 🔄 Test API endpoints
6. 🔄 Connect frontend to backend

---

## Need Help?

Common issues and solutions:
- **Port conflicts**: Change server.port in application.properties
- **Database errors**: Check MySQL service is running
- **Maven errors**: Clear cache with `mvn clean`
- **Java errors**: Verify JAVA_HOME is set correctly

For more help, check the logs in the console output.
