/**
 * User data structure
 */
export interface User {
  /**
   * Unique identifier for the user
   */
  id: string;
  
  /**
   * User's first name
   */
  firstName: string;
  
  /**
   * User's last name
   */
  lastName: string;
  
  /**
   * User's email address
   */
  email: string;
  
  /**
   * User's city
   */
  city: string;
  
  /**
   * Date when the user registered (YYYY-MM-DD format)
   */
  registeredDate: string;
  
  /**
   * User's full name (firstName + lastName)
   */
  fullName: string;
  
  /**
   * Days since registration
   */
  dsr: number;
}
