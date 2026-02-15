export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          username: string | null
          full_name: string | null
          avatar_url: string | null
          website: string | null
          role: 'patient' | 'doctor' | 'admin' | 'caretaker'
        }
        Insert: {
          id: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          role?: 'patient' | 'doctor' | 'admin' | 'caretaker'
        }
        Update: {
          id?: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          role?: 'patient' | 'doctor' | 'admin' | 'caretaker'
        }
      }
      vitals: {
        Row: {
          id: string
          user_id: string
          heart_rate: number | null
          systolic_bp: number | null
          diastolic_bp: number | null
          weight: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          heart_rate?: number | null
          systolic_bp?: number | null
          diastolic_bp?: number | null
          weight?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          heart_rate?: number | null
          systolic_bp?: number | null
          diastolic_bp?: number | null
          weight?: number | null
          created_at?: string
        }
      }
      emergency_contacts: {
        Row: {
          id: string
          user_id: string
          name: string
          phone: string
          relation: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          phone: string
          relation?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          phone?: string
          relation?: string | null
          created_at?: string
        }
      }
      reminders: {
        Row: {
          id: string
          user_id: string
          medicine_name: string
          dosage: string | null
          frequency: string | null
          time: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          medicine_name: string
          dosage?: string | null
          frequency?: string | null
          time?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          medicine_name?: string
          dosage?: string | null
          frequency?: string | null
          time?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
