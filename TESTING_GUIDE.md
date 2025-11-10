# Complete Application Testing Guide

## 🚀 Setup & Start

### Step 1: Start Backend
```bash
cd backend
mvn spring-boot:run
```
Backend runs on: **http://localhost:5000**

### Step 2: Start Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on: **http://localhost:3000**

---

## 📋 Test Accounts Setup

### Create Test Users (Use Registration or Database)

#### 1. Admin Account
```
Email: admin@investorsdeaal.com
Password: admin123
Role: admin
Status: ACTIVE (set manually in database)
```

#### 2. Associate Account
```
Email: associate@investorsdeaal.com
Password: associate123
Role: associate
Status: ACTIVE (approve via admin or set in database)
Referral Code: Will be auto-generated
```

#### 3. Company Account
```
Email: company@investorsdeaal.com
Password: company123
Role: company
Status: ACTIVE
```

#### 4. Buyer Account
```
Email: buyer@investorsdeaal.com
Password: buyer123
Role: buyer
Status: ACTIVE
```

#### 5. Seller Account
```
Email: seller@investorsdeaal.com
Password: seller123
Role: seller
Status: ACTIVE
```

---

## 🧪 Testing Flow

### Phase 1: Public Pages (No Login Required)

#### Home Page
```
URL: http://localhost:3000/
```
**Test:**
- ✅ Hero section with background image
- ✅ Search box (Location, Property Type, Budget)
- ✅ Hot Deals banner
- ✅ Featured Properties section (4 properties)
- ✅ Property Categories (Apartments, Villas, Commercial, Land)
- ✅ Why Choose Us section
- ✅ Become Associate section with stats
- ✅ Footer with all links

#### About Us
```
URL: http://localhost:3000/about
```
**Test:**
- ✅ Mission & Vision
- ✅ Achievements stats
- ✅ Why Choose Us
- ✅ Leadership section

#### Contact Us
```
URL: http://localhost:3000/contact
```
**Test:**
- ✅ Contact form (Name, Email, Phone, Subject, Message)
- ✅ Contact information (Phone, Email, Address)
- ✅ Map placeholder
- ✅ Form submission

#### FAQ
```
URL: http://localhost:3000/faq
```
**Test:**
- ✅ Accordion questions (6 categories)
- ✅ Click to expand/collapse
- ✅ 20+ questions

#### Terms & Conditions
```
URL: http://localhost:3000/terms
```
**Test:**
- ✅ All 11 sections visible
- ✅ Readable content

#### Privacy Policy
```
URL: http://localhost:3000/privacy
```
**Test:**
- ✅ All 10 sections visible
- ✅ GDPR compliant content

#### Property Search (Public)
```
URL: http://localhost:3000/properties
```
**Test:**
- ✅ Property grid view
- ✅ Filters (Location, Type, Price)
- ✅ Property cards with details
- ✅ Click to view details

#### Property Details
```
URL: http://localhost:3000/property/1
```
**Test:**
- ✅ Property image placeholder
- ✅ Property details (price, area, bedrooms)
- ✅ Description
- ✅ Contact Agent button

---

### Phase 2: Registration & Login

#### Registration Page
```
URL: http://localhost:3000/register
```

**Test Scenarios:**

**1. Register as Buyer:**
```
Name: John Buyer
Email: john.buyer@test.com
Phone: 9876543210
Password: test123456
Confirm Password: test123456
Role: Buyer - Looking to buy property
Referral Code: (leave empty)
```
**Expected:** Success → Redirect to Customer Dashboard

**2. Register as Seller:**
```
Name: Jane Seller
Email: jane.seller@test.com
Phone: 9876543211
Password: test123456
Role: Seller - Want to sell property
```
**Expected:** Success → Redirect to Customer Dashboard

**3. Register as Associate:**
```
Name: Mike Associate
Email: mike.associate@test.com
Phone: 9876543212
Password: test123456
Role: Associate - Real estate agent/broker
Referral Code: (use existing associate's code if available)
```
**Expected:** Success → Account pending approval message

**4. Register as Company:**
```
Name: ABC Realty
Email: abc@realty.com
Phone: 9876543213
Password: test123456
Role: Company - Real estate company
```
**Expected:** Success → Redirect to Company Dashboard

**Test Validations:**
- ✅ Email format validation
- ✅ Password length (min 8 characters)
- ✅ Password match validation
- ✅ Duplicate email error
- ✅ Invalid referral code error

