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

## Usage Instructions

### Running the application locally

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm start
   ```

3. Open your browser and navigate to http://localhost:3000

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

All data is stored locally in your browser's localStorage. This means:
- Data will persist across browser sessions
- Data will not be shared between devices
- Clearing your browser data will also clear the app data

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
