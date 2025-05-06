import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { formatDate } from '../utils/dateUtils';
import '../styles/Calendar.css';

const WorkCalendar = ({ workData, selectedDate, setSelectedDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Function to determine tile class based on work status
  const getTileClassName = ({ date, view }) => {
    if (view !== 'month') return '';
    
    const dateStr = formatDate(date);
    const dayData = workData[dateStr];
    
    if (!dayData) return '';
    
    return `work-status-${dayData.workStatus}`;
  };

  // Function to render custom content in calendar tiles
  const renderTileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    
    const dateStr = formatDate(date);
    const dayData = workData[dateStr];
    
    if (!dayData || dayData.workStatus === 'off') return null;
    
    return (
      <div className="tile-content">
        <div className="jobs-count">{dayData.jobsCompleted} jobs</div>
        <div className="pay-amount">${dayData.payAmount}</div>
      </div>
    );
  };

  return (
    <div className="calendar-container card">
      <h2>Work Calendar</h2>
      <Calendar 
        value={selectedDate}
        onChange={setSelectedDate}
        onActiveStartDateChange={({ activeStartDate }) => setCurrentMonth(activeStartDate)}
        tileClassName={getTileClassName}
        tileContent={renderTileContent}
        showNeighboringMonth={true}
        prev2Label={null}
        next2Label={null}
      />
    </div>
  );
};

export default WorkCalendar; 