#### Login Page
```
URL: http://localhost:3000/login
```

**Test Each Role:**

**1. Login as Admin:**
```
Email: admin@investorsdeaal.com
Password: admin123
```
**Expected:** Redirect to `/admin` (Admin Dashboard)

**2. Login as Associate:**
```
Email: associate@investorsdeaal.com
Password: associate123
```
**Expected:** Redirect to `/associate` (Associate Dashboard)

**3. Login as Company:**
```
Email: company@investorsdeaal.com
Password: company123
```
**Expected:** Redirect to `/company` (Company Dashboard)

**4. Login as Buyer/Seller:**
```
Email: buyer@investorsdeaal.com
Password: buyer123
```
**Expected:** Redirect to `/customer` (Customer Dashboard)

**Test Validations:**
- ✅ Invalid email error
- ✅ Wrong password error
- ✅ Account not active error (for pending associates)
- ✅ JWT token stored in localStorage

---

### Phase 3: Admin Panel Testing

**Login as Admin first!**

#### Admin Dashboard
```
URL: http://localhost:3000/admin
After Login: Automatically redirected here
```

**Test:**
- ✅ Stats cards (Total Associates, Commissions, Leads, Properties)
- ✅ Revenue trend chart
- ✅ Lead generation chart
- ✅ Recent activities list
- ✅ Sidebar navigation

#### Associate Management
```
URL: http://localhost:3000/admin/associates
```

**Test:**
- ✅ Associates list table
- ✅ Search associates
- ✅ Filter by status (All, Active, Pending, Inactive)
- ✅ View associate details
- ✅ Approve pending associate (green checkmark icon)
- ✅ Reject associate (red X icon)
- ✅ Edit associate (pencil icon)
- ✅ Delete associate (trash icon)
- ✅ "Add Associate" button

**Test Actions:**
1. Click "Approve" on pending associate → Status changes to Active
2. Click "Reject" → Status changes to Rejected
3. Search by name → Filters results
4. Filter by status → Shows filtered list

#### Lead Oversight
```
URL: http://localhost:3000/admin/leads
```

**Test:**
- ✅ Leads statistics (Total, Open, In Progress, Won, Escalated)
- ✅ Leads table with all details
- ✅ Search leads
- ✅ Filter by status
- ✅ View lead details (eye icon)
- ✅ Lead priority badges (High, Medium, Low)
- ✅ Lead status badges (color-coded)
- ✅ Assigned associate name
- ✅ Created date

#### Commission Configuration
```
URL: http://localhost:3000/admin/commissions
```

**Test:**
- ✅ Multi-level commission rates (Level 1-5)
- ✅ Input fields for each level (editable)
- ✅ Referral bonus configuration
- ✅ Milestone bonus configuration
- ✅ "Save Configuration" button
- ✅ Success message on save

**Test Actions:**
1. Change Level 1 commission from 2% to 2.5%
2. Click "Save Configuration"
3. Verify success message

#### Admin Profile
```
URL: http://localhost:3000/admin/profile
```

**Test:**
- ✅ Profile picture placeholder
- ✅ User information display
- ✅ "Edit Profile" button
- ✅ Edit mode with all fields
- ✅ Save changes
- ✅ Cancel button

#### Admin Settings
```
URL: http://localhost:3000/admin/settings
```

**Test:**
- ✅ Security tab (Password change)
- ✅ Notifications tab (Toggle switches)
- ✅ Privacy tab (Profile visibility, Data export, Delete account)
- ✅ Password visibility toggle
- ✅ All toggle switches working

---

### Phase 4: Associate Panel Testing

**Login as Associate first!**

#### Associate Dashboard
```
URL: http://localhost:3000/associate
After Login: Automatically redirected here
```

**Test:**
- ✅ Stats cards (Total Earnings, Team Members, Active Leads, Conversion Rate)
- ✅ Change indicators (+12%, +3, etc.)
- ✅ Earnings overview chart
- ✅ Quick Actions buttons
- ✅ Recent Leads list
- ✅ Sidebar navigation

**Test Actions:**
1. Click "Add New Property" → Redirects to add property form
2. Click "Invite Team Member" → Shows referral link
3. Click "View Commission Report" → Redirects to earnings page

#### My Leads
```
URL: http://localhost:3000/associate/leads
```

