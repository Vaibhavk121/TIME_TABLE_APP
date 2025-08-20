import moment from "moment";

export const getCurrentDay = () => moment().format("ddd");

export const getCurrentTime = () => moment();

export const isCurrentDay = (dayName) => {
  return getCurrentDay() === dayName;
};

export const getCurrentPeriod = (periods) => {
  if (!periods || periods.length === 0) return null;
  
  const now = getCurrentTime();
  const currentTime = now.format("HH:mm");
  
  for (let i = 0; i < periods.length; i++) {
    const period = periods[i];
    const [startTime, endTime] = period.time.split("-");
    
    // Clean up time strings (remove AM/PM and extra spaces)
    const cleanStartTime = startTime.trim().replace(/\s*(AM|PM)/i, "");
    const cleanEndTime = endTime.trim().replace(/\s*(AM|PM)/i, "");
    
    // Convert to 24-hour format for comparison
    let startHour = parseInt(cleanStartTime.split(":")[0]);
    let startMinute = parseInt(cleanStartTime.split(":")[1]);
    let endHour = parseInt(cleanEndTime.split(":")[0]);
    let endMinute = parseInt(cleanEndTime.split(":")[1]);
    
    // Handle AM/PM conversion
    if (period.time.includes("PM") && startHour !== 12) startHour += 12;
    if (period.time.includes("PM") && endHour !== 12) endHour += 12;
    if (period.time.includes("AM") && startHour === 12) startHour = 0;
    if (period.time.includes("AM") && endHour === 12) endHour = 0;
    
    const periodStart = moment().set({ hour: startHour, minute: startMinute, second: 0 });
    const periodEnd = moment().set({ hour: endHour, minute: endMinute, second: 0 });
    
    if (now.isBetween(periodStart, periodEnd, null, '[]')) {
      return { period, index: i, status: 'current' };
    }
  }
  
  // Find next period
  for (let i = 0; i < periods.length; i++) {
    const period = periods[i];
    const [startTime] = period.time.split("-");
    const cleanStartTime = startTime.trim().replace(/\s*(AM|PM)/i, "");
    let startHour = parseInt(cleanStartTime.split(":")[0]);
    let startMinute = parseInt(cleanStartTime.split(":")[1]);
    
    if (period.time.includes("PM") && startHour !== 12) startHour += 12;
    if (period.time.includes("AM") && startHour === 12) startHour = 0;
    
    const periodStart = moment().set({ hour: startHour, minute: startMinute, second: 0 });
    
    if (now.isBefore(periodStart)) {
      return { period, index: i, status: 'next' };
    }
  }
  
  return null;
};

export const formatTimeForDisplay = (timeString) => {
  // Standardize time format
  return timeString.replace(/\s*(AM|PM)/gi, "").trim();
}; 