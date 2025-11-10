# Real Estate MLM Platform - Frontend

A comprehensive React + Tailwind CSS frontend for a Multi-Level Marketing real estate platform with role-based access control.

## Features

### Core Features
- **Multi-Role Support**: Admin, Associate, Company, and Customer dashboards
- **MLM Network Management**: Referral tracking, team building, commission management
- **Property Listings**: Search, filter, add, and manage properties
- **Lead Management**: Automated lead distribution and tracking
- **Commission Tracking**: Real-time earnings and transaction history
- **Responsive Design**: Mobile-friendly interface

### User Management
- User profiles with edit functionality
- Comprehensive settings (Security, Notifications, Privacy)
- Password change with visibility toggle
- Profile picture upload
- Role-based access control

### Property Features
- Add property form with image upload
- Property categories (Residential, Commercial, Industrial, Land)
- Advanced search and filters
- Featured properties section
- Hot deals banner
- Property details with specifications

### Static Pages
- About Us
- Contact Us (with form)
- FAQ (accordion style)
- Terms & Conditions
- Privacy Policy
- 404 Error page

### UI/UX Enhancements
- Loading spinners
- Toast notifications
- Professional forms
- Empty states
- Error handling
- Smooth animations

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- React Router v6
- Recharts (for analytics)
- Axios (API calls)
- React Icons

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

**Note:** Login/Register will not work until the backend API is set up.

## Build

```bash
npm run build
```

## Project Structure

```
src/
├── components/     # Reusable components
├── pages/         # Page components
├── layouts/       # Layout components
├── context/       # React context (Auth)
├── services/      # API services
└── App.jsx        # Main app component
```

## Environment Variables

Create a `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

Update the API URL when your backend is ready:

```
VITE_API_URL=http://localhost:5000/api
```

## User Roles

- **Admin**: Full platform management
- **Associate**: Lead management, team building, earnings tracking
- **Company**: Team management, analytics
- **Customer**: Property search, saved properties
