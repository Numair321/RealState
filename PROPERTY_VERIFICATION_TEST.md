# Property Verification Testing Guide

## Overview
The property verification system is now fully functional and dynamic. Associates can add properties, and admins can approve/reject them in real-time.

## Testing Steps

### 1. Start Backend
```bash
cd backend
mvnw spring-boot:run
```
Backend will run on: http://localhost:5000

### 2. Start Frontend
```bash
cd frontend
npm run dev
```
Frontend will run on: http://localhost:5173

### 3. Test as Associate

1. **Login as Associate**
   - Go to http://localhost:5173/login
   - Login with associate credentials

2. **Add a Property**
   - Navigate to "Add Property" from sidebar
   - Fill in all required fields:
     - Property Title (e.g., "3 BHK Luxury Apartment")
     - Property Type (Residential/Commercial/etc.)
     - Category (Apartment/Villa/etc.)
     - Listing Type (Sale/Rent)
     - Price
     - Location details (Address, City, State, Pincode)
     - Area in sq ft
     - Bedrooms, Bathrooms, Parking (optional)
     - Furnished status
     - Amenities (select multiple)
     - Owner details (Name, Phone, Email)
   - Click "Submit for Verification"
   - You should see: "Property submitted for verification! You will be notified once approved."

### 4. Test as Admin

1. **Login as Admin**
   - Logout from associate account
   - Login with admin credentials

2. **View Pending Properties**
   - Go to Admin Dashboard
   - You should see a "Property Verification" section
   - All pending properties will be listed with:
     - Property title and description
     - Location (City, State)
     - Price
     - Area
     - Number of bedrooms
     - Listed by (Associate name)

3. **Approve/Reject Properties**
   - Click "Approve" button (green) to approve a property
   - Click "Reject" button (red) to reject a property
   - After action, you'll see a success message
   - The property will be removed from pending list
   - Dashboard stats will update automatically

### 5. Verify Backend API

You can also test the backend directly:

**Get Pending Properties:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/admin/properties/pending
```

**Approve Property:**
```bash
curl -X PUT -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/admin/properties/1/approve
```

**Reject Property:**
```bash
curl -X PUT -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/admin/properties/1/reject
```

## Features Implemented

### Frontend (Associate)
- ✅ Dynamic form with all property fields
- ✅ Real-time API integration
- ✅ Form validation
- ✅ Success/error notifications
- ✅ Form reset after submission
- ✅ Image upload UI (ready for backend integration)

### Frontend (Admin)
- ✅ Real-time dashboard stats from backend
- ✅ Pending properties list with full details
- ✅ Approve/Reject buttons with API integration
- ✅ Auto-refresh after actions
- ✅ Loading states
- ✅ Empty state when no pending properties
- ✅ Success/error notifications

### Backend
- ✅ Property creation endpoint
- ✅ Automatic status set to PENDING
- ✅ Admin endpoints for pending properties
- ✅ Approve/Reject endpoints
- ✅ Dashboard statistics
- ✅ User authentication and authorization
- ✅ Automatic timestamp management
- ✅ Property ownership tracking

## Database Schema

Properties are stored with:
- All property details (title, description, type, category, etc.)
- Location information (address, city, state, pincode)
- Specifications (area, bedrooms, bathrooms, parking)
- Amenities (stored as list)
- Images (stored as list of URLs)
- Owner contact details
- Listed by (reference to User)
- Status (PENDING/APPROVED/REJECTED/SOLD/RENTED)
- Featured and Hot Deal flags
- View and lead counters
- Timestamps (created_at, updated_at)

## Troubleshooting

### Property not showing in admin panel?
1. Check if backend is running on port 5000
2. Check browser console for errors
3. Verify JWT token is valid
4. Check if property was actually created in database

### Cannot approve/reject?
1. Ensure you're logged in as admin
2. Check if token has ADMIN role
3. Verify backend endpoint is accessible

### Form submission fails?
1. Check all required fields are filled
2. Verify backend is running on port 5000
3. Check CORS configuration
4. Look at browser console for error details

## Next Steps

To make it production-ready:
1. Implement actual image upload (to S3 or local storage)
2. Add property edit functionality
3. Add property details view modal
4. Implement pagination for large property lists
5. Add filters and search in admin panel
6. Add email notifications when property is approved/rejected
7. Add property analytics and reporting
