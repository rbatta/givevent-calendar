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
          display_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          display_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          display_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      calendars: {
        Row: {
          id: string
          user_id: string
          name: string
          year: number
          start_date: string
          end_date: string
          total_budget: number
          min_amount: number
          max_amount: number
          status: 'draft' | 'active' | 'complete'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          year?: number
          start_date: string
          end_date: string
          total_budget: number
          min_amount: number
          max_amount: number
          status?: 'draft' | 'active' | 'complete'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          year?: number
          start_date?: string
          end_date?: string
          total_budget?: number
          min_amount?: number
          max_amount?: number
          status?: 'draft' | 'active' | 'complete'
          created_at?: string
          updated_at?: string
        }
      }
      charities: {
        Row: {
          id: string
          calendar_id: string
          name: string
          url: string
          notes: string | null
          scope: 'international' | 'national' | 'local' | null
          is_grand_prize: boolean
          grand_prize_amount: number | null
          created_at: string
        }
        Insert: {
          id?: string
          calendar_id: string
          name: string
          url: string
          notes?: string | null
          scope?: 'international' | 'national' | 'local' | null
          is_grand_prize?: boolean
          grand_prize_amount?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          calendar_id?: string
          name?: string
          url?: string
          notes?: string | null
          scope?: 'international' | 'national' | 'local' | null
          is_grand_prize?: boolean
          grand_prize_amount?: number | null
          created_at?: string
        }
      }
      amount_tiers: {
        Row: {
          id: string
          calendar_id: string
          amount: number
          count: number
          created_at: string
        }
        Insert: {
          id?: string
          calendar_id: string
          amount: number
          count: number
          created_at?: string
        }
        Update: {
          id?: string
          calendar_id?: string
          amount?: number
          count?: number
          created_at?: string
        }
      }
      calendar_days: {
        Row: {
          id: string
          calendar_id: string
          charity_id: string
          date: string
          amount: number
          is_grand_prize: boolean
          is_revealed: boolean
          is_paid: boolean
          charity_rerolls_used: number
          amount_rerolls_used: number
          revealed_at: string | null
          paid_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          calendar_id: string
          charity_id: string
          date: string
          amount: number
          is_grand_prize?: boolean
          is_revealed?: boolean
          is_paid?: boolean
          charity_rerolls_used?: number
          amount_rerolls_used?: number
          revealed_at?: string | null
          paid_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          calendar_id?: string
          charity_id?: string
          date?: string
          amount?: number
          is_grand_prize?: boolean
          is_revealed?: boolean
          is_paid?: boolean
          charity_rerolls_used?: number
          amount_rerolls_used?: number
          revealed_at?: string | null
          paid_at?: string | null
          created_at?: string
        }
      }
      charity_suggestions: {
        Row: {
          id: string
          name: string
          url: string
          scope: 'international' | 'national' | 'local'
          category: string
          description: string | null
          charity_navigator_rating: number | null
          charity_navigator_stars: number | null
          is_anchored: boolean
          times_selected: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          url: string
          scope: 'international' | 'national' | 'local'
          category: string
          description?: string | null
          charity_navigator_rating?: number | null
          charity_navigator_stars?: number | null
          is_anchored?: boolean
          times_selected?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          url?: string
          scope?: 'international' | 'national' | 'local'
          category?: string
          description?: string | null
          charity_navigator_rating?: number | null
          charity_navigator_stars?: number | null
          is_anchored?: boolean
          times_selected?: number
          created_at?: string
        }
      }
    }
  }
}
