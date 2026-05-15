// Types for NobiliView database schema

export type Plan = 'demo' | 'starter' | 'agency'
export type PropertyStatus = 'draft' | 'processing' | 'ready' | 'expired'
export type GenerationStatus = 'pending' | 'running' | 'succeeded' | 'failed'
export type TourStatus = 'active' | 'expired' | 'error'

export interface User {
  id: string
  email: string
  full_name?: string
  phone?: string
  company?: string
  plan: Plan
  credits: number
  stripe_customer_id?: string
  lemon_license_id?: string
  created_at: string
  updated_at: string
}

export interface Property {
  id: string
  user_id: string
  title: string
  address?: string
  city?: string
  postal_code?: string
  country: string
  status: PropertyStatus
  nb_rooms?: number
  nb_baths?: number
  surface_m2?: number
  photos_urls: string[]
  video_url?: string
  world_id?: string
  world_url?: string
  operation_id?: string
  generation_status: GenerationStatus
  expires_at?: string
  created_at: string
  updated_at: string
}

export interface Tour {
  id: string
  property_id: string
  title?: string
  world_id?: string
  cdn_url?: string
  thumbnail_url?: string
  status: TourStatus
  nb_views: number
  public_token: string
  expires_at?: string
  created_at: string
}

export interface Transaction {
  id: string
  user_id: string
  type: 'purchase' | 'refund' | 'credit_add'
  amount_cents: number
  currency: string
  lemon_order_id?: string
  lemon_product_id?: string
  credits_added?: number
  created_at: string
}