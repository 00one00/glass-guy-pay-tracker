import React, { useState } from 'react';
import { calculateWeeklySummary } from '../utils/dateUtils';
import { exportToCSV } from '../utils/storage';

const WeeklySummary = ({ weekData, weekBounds, paymentData, isHistorical }) => {
  const [showExportOptions, setShowExportOptions] = useState(false);
  const summary = calculateWeeklySummary(weekData);
  
  // Format the week range for display
  const formatWeekRange = () => {
    const { weekStart, weekEnd } = weekBounds;
    
    const startStr = weekStart.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
    
    const endStr = weekEnd.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    
    return `${startStr} - ${endStr}`;
  };
  
  // Handle export button click
  const handleExport = (format) => {
    // Convert week data to the format expected by exportToCSV
    const workData = weekData.reduce((acc, day) => {
      if (day.workStatus !== 'off') {
        acc[day.dateStr] = {
          workStatus: day.workStatus,
          hoursWorked: day.hoursWorked,
          payAmount: day.payAmount,
          jobsCompleted: day.jobsCompleted,
          hourlyRate: day.hourlyRate
        };
      }
      return acc;
    }, {});
    
    // Hide export options after exporting
    setShowExportOptions(false);
    
    // Export data in the selected format
    exportToCSV(workData, format);
  };
  
  // Calculate payment status colors
  const getPaymentStatusColor = () => {
    // Ensure we're using precise values for comparison
    const amountPaid = Math.round((paymentData.amountPaid || 0) * 100) / 100;
    const totalPay = Math.round(summary.totalPay * 100) / 100;
    
    if (!paymentData || amountPaid === 0) {
      return 'status-unpaid';
    } else if (amountPaid >= totalPay) {
      return 'status-paid';
    } else {
      return 'status-partial';
    }
  };
  
  // Get payment status text
  const getPaymentStatusText = () => {
    const amountPaid = Math.round((paymentData.amountPaid || 0) * 100) / 100;
    const totalPay = Math.round(summary.totalPay * 100) / 100;
    
    if (amountPaid >= totalPay) {
      return ' (Paid in full)';
    } else if (amountPaid > 0) {
      return ' (Partially paid)';
    } else {
      return ' (Unpaid)';
    }
  };
  
  return (
    <div className="weekly-summary card">
      <div className="summary-header">
        <h2>Weekly Summary</h2>
        <span>{formatWeekRange()}</span>
      </div>
      
      {isHistorical && (
        <div className="historical-indicator">
          Viewing historical week data
        </div>
      )}
      
      <div className="summary-stats">
        <div className="row">
          <div className="stat-item col">
            <h3>Total Hours</h3>
            <div className="stat-value">{summary.totalHours.toFixed(1)}h</div>
          </div>
          
          <div className="stat-item col">
            <h3>Total Pay</h3>
            <div className="stat-value">${summary.totalPay.toFixed(2)}</div>
          </div>
          
          <div className="stat-item col">
            <h3>Jobs Completed</h3>
            <div className="stat-value">{summary.totalJobs}</div>
          </div>
          
          <div className="stat-item col">
            <h3>Avg Hourly Rate</h3>
            <div className="stat-value">
              ${summary.avgHourlyRate.toFixed(2)}/hr
            </div>
          </div>
        </div>
        
        <div className="row payment-summary">
          <div className={`payment-status ${getPaymentStatusColor()}`}>
            <div className="stat-item">
              <h3>Payment Status</h3>
              <div className="stat-value">
                ${(paymentData.amountPaid || 0).toFixed(2)} / ${summary.totalPay.toFixed(2)}
                {getPaymentStatusText()}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {showExportOptions ? (
        <div className="export-options">
          <p className="export-prompt">Choose export format:</p>
          <div className="export-buttons">
            <button className="export-btn csv-btn" onClick={() => handleExport('csv')}>
              CSV Format
            </button>
            <button className="export-btn html-btn" onClick={() => handleExport('html')}>
              HTML Format
            </button>
          </div>
          <button className="cancel-btn" onClick={() => setShowExportOptions(false)}>
            Cancel
          </button>
        </div>
      ) : (
        <button className="export-btn" onClick={() => setShowExportOptions(true)}>
          Export Data
        </button>
      )}
    </div>
  );
};

export default WeeklySummary; 