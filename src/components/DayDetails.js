import React, { useState, useEffect } from 'react';
import { formatDate } from '../utils/dateUtils';
import { calculateHoursBetween } from './TimeCalculator';

const DayDetails = ({ selectedDate, dayData, updateWorkDay, deleteWorkDay }) => {
  const [workStatus, setWorkStatus] = useState('off');
  const [jobsCompleted, setJobsCompleted] = useState(0);
  const [hoursWorked, setHoursWorked] = useState(0);
  const [payAmount, setPayAmount] = useState(0);
  const [hourlyRate, setHourlyRate] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [useCustomHours, setUseCustomHours] = useState(false);
  
  // Update local state when selected date or day data changes
  useEffect(() => {
    const defaultData = {
      workStatus: 'off',
      jobsCompleted: 0,
      hoursWorked: 0,
      payAmount: 0,
      hourlyRate: 0,
      startTime: '',
      endTime: ''
    };
    
    const currentData = { ...defaultData, ...dayData };
    
    setWorkStatus(currentData.workStatus);
    setJobsCompleted(currentData.jobsCompleted);
    setHoursWorked(currentData.hoursWorked);
    setPayAmount(currentData.payAmount);
    setHourlyRate(currentData.hourlyRate);
    setStartTime(currentData.startTime || '');
    setEndTime(currentData.endTime || '');
    setUseCustomHours(!!currentData.startTime);
    
    // Automatically enter edit mode if no data exists for this day
    setIsEditing(!dayData.workStatus || dayData.workStatus === 'off');
  }, [selectedDate, dayData]);
  
  // Update hours worked and hourly rate based on times
  const updateHoursAndRate = () => {
    if (startTime && endTime) {
      // Calculate hours between the times
      const calculatedHours = calculateHoursBetween(startTime, endTime);
      setHoursWorked(calculatedHours);
      
      // Calculate hourly rate if hours > 0
      if (calculatedHours > 0) {
        const rate = Math.round((payAmount / calculatedHours) * 100) / 100;
        setHourlyRate(rate);
      } else {
        setHourlyRate(0);
      }
    }
  };
  
  // Calculate pay amount and hourly rate when work status changes
  const handleWorkStatusChange = (status) => {
    setWorkStatus(status);
    
    // Get base pay amount based on work status
    let pay = 0;
    switch (status) {
      case 'full':
        pay = 150;
        break;
      case 'half':
        pay = 75;
        break;
      default:
        pay = 0;
    }
    
    setPayAmount(pay);
    
    if (!useCustomHours) {
      // Default hours based on status
      let hours = 0;
      
      switch (status) {
        case 'full':
          hours = 8;
          break;
        case 'half':
          hours = 4;
          break;
        default:
          hours = 0;
      }
      
      setHoursWorked(hours);
      setHourlyRate(hours > 0 ? pay / hours : 0);
    } else if (startTime && endTime) {
      // Recalculate hours and rate with the new pay amount
      updateHoursAndRate();
    }
  };
  
  // Handle start time change
  const handleStartTimeChange = (value) => {
    setStartTime(value);
    setUseCustomHours(!!value);
    
    if (value && endTime) {
      updateHoursAndRate();
    }
  };
  
  // Handle end time change
  const handleEndTimeChange = (value) => {
    setEndTime(value);
    setUseCustomHours(!!value);
    
    if (startTime && value) {
      updateHoursAndRate();
    }
  };
  
  // Update jobsCompleted state
  const handleJobsChange = (jobs) => {
    const numJobs = parseInt(jobs) || 0;
    setJobsCompleted(numJobs);
  };
  
  // Save changes to the selected day
  const handleSave = () => {
    // If using custom times, ensure hours and rate are calculated correctly
    if (useCustomHours && startTime && endTime) {
      const calculatedHours = calculateHoursBetween(startTime, endTime);
      const calculatedRate = calculatedHours > 0 ? Math.round((payAmount / calculatedHours) * 100) / 100 : 0;
      
      const updatedData = {
        workStatus,
        jobsCompleted,
        hoursWorked: calculatedHours,
        payAmount,
        hourlyRate: calculatedRate,
        startTime,
        endTime
      };
      
      console.log("Saving work day data:", updatedData);
      updateWorkDay(selectedDate, updatedData);
    } else {
      const updatedData = {
        workStatus,
        jobsCompleted,
        hoursWorked,
        payAmount,
        hourlyRate,
        startTime: useCustomHours ? startTime : '',
        endTime: useCustomHours ? endTime : ''
      };
      
      console.log("Saving work day data:", updatedData);
      updateWorkDay(selectedDate, updatedData);
    }
    
    setIsEditing(false);
  };
  
  // Delete the day entry
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this day?')) {
      deleteWorkDay(selectedDate);
      setIsEditing(false);
    }
  };
  
  // Format date for display
  const formattedDate = selectedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <div className="day-details card">
      <h2>Day Details</h2>
      <h3>{formattedDate}</h3>
      
      {isEditing ? (
        <div className="day-form">
          <div className="form-group">
            <label>Work Status:</label>
            <div className="work-status-buttons">
              <button 
                className={`status-btn ${workStatus === 'full' ? 'active' : ''}`}
                onClick={() => handleWorkStatusChange('full')}
              >
                Full Day ($150)
              </button>
              <button 
                className={`status-btn ${workStatus === 'half' ? 'active' : ''}`}
                onClick={() => handleWorkStatusChange('half')}
              >
                Half Day ($75)
              </button>
              <button 
                className={`status-btn ${workStatus === 'off' ? 'active' : ''}`}
                onClick={() => handleWorkStatusChange('off')}
              >
                Day Off
              </button>
            </div>
          </div>
          
          {workStatus !== 'off' && (
            <>
              <div className="form-group">
                <label htmlFor="jobs-completed">Jobs Completed:</label>
                <input
                  id="jobs-completed"
                  type="number"
                  min="0"
                  value={jobsCompleted}
                  onChange={(e) => handleJobsChange(e.target.value)}
                />
              </div>
              
              <div className="form-group time-input-group">
                <label>Time Worked (Optional):</label>
                <div className="time-inputs">
                  <div className="time-input">
                    <label htmlFor="start-time">Start Time:</label>
                    <input
                      id="start-time"
                      type="time"
                      value={startTime}
                      onChange={(e) => handleStartTimeChange(e.target.value)}
                    />
                  </div>
                  <div className="time-input">
                    <label htmlFor="end-time">End Time:</label>
                    <input
                      id="end-time"
                      type="time"
                      value={endTime}
                      onChange={(e) => handleEndTimeChange(e.target.value)}
                    />
                  </div>
                </div>
                <div className="hours-worked">
                  <strong>Hours Worked:</strong> {hoursWorked.toFixed(1)}h
                  {hoursWorked > 0 && (
                    <>
                      <div><strong>Hourly Rate:</strong> ${hourlyRate.toFixed(2)}/hr</div>
                      {startTime && endTime && (
                        <div className="debug-info" style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px' }}>
                          Calculated from {startTime} to {endTime}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </>
          )}
          
          <div className="button-group">
            <button onClick={handleSave}>Save</button>
            {dayData.workStatus && dayData.workStatus !== 'off' && (
              <button className="btn-secondary" onClick={handleDelete}>Delete</button>
            )}
            <button className="btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="day-summary">
          {workStatus === 'off' ? (
            <p>No work scheduled for this day.</p>
          ) : (
            <>
              <div className="summary-row">
                <span>Work Status:</span>
                <span>{workStatus === 'full' ? 'Full Day' : 'Half Day'}</span>
              </div>
              {startTime && endTime && (
                <div className="summary-row">
                  <span>Time Worked:</span>
                  <span>{startTime} - {endTime}</span>
                </div>
              )}
              <div className="summary-row">
                <span>Hours Worked:</span>
                <span>{hoursWorked.toFixed(1)}</span>
              </div>
              <div className="summary-row">
                <span>Pay Amount:</span>
                <span>${payAmount.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Jobs Completed:</span>
                <span>{jobsCompleted}</span>
              </div>
              <div className="summary-row">
                <span>Hourly Rate:</span>
                <span>${hourlyRate.toFixed(2)}/hr</span>
              </div>
            </>
          )}
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </div>
      )}
    </div>
  );
};

export default DayDetails; 