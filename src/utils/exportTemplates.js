/**
 * HTML templates for export functionality
 * These templates create mobile-friendly HTML exports as an alternative to CSV
 */

// HTML template for work data export
export const createWorkHtmlTemplate = (workData, dateRange) => {
  // Sort the data by date
  workData.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  const totalPay = workData.reduce((sum, day) => sum + parseFloat(day.payAmount), 0);
  const totalHours = workData.reduce((sum, day) => sum + parseFloat(day.hoursWorked), 0);
  const totalJobs = workData.reduce((sum, day) => sum + parseInt(day.jobsCompleted), 0);
  const avgHourlyRate = totalHours > 0 ? totalPay / totalHours : 0;
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Glass Guy Work Record: ${dateRange}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          line-height: 1.5;
          max-width: 600px;
          margin: 0 auto;
          padding: 15px;
          color: #333;
        }
        h1 {
          font-size: 1.5rem;
          color: #007bff;
          margin-bottom: 5px;
        }
        h2 {
          font-size: 1.2rem;
          color: #444;
          margin: 20px 0 10px;
        }
        .date-range {
          color: #666;
          margin-bottom: 20px;
          font-size: 0.9rem;
        }
        .summary {
          background-color: #f8f9fa;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 25px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          padding-bottom: 8px;
          border-bottom: 1px solid #eee;
        }
        .summary-row:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }
        .summary-label {
          font-weight: 600;
        }
        .summary-value {
          font-weight: 700;
          color: #007bff;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        th {
          background-color: #007bff;
          color: white;
          text-align: left;
          padding: 10px;
          font-size: 0.9rem;
        }
        td {
          padding: 10px;
          border-bottom: 1px solid #ddd;
          font-size: 0.9rem;
        }
        tr:nth-child(even) {
          background-color: #f2f2f2;
        }
        .pay-amount, .hourly-rate {
          text-align: right;
          font-weight: 600;
          color: #28a745;
        }
        .job-count {
          text-align: center;
        }
        .export-date {
          margin-top: 30px;
          text-align: center;
          font-size: 0.8rem;
          color: #999;
        }
        .full-day {
          color: #28a745;
          font-weight: 600;
        }
        .half-day {
          color: #ffc107;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <h1>Glass Guy Work Record</h1>
      <div class="date-range">${dateRange}</div>
      
      <div class="summary">
        <h2>Weekly Summary</h2>
        <div class="summary-row">
          <div class="summary-label">Total Hours:</div>
          <div class="summary-value">${totalHours.toFixed(1)} hrs</div>
        </div>
        <div class="summary-row">
          <div class="summary-label">Total Pay:</div>
          <div class="summary-value">$${totalPay.toFixed(2)}</div>
        </div>
        <div class="summary-row">
          <div class="summary-label">Jobs Completed:</div>
          <div class="summary-value">${totalJobs}</div>
        </div>
        <div class="summary-row">
          <div class="summary-label">Average Hourly Rate:</div>
          <div class="summary-value">$${avgHourlyRate.toFixed(2)}/hr</div>
        </div>
      </div>
      
      <h2>Daily Breakdown</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Work Type</th>
            <th>Hours</th>
            <th>Jobs</th>
            <th>Pay</th>
          </tr>
        </thead>
        <tbody>
          ${workData.map(day => `
            <tr>
              <td>${day.date}</td>
              <td class="${day.workStatus === 'Full Day' ? 'full-day' : 'half-day'}">${day.workStatus}</td>
              <td>${parseFloat(day.hoursWorked).toFixed(1)} hrs</td>
              <td class="job-count">${day.jobsCompleted}</td>
              <td class="pay-amount">${day.payAmount}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="export-date">
        Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
      </div>
    </body>
    </html>
  `;
};

// HTML template for payment data export
export const createPaymentHtmlTemplate = (paymentData, dateRange) => {
  // Get the total amount and amount paid
  const totalAmount = paymentData.reduce((sum, week) => sum + parseFloat(week.totalAmount.replace('$', '')), 0);
  const totalPaid = paymentData.reduce((sum, week) => sum + parseFloat(week.amountPaid.replace('$', '')), 0);
  const balanceDue = Math.max(0, totalAmount - totalPaid);
  
  // Determine overall payment status
  let paymentStatus = "Unpaid";
  let statusClass = "unpaid";
  
  if (totalPaid >= totalAmount) {
    paymentStatus = "Paid in Full";
    statusClass = "paid";
  } else if (totalPaid > 0) {
    paymentStatus = "Partially Paid";
    statusClass = "partial";
  }
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Glass Guy Payment Record: ${dateRange}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          line-height: 1.5;
          max-width: 600px;
          margin: 0 auto;
          padding: 15px;
          color: #333;
        }
        h1 {
          font-size: 1.5rem;
          color: #007bff;
          margin-bottom: 5px;
        }
        h2 {
          font-size: 1.2rem;
          color: #444;
          margin: 20px 0 10px;
        }
        .date-range {
          color: #666;
          margin-bottom: 20px;
          font-size: 0.9rem;
        }
        .status-badge {
          display: inline-block;
          padding: 5px 10px;
          border-radius: 4px;
          font-weight: 600;
          font-size: 0.9rem;
          margin-top: 5px;
        }
        .status-badge.paid {
          background-color: #d4edda;
          color: #155724;
        }
        .status-badge.partial {
          background-color: #fff3cd;
          color: #856404;
        }
        .status-badge.unpaid {
          background-color: #f8d7da;
          color: #721c24;
        }
        .summary {
          background-color: #f8f9fa;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 25px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          padding-bottom: 8px;
          border-bottom: 1px solid #eee;
        }
        .summary-row:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }
        .summary-label {
          font-weight: 600;
        }
        .summary-value {
          font-weight: 700;
          color: #007bff;
        }
        .payment-card {
          background-color: white;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 15px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          border-left: 4px solid #ccc;
        }
        .payment-card.paid {
          border-left-color: #28a745;
        }
        .payment-card.partial {
          border-left-color: #ffc107;
        }
        .payment-card.unpaid {
          border-left-color: #dc3545;
        }
        .payment-header {
          font-weight: 600;
          margin-bottom: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .payment-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 0.9rem;
        }
        .payment-row-label {
          color: #666;
        }
        .payment-row-value {
          font-weight: 600;
        }
        .payment-notes {
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid #eee;
          font-size: 0.9rem;
        }
        .payment-notes-label {
          font-weight: 600;
          margin-bottom: 5px;
        }
        .payment-notes-content {
          white-space: pre-line;
          color: #666;
          font-style: italic;
        }
        .last-updated {
          font-size: 0.8rem;
          color: #999;
          margin-top: 5px;
          text-align: right;
        }
        .export-date {
          margin-top: 30px;
          text-align: center;
          font-size: 0.8rem;
          color: #999;
        }
      </style>
    </head>
    <body>
      <h1>Glass Guy Payment Record</h1>
      <div class="date-range">${dateRange}</div>
      
      <div class="summary">
        <h2>Payment Summary</h2>
        <div class="summary-row">
          <div class="summary-label">Total Amount:</div>
          <div class="summary-value">$${totalAmount.toFixed(2)}</div>
        </div>
        <div class="summary-row">
          <div class="summary-label">Total Paid:</div>
          <div class="summary-value">$${totalPaid.toFixed(2)}</div>
        </div>
        <div class="summary-row">
          <div class="summary-label">Balance Due:</div>
          <div class="summary-value">$${balanceDue.toFixed(2)}</div>
        </div>
        <div class="summary-row">
          <div class="summary-label">Status:</div>
          <div>
            <span class="status-badge ${statusClass}">${paymentStatus}</span>
          </div>
        </div>
      </div>
      
      <h2>Weekly Payments</h2>
      ${paymentData.map(week => {
        const weekStatusClass = week.paymentStatus === 'Paid in Full' ? 'paid' : 
                                week.paymentStatus === 'Partially Paid' ? 'partial' : 'unpaid';
        return `
          <div class="payment-card ${weekStatusClass}">
            <div class="payment-header">
              <div>${week.weekPeriod}</div>
              <span class="status-badge ${weekStatusClass}">${week.paymentStatus}</span>
            </div>
            
            <div class="payment-row">
              <div class="payment-row-label">Total Amount:</div>
              <div class="payment-row-value">${week.totalAmount}</div>
            </div>
            <div class="payment-row">
              <div class="payment-row-label">Amount Paid:</div>
              <div class="payment-row-value">${week.amountPaid}</div>
            </div>
            <div class="payment-row">
              <div class="payment-row-label">Balance Due:</div>
              <div class="payment-row-value">${week.amountDue}</div>
            </div>
            
            ${week.notes ? `
              <div class="payment-notes">
                <div class="payment-notes-label">Notes:</div>
                <div class="payment-notes-content">${week.notes}</div>
              </div>
            ` : ''}
            
            <div class="last-updated">Last updated: ${week.lastUpdated}</div>
          </div>
        `;
      }).join('')}
      
      <div class="export-date">
        Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
      </div>
    </body>
    </html>
  `;
}; 