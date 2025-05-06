import React, { useState, useEffect } from 'react';
import { calculateWeeklySummary } from '../utils/dateUtils';
import { exportPaymentsToCSV } from '../utils/storage';

const PaymentTracker = ({ weekBounds, weekData, paymentData, updatePaymentData, isHistorical }) => {
  const [amountPaid, setAmountPaid] = useState(0);
  const [notes, setNotes] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);
  
  // Calculate total amount due for the week
  const summary = calculateWeeklySummary(weekData);
  const totalAmount = summary.totalPay;
  
  // Update local state when week or payment data changes
  useEffect(() => {
    setAmountPaid(paymentData.amountPaid || 0);
    setNotes(paymentData.notes || '');
  }, [weekBounds.weekStart, paymentData]);
  
  // Handle save button click
  const handleSave = () => {
    // Ensure we're using precise decimal values
    const newPaymentAmount = Math.round(amountPaid * 100) / 100;
    const currentAmountPaid = Math.round((paymentData.amountPaid || 0) * 100) / 100;
    const totalPaidAmount = Math.round((currentAmountPaid + newPaymentAmount) * 100) / 100;
    const preciseTotalAmount = Math.round(totalAmount * 100) / 100;
    const preciseAmountDue = Math.max(0, Math.round((preciseTotalAmount - totalPaidAmount) * 100) / 100);
    
    const updatedPaymentData = {
      ...paymentData,
      totalAmount: preciseTotalAmount,
      amountPaid: totalPaidAmount,
      amountDue: preciseAmountDue,
      notes: notes + (notes && currentAmountPaid > 0 ? '\n' : '') + 
             (currentAmountPaid > 0 && newPaymentAmount > 0 ? 
              `Added $${newPaymentAmount.toFixed(2)} on ${new Date().toLocaleDateString()}` : 
              '')
    };
    
    updatePaymentData(updatedPaymentData);
    setIsEditing(false);
    // Reset input field for next payment entry
    setAmountPaid(0);
  };
  
  // Handle export payments in the specified format
  const handleExport = (format) => {
    setShowExportOptions(false);
    exportPaymentsToCSV({ [weekBounds.weekStart.toISOString().split('T')[0]]: paymentData }, format);
  };
  
  // Format the payment status
  const getPaymentStatus = () => {
    // Ensure precision by rounding to 2 decimal places
    const amountPaidRounded = Math.round((paymentData.amountPaid || 0) * 100) / 100;
    const totalAmountRounded = Math.round(totalAmount * 100) / 100;
    
    if (amountPaidRounded === 0) {
      return { text: 'Unpaid', class: 'status-unpaid' };
    } else if (amountPaidRounded >= totalAmountRounded) {
      return { text: 'Paid in Full', class: 'status-paid' };
    } else {
      return { text: 'Partially Paid', class: 'status-partial' };
    }
  };
  
  const paymentStatus = getPaymentStatus();
  const paymentDate = paymentData.lastUpdated ? new Date(paymentData.lastUpdated) : null;
  
  return (
    <div className="payment-tracker card">
      <div className="summary-header">
        <h2>Payment Tracker</h2>
        <div className={`payment-status-indicator ${paymentStatus.class}`}>
          {paymentStatus.text}
        </div>
      </div>
      
      {isHistorical && (
        <div className="historical-indicator">
          Viewing historical payment record
        </div>
      )}
      
      <div className="payment-details">
        <div className="payment-row">
          <div>Total Amount:</div>
          <div><strong>${totalAmount.toFixed(2)}</strong></div>
        </div>
        <div className="payment-row">
          <div>Amount Paid:</div>
          <div><strong>${(paymentData.amountPaid || 0).toFixed(2)}</strong></div>
        </div>
        <div className="payment-row">
          <div>Balance Due:</div>
          <div>
            <strong>${Math.max(0, totalAmount - (paymentData.amountPaid || 0)).toFixed(2)}</strong>
          </div>
        </div>
        
        {paymentData.notes && (
          <div className="payment-notes">
            <strong>Notes:</strong>
            <p>{paymentData.notes}</p>
          </div>
        )}
        
        {paymentDate && (
          <div className="payment-timestamp">
            Last updated: {paymentDate.toLocaleString()}
          </div>
        )}
      </div>
      
      {!isHistorical && (
        <>
          {isEditing ? (
            <div className="payment-form">
              <div className="form-group">
                <label>Amount Paid:</label>
                <input 
                  type="number" 
                  step="0.01" 
                  min="0"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
                />
              </div>
              
              <div className="form-group">
                <label>Notes:</label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows="3"
                />
              </div>
              
              <div className="button-group">
                <button onClick={() => setIsEditing(false)}>Cancel</button>
                <button onClick={handleSave}>Save Payment</button>
              </div>
            </div>
          ) : (
            <div className="button-group">
              <button onClick={() => setIsEditing(true)}>Record Payment</button>
              {showExportOptions ? (
                <div className="export-options">
                  <button className="export-btn csv-btn" onClick={() => handleExport('csv')}>
                    CSV Format
                  </button>
                  <button className="export-btn html-btn" onClick={() => handleExport('html')}>
                    HTML Format
                  </button>
                  <button className="cancel-btn" onClick={() => setShowExportOptions(false)}>
                    Cancel
                  </button>
                </div>
              ) : (
                <button 
                  className="btn-secondary"
                  onClick={() => setShowExportOptions(true)}
                >
                  Export Payment
                </button>
              )}
            </div>
          )}
        </>
      )}
      
      {isHistorical && (
        <>
          {showExportOptions ? (
            <div className="export-options">
              <button className="export-btn csv-btn" onClick={() => handleExport('csv')}>
                CSV Format
              </button>
              <button className="export-btn html-btn" onClick={() => handleExport('html')}>
                HTML Format
              </button>
              <button className="cancel-btn" onClick={() => setShowExportOptions(false)}>
                Cancel
              </button>
            </div>
          ) : (
            <button 
              className="btn-secondary"
              onClick={() => setShowExportOptions(true)}
            >
              Export Payment
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default PaymentTracker; 