**Test:**
- ✅ Tabs (All Leads, Open, In Progress, Won, Lost)
- ✅ Lead count in each tab
- ✅ Search leads
- ✅ Filter by priority
- ✅ Lead cards with full details
- ✅ Status badges (color-coded)
- ✅ Priority badges
- ✅ Contact information (phone, email)
- ✅ Last contact date
- ✅ Next follow-up date
- ✅ "Update Status" button
- ✅ Edit lead (pencil icon)
- ✅ "Add Lead" button

**Test Actions:**
1. Click on different tabs → Shows filtered leads
2. Click "Update Status" → Opens status update modal
3. Search for a lead → Filters results

#### Property Listings
```
URL: http://localhost:3000/associate/properties
```

**Test:**
- ✅ Property grid view
- ✅ Property cards with image placeholder
- ✅ Property type badge
- ✅ Status badge (Active/Sold)
- ✅ Price display
- ✅ Views and leads count
- ✅ "View" button
- ✅ "Edit" button
- ✅ "Add Property" button (top right)

**Test Actions:**
1. Click "Add Property" → Redirects to add property form
2. Click "View" → Shows property details
3. Click "Edit" → Opens edit form

#### Add Property
```
URL: http://localhost:3000/associate/properties/add
```

**Test:**
- ✅ Basic Information section
  - Title, Property Type, Category, Listing Type, Price, Description
- ✅ Location Details section
  - Address, City, State, Pincode
- ✅ Property Specifications section
  - Area, Bedrooms, Bathrooms, Parking, Furnished Status
  - Amenities checkboxes (10 options)
- ✅ Owner Details section
  - Owner Name, Phone, Email
- ✅ Images Upload section
  - Choose Images button
  - Image preview with remove button
  - Multiple images support
- ✅ "Save as Draft" button
- ✅ "Submit for Verification" button

**Test Actions:**
1. Fill all required fields
2. Select amenities (check multiple boxes)
3. Upload images (select 2-3 images)
4. Click "Submit for Verification"
5. Verify success message

#### My Network
```
URL: http://localhost:3000/associate/team
```

**Test:**
- ✅ Network stats (Direct Referrals, Total Network, Active Members, Network Earnings)
- ✅ Referral link box with copy button
- ✅ Team members table
- ✅ Level badges (Level 1, Level 2)
- ✅ Team size for each member
- ✅ Earnings display
- ✅ Status badges
- ✅ Joined date
- ✅ "Invite Member" button

**Test Actions:**
1. Click "Copy Link" → Copies referral link
2. View team members → Shows hierarchical structure
3. Check network stats → Displays correct counts

#### Earnings
```
URL: http://localhost:3000/associate/earnings
```

**Test:**
- ✅ Summary cards (This Month, Total Earned, Pending)
- ✅ Earnings breakdown chart (Direct, Network, Bonuses)
- ✅ Transaction history table
- ✅ Commission type column
- ✅ Property/details column
- ✅ Amount column
- ✅ Date column
- ✅ Status badges (Paid/Pending)
- ✅ "Download Report" button

**Test Actions:**
1. View earnings chart → Shows bar chart
2. Scroll transaction history → Shows all transactions
3. Click "Download Report" → Triggers download

#### Associate Profile
```
URL: http://localhost:3000/associate/profile
```

**Test:**
- ✅ Profile card with picture
- ✅ Contact information
- ✅ "Edit Profile" button
- ✅ Personal information form
- ✅ All fields editable
- ✅ "Save Changes" button
- ✅ "Cancel" button

#### Associate Settings
```
URL: http://localhost:3000/associate/settings
```

**Test:**
- ✅ Security tab (Password change with visibility toggle)
- ✅ Notifications tab (5 toggle switches)
- ✅ Privacy tab (Profile visibility, Data export, Delete account)
- ✅ 2FA enable button
- ✅ All toggles working

---

### Phase 5: Company Panel Testing

**Login as Company first!**

#### Company Dashboard
```
URL: http://localhost:3000/company
After Login: Automatically redirected here
```

**Test:**
- ✅ Stats cards (Team Members, Active Leads, Conversions, Revenue)
- ✅ Team Performance section
- ✅ Sidebar navigation

#### Team Management
```
URL: http://localhost:3000/company/team
```

**Test:**
- ✅ Team members table
- ✅ Name, Role, Leads, Conversions, Status columns
- ✅ Status badges
- ✅ "Add Member" button

