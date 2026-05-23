export type UserRole = "worker" | "employer";

export interface User {
  id: string;
  phone: string;
  name?: string;
  role: UserRole;
  is_verified: boolean;
}

export interface WorkerProfile {
  id: string;
  user_id: string;
  skill_category: string;
  experience_years: number;
  daily_wage: number;
  bio?: string;
  photo_url?: string;
  languages: string[];
  latitude?: number;
  longitude?: number;
  city?: string;
  is_available: boolean;
  is_verified: boolean;
  rating: number;
  total_reviews: number;
  completed_jobs: number;
  name?: string;
  phone?: string;
  distance_km?: number;
}

export interface EmployerProfile {
  id: string;
  user_id: string;
  company_name?: string;
  industry?: string;
  photo_url?: string;
  latitude?: number;
  longitude?: number;
  city?: string;
  rating: number;
  total_reviews: number;
  total_hires: number;
  is_verified: boolean;
  name?: string;
  phone?: string;
}

export interface Job {
  id: string;
  employer_id: string;
  title: string;
  skill_category: string;
  description?: string;
  workers_needed: number;
  daily_wage: number;
  duration_days: number;
  latitude: number;
  longitude: number;
  city?: string;
  address?: string;
  is_urgent: boolean;
  is_immediate: boolean;
  safety_equipment: boolean;
  start_time?: string;
  status: string;
  created_at: string;
  employer_name?: string;
  employer_company?: string;
  distance_km?: number;
  hires_count?: number;
}

export interface Hire {
  id: string;
  job_id: string;
  worker_id: string;
  employer_id: string;
  agreed_wage: number;
  status: string;
  note?: string;
  created_at: string;
  updated_at: string;
  job_title?: string;
  worker_name?: string;
  employer_name?: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  type?: string;
  ref_id?: string;
  is_read: boolean;
  created_at: string;
}

export interface Wallet {
  id: string;
  balance: number;
  total_earned: number;
  total_spent: number;
}

export interface Transaction {
  id: string;
  type: string;
  amount: number;
  description?: string;
  created_at: string;
}
