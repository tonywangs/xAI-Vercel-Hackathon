// User registration types
export interface UserRegistration {
  phoneNumber: string;
  name: string;
  medicalInfo?: string;
  idScan?: File;
  emergencyContact?: string;
  age?: number;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface UserRegistrationResponse {
  success: boolean;
  userId?: string;
  message?: string;
}

// Alert types
export type AlertPriority = 'emergency' | 'warning' | 'info';
export type AlertMethod = 'text' | 'call';

export interface AlertTarget {
  type: 'all' | 'medical_condition' | 'age_group' | 'location' | 'custom';
  value?: string;
  conditions?: string[];
  ageRange?: {
    min: number;
    max: number;
  };
  location?: {
    latitude: number;
    longitude: number;
    radius: number; // in meters
  };
}

export interface AlertRequest {
  message: string;
  priority: AlertPriority;
  method: AlertMethod;
  target: AlertTarget;
  scheduledFor?: Date;
}

export interface AlertResponse {
  success: boolean;
  alertId?: string;
  recipientsCount?: number;
  message?: string;
}

// Common API response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
