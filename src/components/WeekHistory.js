import React, { useState, useEffect } from 'react';
import { loadData, loadPaymentData } from '../utils/storage';
import { getWeekBounds, getWeekData, formatDate, calculateWeeklySummary } from '../utils/dateUtils';
import '../styles/WeekHistory.css';

const WeekHistory = ({ onSelectWeek }) => {
  const [availableWeeks, setAvailableWeeks] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(null);
  
  useEffect(() => {
    const workData = loadData();
    const paymentData = loadPaymentData();
    
    if (Object.keys(workData).length === 0) {
      return;
    }
    
    // Extract all dates with work data
    const allDates = Object.keys(workData).map(date => new Date(date));
    
    // Sort dates chronologically
    allDates.sort((a, b) => a - b);
    
    // Find all unique weeks that have data
    const weeks = new Set();
    allDates.forEach(date => {
      const { weekStart } = getWeekBounds(date);
      weeks.add(formatDate(weekStart));
    });
    
    // Convert to array and add payment status
    const weeksArray = Array.from(weeks).map(weekStartStr => {
      const weekStart = new Date(weekStartStr);
      const weekBounds = getWeekBounds(weekStart);
      const weekData = getWeekData(workData, weekBounds);
      const summary = calculateWeeklySummary(weekData);
      
      const weekId = formatDate(weekBounds.weekStart);
      const paymentInfo = paymentData[weekId] || { 
        amountPaid: 0, 
        totalAmount: summary.totalPay 
      };
      
      // Determine payment status
      let paymentStatus = 'unpaid';
      if (paymentInfo.amountPaid >= paymentInfo.totalAmount) {
        paymentStatus = 'paid';
      } else if (paymentInfo.amountPaid > 0) {
        paymentStatus = 'partial';
      }
      
      return {
        weekId,
        weekStart: weekBounds.weekStart,
        weekEnd: weekBounds.weekEnd,
        totalPay: summary.totalPay,
        totalHours: summary.totalHours,
        totalJobs: summary.totalJobs,
        amountPaid: paymentInfo.amountPaid || 0,
        paymentStatus
      };
    });
    
    // Sort weeks chronologically (most recent first)
    weeksArray.sort((a, b) => new Date(b.weekStart) - new Date(a.weekStart));
    setAvailableWeeks(weeksArray);
    
    // Default selection to the most recent week
    if (weeksArray.length > 0) {
      setSelectedWeek(weeksArray[0]);
    }
  }, []);
  
  const handleWeekClick = (week) => {
    setSelectedWeek(week);
    if (onSelectWeek) {
      onSelectWeek(week.weekStart);
    }
  };
  
  const formatDateRange = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
  };
  
  return (
    <div className="week-history">
      <h2>Week History</h2>
      {availableWeeks.length === 0 ? (
        <p>No historical data available</p>
      ) : (
        <div className="weeks-list">
          {availableWeeks.map(week => (
            <div 
              key={week.weekId}
              className={`week-item ${selectedWeek && selectedWeek.weekId === week.weekId ? 'selected' : ''} ${week.paymentStatus}`}
              onClick={() => handleWeekClick(week)}
            >
              <div className="week-date-range">{formatDateRange(week.weekStart, week.weekEnd)}</div>
              <div className="week-summary">
                <div><strong>${week.totalPay.toFixed(2)}</strong> for {week.totalHours} hours</div>
                <div>{week.totalJobs} jobs completed</div>
              </div>
              <div className={`payment-status ${week.paymentStatus}`}>
                {week.paymentStatus === 'paid' && 'Paid in Full'}
                {week.paymentStatus === 'partial' && `Partially Paid ($${week.amountPaid.toFixed(2)})`}
                {week.paymentStatus === 'unpaid' && 'Unpaid'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WeekHistory; 