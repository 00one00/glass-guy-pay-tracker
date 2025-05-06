// Simple time calculator utility function
export const calculateHoursBetween = (startTime, endTime) => {
  if (!startTime || !endTime) return 0;
  
  console.log(`Calculating hours between ${startTime} and ${endTime}`);
  
  // Parse input times (format: "HH:MM")
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  
  // Convert to minutes since midnight
  const startInMinutes = (startHours * 60) + startMinutes;
  const endInMinutes = (endHours * 60) + endMinutes;
  
  // Calculate difference in minutes
  let diffMinutes;
  if (endInMinutes >= startInMinutes) {
    // Same day
    diffMinutes = endInMinutes - startInMinutes;
  } else {
    // Overnight (endTime is on the next day)
    diffMinutes = (24 * 60) - startInMinutes + endInMinutes;
  }
  
  // Convert to hours with 1 decimal place precision
  const hours = Math.round((diffMinutes / 60) * 10) / 10;
  console.log(`Result: ${diffMinutes} minutes = ${hours} hours`);
  
  return hours;
}; 