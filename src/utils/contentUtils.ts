/**
 * Utility functions for content management and processing
 */

/**
 * Generate a URL-safe ID from a title string
 * @param title - The title to convert to an ID
 * @returns A URL-safe ID string
 */
export function generateIdFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
    .trim();
}