**Test Actions:**
1. View team members → Shows all team
2. Click "Add Member" → Opens add form

#### Company Profile
```
URL: http://localhost:3000/company/profile
```

**Test:**
- ✅ Same as other profiles
- ✅ Company-specific fields

#### Company Settings
```
URL: http://localhost:3000/company/settings
```

**Test:**
- ✅ Same settings as other roles

---

### Phase 6: Customer Panel Testing

**Login as Buyer/Seller first!**

#### Customer Dashboard
```
URL: http://localhost:3000/customer
After Login: Automatically redirected here
```

**Test:**
- ✅ Stats cards (Saved Properties, Saved Searches, New Matches)
- ✅ Recent Activity section
- ✅ Sidebar navigation

#### Customer Profile
```
URL: http://localhost:3000/customer/profile
```

**Test:**
- ✅ Profile information
- ✅ Edit functionality

#### Customer Settings
```
URL: http://localhost:3000/customer/settings
```

**Test:**
- ✅ All settings tabs

---

## 🔄 Cross-Panel Testing

### Test Navigation Between Panels

**1. Logout and Login as Different Roles:**
```
Admin → Logout → Login as Associate → Check redirect
Associate → Logout → Login as Company → Check redirect
Company → Logout → Login as Customer → Check redirect
```

**2. Test Protected Routes:**
```
Try accessing /admin without login → Redirects to /login
Try accessing /associate as admin → Redirects to /
Try accessing /company as associate → Redirects to /
```

**3. Test Sidebar Navigation:**
```
Click each sidebar link in each panel
Verify active state highlighting
Verify all links work
```

---

## ✅ Complete Testing Checklist

### Public Pages (7 pages)
- [ ] Home page loads correctly
- [ ] About Us page displays
- [ ] Contact Us form works
- [ ] FAQ accordion works
- [ ] Terms & Conditions readable
- [ ] Privacy Policy readable
- [ ] Property search works

### Authentication (2 pages)
- [ ] Registration works for all roles
- [ ] Login works for all roles
- [ ] Validation errors show correctly
- [ ] JWT token stored
- [ ] Redirects work correctly

### Admin Panel (6 pages)
- [ ] Dashboard displays stats
- [ ] Associate management works
- [ ] Lead oversight works
- [ ] Commission config works
- [ ] Profile edit works
- [ ] Settings work

### Associate Panel (7 pages)
- [ ] Dashboard displays stats
- [ ] Leads management works
- [ ] Property listings work
- [ ] Add property form works
- [ ] Network tree displays
- [ ] Earnings show correctly
- [ ] Profile & Settings work

### Company Panel (5 pages)
- [ ] Dashboard displays
- [ ] Team management works
- [ ] Profile works
- [ ] Settings work

### Customer Panel (3 pages)
- [ ] Dashboard displays
- [ ] Profile works
- [ ] Settings work

---

## 🐛 Common Issues to Check

### Frontend Issues:
- [ ] Images loading (background, property images)
- [ ] Charts rendering (Recharts)
- [ ] Forms submitting
- [ ] Validation messages showing
- [ ] Toast notifications appearing
- [ ] Loading spinners showing
- [ ] Responsive design (mobile, tablet)

### Backend Issues:
- [ ] API endpoints responding
- [ ] JWT authentication working
- [ ] Database queries executing
- [ ] Error messages returning
- [ ] CORS not blocking requests

### Integration Issues:
- [ ] Frontend calling correct API URLs
- [ ] JWT token sent in headers
- [ ] Response data parsed correctly
- [ ] Error handling working
- [ ] Redirects after actions

---

## 📊 Test Results Template

```
Date: ___________
Tester: ___________

Public Pages: ✅ / ❌
Authentication: ✅ / ❌
Admin Panel: ✅ / ❌
Associate Panel: ✅ / ❌
Company Panel: ✅ / ❌
Customer Panel: ✅ / ❌

Issues Found:
1. _________________
2. _________________
3. _________________

Notes:
_________________
```

---

## 🎯 Quick Test Commands

### Test Backend Health:
```bash
curl http://localhost:5000/api/auth/health
```

### Test Registration:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","phone":"1234567890","password":"test12345","role":"buyer"}'
```

### Test Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test12345"}'
```

---

## 🚀 Ready to Test!

**Start both servers and follow the testing flow above!**

Good luck with testing! 🎉
