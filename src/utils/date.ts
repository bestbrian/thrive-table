import { DATE_FORMAT } from './constants';

/**
 * Formats a date string to a more readable format
 * @param dateString - The date string to format
 * @param locale - The locale to use for formatting (defaults to 'en-US')
 * @returns Formatted date string (e.g., "May 5, 2025")
 */
export function formatDate(dateString: string, locale = 'en-US'): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, DATE_FORMAT.SHORT);
}
