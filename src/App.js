import React, { useState, useEffect } from 'react';
import WorkCalendar from './components/WorkCalendar';
import DayDetails from './components/DayDetails';
import WeeklySummary from './components/WeeklySummary';
import PaymentTracker from './components/PaymentTracker';
import WeekHistory from './components/WeekHistory';
import { getWeekBounds, getWeekData, formatDate, calculateWeeklySummary } from './utils/dateUtils';
import { loadData, saveData, loadPaymentData, savePaymentData } from './utils/storage';
import './styles/index.css';

function App() {
  const [workData, setWorkData] = useState({});
  const [paymentData, setPaymentData] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekBounds, setWeekBounds] = useState(getWeekBounds(new Date()));
  const [viewingHistoricalWeek, setViewingHistoricalWeek] = useState(false);
  const [showWeekHistory, setShowWeekHistory] = useState(false);

  useEffect(() => {
    // Load data from localStorage on first render
    const savedData = loadData();
    if (savedData) {
      setWorkData(savedData);
    }
    
    // Load payment data
    const savedPaymentData = loadPaymentData();
    if (savedPaymentData) {
      setPaymentData(savedPaymentData);
    }
  }, []);

  useEffect(() => {
    // Update week bounds when selected date changes
    setWeekBounds(getWeekBounds(selectedDate));
  }, [selectedDate]);

  const updateWorkDay = (date, dayData) => {
    const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD format
    const newWorkData = {
      ...workData,
      [dateStr]: dayData
    };
    setWorkData(newWorkData);
    saveData(newWorkData);
  };

  const deleteWorkDay = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    const newWorkData = { ...workData };
    delete newWorkData[dateStr];
    setWorkData(newWorkData);
    saveData(newWorkData);
  };
  
  // Update payment data for a specific week
  const updatePaymentData = (weekId, weekPaymentData) => {
    // Clone the existing payment data
    const newPaymentData = {
      ...paymentData,
      [weekId]: {
        ...weekPaymentData,
        lastUpdated: new Date().toISOString()
      }
    };
    
    // Ensure current week has updated values
    const weekSummary = calculateWeeklySummary(weekData);
    newPaymentData[weekId].totalAmount = Math.round(weekSummary.totalPay * 100) / 100;
    newPaymentData[weekId].amountDue = Math.max(0, 
      Math.round((newPaymentData[weekId].totalAmount - newPaymentData[weekId].amountPaid) * 100) / 100
    );
    
    setPaymentData(newPaymentData);
    savePaymentData(newPaymentData);
  };

  // Handle selecting a week from history
  const handleSelectHistoricalWeek = (weekStartDate) => {
    setSelectedDate(new Date(weekStartDate));
    setViewingHistoricalWeek(true);
    setShowWeekHistory(false);
  };

  // Return to current week
  const returnToCurrentWeek = () => {
    setSelectedDate(new Date());
    setViewingHistoricalWeek(false);
  };

  // Toggle the week history panel
  const toggleWeekHistory = () => {
    setShowWeekHistory(!showWeekHistory);
  };

  // Get data for the current week
  const weekData = getWeekData(workData, weekBounds);
  
  // Generate a week ID for storing payment data
  const weekId = formatDate(weekBounds.weekStart);
  
  // Get current week's payment data
  const currentWeekPayment = paymentData[weekId] || {
    weekStart: formatDate(weekBounds.weekStart),
    weekEnd: formatDate(weekBounds.weekEnd),
    totalAmount: 0,
    amountPaid: 0,
    amountDue: 0,
    notes: '',
    lastUpdated: new Date().toISOString()
  };

  return (
    <div className="app-container">
      <h1>Glass Guy Pay Tracker</h1>
      
      <div className="week-navigation">
        {viewingHistoricalWeek && (
          <button className="btn btn-primary" onClick={returnToCurrentWeek}>
            Return to Current Week
          </button>
        )}
        <button 
          className={`btn ${showWeekHistory ? 'btn-secondary' : 'btn-primary'}`} 
          onClick={toggleWeekHistory}
        >
          {showWeekHistory ? 'Hide Week History' : 'View Week History'}
        </button>
      </div>
      
      {showWeekHistory && (
        <WeekHistory onSelectWeek={handleSelectHistoricalWeek} />
      )}
      
      <WeeklySummary 
        weekData={weekData} 
        weekBounds={weekBounds} 
        paymentData={currentWeekPayment}
        isHistorical={viewingHistoricalWeek}
      />
      
      <PaymentTracker
        weekBounds={weekBounds}
        weekData={weekData}
        paymentData={currentWeekPayment}
        updatePaymentData={(data) => updatePaymentData(weekId, data)}
        isHistorical={viewingHistoricalWeek}
      />
      
      <WorkCalendar 
        workData={workData}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      
      <DayDetails
        selectedDate={selectedDate}
        dayData={workData[selectedDate.toISOString().split('T')[0]] || {}}
        updateWorkDay={updateWorkDay}
        deleteWorkDay={deleteWorkDay}
      />
    </div>
  );
}

export default App;
