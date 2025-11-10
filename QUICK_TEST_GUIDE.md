# Quick Test Guide - Property Verification

## Start the Application

### Terminal 1 - Backend
```bash
cd backend
mvnw spring-boot:run
```
Wait for: "InvestorsDeaal Backend is running on port 5000"

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
Open: http://localhost:5173

## Test Flow

### Step 1: Add Property as Associate
1. Login as Associate
2. Go to "Add Property" from sidebar
3. Fill the form:
   - Title: "3 BHK Luxury Apartment in Noida"
   - Type: Residential
   - Category: Apartment
   - Listing: Sale
   - Price: 5000000
   - Location: "Sector 62, Noida"
   - City: "Noida"
   - State: "Uttar Pradesh"
   - Pincode: "201301"
   - Area: 1500
   - Bedrooms: 3
   - Bathrooms: 2
   - Parking: 2
   - Furnished: Semi-Furnished
   - Select some amenities
   - Owner Name: "John Doe"
   - Owner Phone: "9876543210"
   - Owner Email: "john@example.com"
4. Click "Submit for Verification"
5. ✅ Should see: "Property submitted for verification!"

### Step 2: Verify as Admin
1. Logout and login as Admin
2. Go to Admin Dashboard
3. ✅ Should see "Property Verification (1 Pending)" section
4. ✅ Should see your property with all details
5. Click "Approve" button
6. ✅ Should see: "Property approved successfully!"
7. ✅ Property should disappear from pending list
8. ✅ Dashboard stats should update

## What to Check

### In Browser Console (F12)
- No errors should appear
- Network tab should show successful API calls:
  - POST /api/properties (201 Created)
  - GET /api/admin/properties/pending (200 OK)
  - PUT /api/admin/properties/1/approve (200 OK)

### In Backend Console
- Should see SQL INSERT for property
- Should see SQL UPDATE for status change
- No errors or exceptions

### In Database (Optional)
```sql
SELECT * FROM properties;
-- Should see your property with status = 'APPROVED'
```

## Common Issues

### "Failed to submit property"
- Check if backend is running on port 5000
- Check if you're logged in (token in localStorage)
- Check browser console for detailed error

### "No pending properties"
- Refresh the page
- Check if property was actually created (check backend logs)
- Verify you're logged in as admin

### "Failed to approve property"
- Check if you have admin role
- Check backend logs for errors
- Verify property ID exists

## Success Indicators

✅ Property form submits without errors
✅ Success toast appears after submission
✅ Property appears in admin dashboard
✅ Approve/Reject buttons work
✅ Property disappears after approval
✅ Stats update automatically
✅ No console errors

## API Endpoints Being Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| /api/properties | POST | Create property |
| /api/admin/dashboard | GET | Get statistics |
| /api/admin/properties/pending | GET | Get pending properties |
| /api/admin/properties/{id}/approve | PUT | Approve property |
| /api/admin/properties/{id}/reject | PUT | Reject property |

All endpoints require JWT token in Authorization header.
