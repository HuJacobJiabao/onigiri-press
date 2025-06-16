// Date formatting utilities for portfolio system

/**
 * Formats a date string or Date object to local yyyy-mm-dd format
 * @param dateString - The date string or Date object to format
 * @returns Formatted date string in yyyy-mm-dd format using local timezone
 */
export function formatDateForDisplay(dateString?: string | Date): string {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return String(dateString); // Fallback to original string if parsing fails
    }
    
    // Use local timezone to format as yyyy-mm-dd
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch {
    return String(dateString); // Fallback to original string if any error occurs
  }
}

/**
 * Formats a date for template variable replacement (used in markdown content)
 * @param dateString - The date string or Date object to format
 * @returns Formatted date string in yyyy-mm-dd format using local timezone
 */
export function formatDateForTemplate(dateString?: string | Date): string {
  return formatDateForDisplay(dateString);
}
