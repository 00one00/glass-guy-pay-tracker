import { createWorkHtmlTemplate, createPaymentHtmlTemplate } from './exportTemplates';

const STORAGE_KEY = 'gg_pay_tracker_data';
const PAYMENT_STORAGE_KEY = 'gg_pay_tracker_payments';

// Load data from localStorage
export const loadData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
    return {};
  }
};

// Save data to localStorage
export const saveData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
    return false;
  }
};

// Load payment data from localStorage
export const loadPaymentData = () => {
  try {
    const data = localStorage.getItem(PAYMENT_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error loading payment data from localStorage:', error);
    return {};
  }
};

// Save payment data to localStorage
export const savePaymentData = (data) => {
  try {
    localStorage.setItem(PAYMENT_STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving payment data to localStorage:', error);
    return false;
  }
};

// Export data to CSV
export const exportToCSV = (workData, exportFormat = 'csv') => {
  // Convert work data to array of objects
  const dataArray = Object.keys(workData).map(dateStr => ({
    date: dateStr,
    ...workData[dateStr]
  }));
  
  // Sort by date
  dataArray.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Create a human-readable date range
  const firstDate = new Date(dataArray[0]?.date || new Date());
  const lastDate = new Date(dataArray[dataArray.length - 1]?.date || new Date());
  const formattedFirstDate = firstDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const formattedLastDate = lastDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const dateRange = `${formattedFirstDate} to ${formattedLastDate}`;
  
  // Format date for better readability
  const formattedDataArray = dataArray.map(row => {
    const date = new Date(row.date);
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'short',
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      }),
      workStatus: row.workStatus === 'full' ? 'Full Day' : 
                 row.workStatus === 'half' ? 'Half Day' : 'Day Off',
      hoursWorked: `${parseFloat(row.hoursWorked).toFixed(1)}`,
      payAmount: `${parseFloat(row.payAmount).toFixed(2)}`,
      jobsCompleted: row.jobsCompleted,
      hourlyRate: `${parseFloat(row.hourlyRate).toFixed(2)}`
    };
  });
  
  // If HTML export is requested
  if (exportFormat === 'html') {
    // Generate HTML content
    const htmlContent = createWorkHtmlTemplate(formattedDataArray, dateRange);
    
    // Create download link
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const filename = `Glass Guy Work ${formattedFirstDate} to ${formattedLastDate}.html`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.display = 'none';
    
    // Append to document, trigger download, and clean up
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }
  
  // For CSV export
  // Define CSV columns with better labels
  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'workStatus', label: 'Work Type' },
    { key: 'hoursWorked', label: 'Hours Worked' },
    { key: 'payAmount', label: 'Pay Amount' },
    { key: 'jobsCompleted', label: 'Jobs Completed' },
    { key: 'hourlyRate', label: 'Hourly Rate' }
  ];
  
  // Create CSV header row with readable labels
  const headerRow = columns.map(col => col.label).join(',');
  
  // Create CSV data rows
  const dataRows = formattedDataArray.map(row => {
    return columns.map(column => {
      // Wrap values in quotes to handle commas within data
      const value = row[column.key];
      return `"${value}"`;
    }).join(',');
  });
  
  // Combine header and data rows
  const csvContent = [headerRow, ...dataRows].join('\n');
  
  // Create download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const filename = `Glass Guy Work ${formattedFirstDate} to ${formattedLastDate}.csv`;
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.display = 'none';
  
  // Append to document, trigger download, and clean up
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export payment data to CSV
export const exportPaymentsToCSV = (paymentData, exportFormat = 'csv') => {
  // Convert payment data to array of objects
  const dataArray = Object.keys(paymentData).map(weekId => ({
    weekId,
    ...paymentData[weekId]
  }));
  
  // Sort by week ID (which is the week start date)
  dataArray.sort((a, b) => new Date(a.weekId) - new Date(b.weekId));
  
  // Create a human-readable date range
  const firstDate = new Date(dataArray[0]?.weekStart || new Date());
  const lastDate = new Date(dataArray[dataArray.length - 1]?.weekEnd || new Date());
  const formattedFirstDate = firstDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const formattedLastDate = lastDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const dateRange = `${formattedFirstDate} to ${formattedLastDate}`;
  
  // Format dates and values for better readability
  const formattedDataArray = dataArray.map(row => {
    // Format week date range for better readability
    const weekStart = new Date(row.weekStart);
    const weekEnd = new Date(row.weekEnd);
    
    const weekPeriod = `${weekStart.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    })} to ${weekEnd.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })}`;
    
    // Determine payment status
    const amountPaid = parseFloat(row.amountPaid || 0);
    const totalAmount = parseFloat(row.totalAmount || 0);
    let paymentStatus = 'Unpaid';
    
    if (amountPaid >= totalAmount) {
      paymentStatus = 'Paid in Full';
    } else if (amountPaid > 0) {
      paymentStatus = 'Partially Paid';
    }
    
    return {
      weekPeriod,
      totalAmount: `$${totalAmount.toFixed(2)}`,
      amountPaid: `$${amountPaid.toFixed(2)}`,
      amountDue: `$${Math.max(0, totalAmount - amountPaid).toFixed(2)}`,
      paymentStatus,
      lastUpdated: row.lastUpdated ? new Date(row.lastUpdated).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) : '',
      notes: row.notes || ''
    };
  });
  
  // If HTML export is requested
  if (exportFormat === 'html') {
    // Generate HTML content
    const htmlContent = createPaymentHtmlTemplate(formattedDataArray, dateRange);
    
    // Create download link
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const filename = `Glass Guy Payments ${formattedFirstDate} to ${formattedLastDate}.html`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.display = 'none';
    
    // Append to document, trigger download, and clean up
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }
  
  // For CSV export
  // Define CSV columns with better labels
  const columns = [
    { key: 'weekPeriod', label: 'Week Period' },
    { key: 'totalAmount', label: 'Total Amount' },
    { key: 'amountPaid', label: 'Amount Paid' },
    { key: 'amountDue', label: 'Balance Due' },
    { key: 'paymentStatus', label: 'Payment Status' },
    { key: 'lastUpdated', label: 'Last Updated' },
    { key: 'notes', label: 'Payment Notes' }
  ];
  
  // Create CSV header row with readable labels
  const headerRow = columns.map(col => col.label).join(',');
  
  // Create CSV data rows
  const dataRows = formattedDataArray.map(row => {
    return columns.map(column => {
      // Wrap all values in quotes to handle commas within data
      const value = row[column.key] || '';
      return `"${value}"`;
    }).join(',');
  });
  
  // Combine header and data rows
  const csvContent = [headerRow, ...dataRows].join('\n');
  
  // Create download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const filename = `Glass Guy Payments ${formattedFirstDate} to ${formattedLastDate}.csv`;
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.display = 'none';
  
  // Append to document, trigger download, and clean up
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}; 