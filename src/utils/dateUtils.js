// Get start and end dates for a week containing the given date
export const getWeekBounds = (date) => {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  
  const weekStart = new Date(date);
  weekStart.setDate(diff);
  weekStart.setHours(0, 0, 0, 0);
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  
  return { weekStart, weekEnd };
};

// Format a date as YYYY-MM-DD
export const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

// Get data for days within the given week bounds
export const getWeekData = (workData, weekBounds) => {
  const { weekStart, weekEnd } = weekBounds;
  const result = [];
  
  // Create array of all dates in the week
  const currentDate = new Date(weekStart);
  while (currentDate <= weekEnd) {
    const dateStr = formatDate(currentDate);
    const dayData = workData[dateStr] || { 
      workStatus: 'off',
      hoursWorked: 0,
      payAmount: 0,
      jobsCompleted: 0,
      hourlyRate: 0
    };
    
    result.push({
      date: new Date(currentDate),
      dateStr,
      ...dayData
    });
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return result;
};

// Calculate weekly summary from week data
export const calculateWeeklySummary = (weekData) => {
  const summary = weekData.reduce((acc, day) => {
    // Ensure precision by rounding to 2 decimal places
    const hoursWorked = Math.round((day.hoursWorked || 0) * 10) / 10;
    const payAmount = Math.round((day.payAmount || 0) * 100) / 100;
    const jobsCompleted = day.jobsCompleted || 0;
    
    return {
      totalHours: Math.round((acc.totalHours + hoursWorked) * 10) / 10,
      totalPay: Math.round((acc.totalPay + payAmount) * 100) / 100,
      totalJobs: acc.totalJobs + jobsCompleted
    };
  }, { totalHours: 0, totalPay: 0, totalJobs: 0 });
  
  // Calculate average hourly rate for the week
  if (summary.totalHours > 0) {
    // Ensure precision in hourly rate calculation
    summary.avgHourlyRate = Math.round((summary.totalPay / summary.totalHours) * 100) / 100;
  } else {
    summary.avgHourlyRate = 0;
  }
    
  return summary;
};

// Get a formatted day name
export const getDayName = (date) => {
  return new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
};

// Generate an array of days for the current month, including days from prev/next months to fill calendar
export const getDaysArray = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  
  // First day of month
  const firstDay = new Date(year, month, 1);
  const startingDayOfWeek = firstDay.getDay();
  
  // Last day of month
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  
  // Create array for all days to display
  const daysArray = [];
  
  // Add days from previous month to fill first row
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const dayDate = new Date(year, month - 1, prevMonthLastDay - i);
    daysArray.push({
      date: dayDate,
      day: prevMonthLastDay - i,
      isCurrentMonth: false
    });
  }
  
  // Add days from current month
  for (let i = 1; i <= daysInMonth; i++) {
    const dayDate = new Date(year, month, i);
    daysArray.push({
      date: dayDate,
      day: i,
      isCurrentMonth: true
    });
  }
  
  // Add days from next month to complete the grid
  const remainingCells = 42 - daysArray.length; // 6 rows x 7 days
  for (let i = 1; i <= remainingCells; i++) {
    const dayDate = new Date(year, month + 1, i);
    daysArray.push({
      date: dayDate,
      day: i,
      isCurrentMonth: false
    });
  }
  
  return daysArray;
}; 