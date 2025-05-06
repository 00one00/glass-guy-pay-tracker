# Glass Guy Pay Tracker

A simple mobile-friendly web application for tracking work days at an auto glass business. This application allows you to track days worked, pay rates, jobs completed, calculate average hourly pay, and track payments received.

## Features

- Calendar view for selecting work days
- Easy input for full day/half day selection
- Track exact work hours by entering start and end times
- Record number of jobs completed per day
- Dashboard showing weekly work summary
- Calculate daily and weekly average hourly pay
- Track payments received (full or partial)
- Payment status indicators (paid, partially paid, unpaid)
- Add payment notes for record-keeping
- Browse historical weekly work records
- Mobile-friendly CSV and HTML exports
- Mobile-friendly design
- Firebase integration for authentication and data storage
- Multi-user support with secure data isolation

## Usage Instructions

### Running the application locally

1. Install dependencies:
   ```
   npm install
   ```

2. Configure Firebase (see [Firebase Setup](#firebase-setup) below)

3. Start the development server:
   ```
   npm start
   ```

4. Open your browser and navigate to http://localhost:3000

### Authentication

1. Register a new account using your email and password
2. Log in with your registered account
3. Use the password reset feature if you forget your password

### Adding a Work Day

1. Select a date on the calendar view
2. Choose between "Full Day" ($150), "Half Day" ($75), or "Day Off"
3. Optionally enter your start time and end time to track exact hours
4. Enter the number of jobs completed
5. Click "Save"

### Viewing Weekly Summary

The weekly summary at the top of the application shows:
- Total hours worked
- Total pay earned
- Total jobs completed
- Average hourly rate
- Payment status (paid, partially paid, or unpaid)

### Recording Payments

1. Use the Payment Tracker section to record payments received
2. Click "Record Payment"
3. Enter the amount paid (can be partial payment)
4. Add any notes about the payment (optional)
5. Click "Save Payment"

The payment status will automatically update to show:
- Amount due
- Amount paid
- Balance due
- Payment status

### Viewing Historical Weekly Records

1. Click the "View Week History" button at the top of the application
2. Browse through the list of all weeks with work records
3. Weeks are color-coded by payment status (paid, partially paid, unpaid)
4. Click on any week to view its details
5. Use the "Return to Current Week" button to go back to the current week

### Exporting Payment Data

1. Click the "Export Payment" button in the Payment Tracker
2. Choose between CSV or HTML format:
   - CSV: Standard spreadsheet format for desktop applications
   - HTML: Mobile-friendly formatted page for better viewing on phones
3. The exported file includes:
   - Readable date formats (e.g., "May 1 to May 7, 2023")
   - Properly formatted currency values with dollar signs
   - Clear payment status indicators
   - Human-readable column headers
   - Filename with date range for easy identification

### Editing or Deleting a Work Day

1. Select the day on the calendar
2. Click "Edit" if the day already has data
3. Update the information or click "Delete" to remove the entry
4. Click "Save" to confirm changes

### Exporting Work Data

1. Click the "Export Data" button on the weekly summary
2. Choose between CSV or HTML format:
   - CSV: Standard spreadsheet format for desktop applications
   - HTML: Mobile-friendly formatted page for better viewing on phones
3. The exported file includes:
   - Readable date formats with day of week (e.g., "Mon, May 1, 2023")
   - Clearly labeled work types ("Full Day" instead of "full")
   - Hours with proper decimal places and "hrs" label
   - Properly formatted currency values with dollar signs
   - Human-readable column headers
   - Filename with date range for easy identification

## Deployment

### Deploy using GitHub Pages

1. Add the `homepage` field to your `package.json`:
   ```json
   "homepage": "https://yourusername.github.io/gg_pay_tracker"
   ```

2. Install the `gh-pages` package:
   ```
   npm install --save-dev gh-pages
   ```

3. Add deployment scripts to `package.json`:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build",
     ...
   }
   ```

4. Deploy the application:
   ```
   npm run deploy
   ```

### Serve the static build

This project includes a built version in the `build` directory that can be deployed immediately:

```
npm install -g serve
serve -s build
```

## Data Storage

The application uses Firebase Firestore for data storage and authentication:

- Data is securely stored in the cloud and synchronized across devices
- Authentication ensures only authorized users can access their data
- Each user's data is isolated and cannot be accessed by other users
- Firestore security rules prevent unauthorized access to data

For local development or if Firebase is not configured, the application falls back to using localStorage:
- Data will persist across browser sessions
- Data will not be shared between devices
- Clearing your browser data will also clear the app data

## Firebase Setup

### 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard to create your project
   - Enter a project name
   - Choose whether to enable Google Analytics (optional)
   - Accept the terms and click "Create Project"

### 2. Set Up Firebase Authentication

1. In your Firebase project console, navigate to "Authentication" in the left sidebar
2. Click "Get started"
3. Enable the "Email/Password" sign-in method
   - Click on "Email/Password"
   - Toggle the "Enable" switch to on
   - Click "Save"

### 3. Create Firestore Database

1. In your Firebase project console, navigate to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose a starting mode:
   - For development, select "Start in test mode"
   - For production, select "Start in production mode"
4. Choose a location for your database (select the closest region to your users)
5. Click "Enable"

### 4. Get Your Firebase Configuration

1. In your Firebase project console, click on the gear icon (⚙️) near "Project Overview" and select "Project settings"
2. Scroll down to the "Your apps" section
3. If you haven't already added a web app, click on the web icon (</>) to add one
   - Enter a nickname for your app (e.g., "Glass Guy Pay Tracker")
   - (Optional) Check "Also set up Firebase Hosting"
   - Click "Register app"
4. Copy the Firebase configuration object

### 5. Add Configuration to Your App

Open the file `src/firebase/config.js` and replace the placeholder values with your actual Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-actual-project-id.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-actual-project-id.appspot.com",
  messagingSenderId: "YOUR_ACTUAL_SENDER_ID",
  appId: "YOUR_ACTUAL_APP_ID"
};
```

### 6. Set Up Firestore Security Rules (For Production)

1. In your Firebase project console, navigate to "Firestore Database" → "Rules"
2. Add these rules that allow authenticated users to access only their own data:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      match /data/{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      match /workDays/{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

3. Click "Publish"

## Technical Notes

- The application handles time calculations accurately, including overnight shifts
- A dedicated TimeCalculator utility ensures consistent time calculations throughout the app
- Time is calculated by converting start and end times to minutes since midnight
- All hourly calculations are rounded to one decimal place for readability
- Payment amounts use precise decimal arithmetic to prevent rounding errors
- All monetary calculations are rounded to two decimal places
- Week history feature allows browsing and reviewing all historical weekly work records
- CSV exports are formatted for optimal readability on mobile devices
- HTML exports provide a styled, mobile-friendly alternative for better viewing on smartphones
- Firebase Authentication provides secure user authentication
- Firestore database ensures data persistence across devices and browsers
