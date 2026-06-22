export type UserRole = 'client' | 'provider' | 'admin'
export type ProviderCategory =
  | 'venue' | 'catering' | 'photography' | 'videography'
  | 'dj' | 'live_music' | 'florist' | 'decorator' | 'cake'
  | 'hair_makeup' | 'planner' | 'transportation' | 'photo_booth'
  | 'entertainment' | 'lighting' | 'rentals' | 'officiant' | 'other'
export type SubscriptionStatus = 'trial' | 'active' | 'past_due' | 'cancelled' | 'inactive'
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'disputed'
export type PriceType = 'fixed' | 'starting_from' | 'per_hour' | 'per_person' | 'custom_quote'

export interface Profile {
  id: string
  role: UserRole
  full_name: string | null
  avatar_url: string | null
  phone: string | null
  created_at: string
  updated_at: string
}

export interface Provider {
  id: string
  user_id: string
  business_name: string
  slug: string
  category: ProviderCategory
  description: string | null
  tagline: string | null
  city: string | null
  state: string | null
  zip: string | null
  address: string | null
  website: string | null
  instagram: string | null
  facebook: string | null
  years_in_business: number | null
  min_price: number | null
  max_price: number | null
  cover_image_url: string | null
  logo_url: string | null
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  subscription_status: SubscriptionStatus
  subscription_plan: string
  commission_rate: number
  rating: number
  review_count: number
  is_featured: boolean
  is_verified: boolean
  is_active: boolean
  booking_enabled: boolean
  contact_email: string | null
  contact_phone: string | null
  created_at: string
  updated_at: string
  // joined
  provider_media?: ProviderMedia[]
  services?: Service[]
  reviews?: Review[]
}

export interface ProviderMedia {
  id: string
  provider_id: string
  url: string
  type: 'image' | 'video'
  caption: string | null
  is_cover: boolean
  sort_order: number
  created_at: string
}

export interface Service {
  id: string
  provider_id: string
  name: string
  description: string | null
  price: number | null
  price_type: PriceType
  duration_hrs: number | null
  min_guests: number | null
  max_guests: number | null
  is_active: boolean
  sort_order: number
  created_at: string
}

export interface Booking {
  id: string
  client_id: string
  provider_id: string
  service_id: string | null
  event_date: string
  event_end_date: string | null
  event_type: string | null
  guest_count: number | null
  venue_address: string | null
  total_amount: number
  platform_fee: number
  provider_amount: number
  status: BookingStatus
  stripe_payment_intent_id: string | null
export type ProviderCategory =
  | 'venue' | 'catering' | 'photography' | 'videography'
  | 'dj' | 'live_music' | 'florist' | 'decorator' | 'cake'
  | 'hair_makeup' | 'planner' | 'transportation' | 'photo_booth'
  | 'entertainment' | 'lighting' | 'rentals' | 'officiant' | 'other'
export type SubscriptionStatus = 'trial' | 'active' | 'past_due' | 'cancelled' | 'inactive'
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'disputed'
export type PriceType = 'fixed' | 'starting_from' | 'per_hour' | 'per_person' | 'custom_quote'

export interface Profile {
  id: string
  role: UserRole
  full_name: string | null
  avatar_url: string | null
  phone: string | null
  created_at: string
  updated_at: string
}

export interface Provider {
  id: string
  user_id: string
  business_name: string
  slug: string
  category: ProviderCategory
  description: string | null
  tagline: string | null
  city: string | null
  state: string | null
  zip: string | null
  address: string | null
  website: string | null
  instagram: string | null
  facebook: string | null
  years_in_business: number | null
  min_price: number | null
  max_price: number | null
  cover_image_url: string | null
  logo_url: string | null
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  subscription_status: SubscriptionStatus
  subscription_plan: string
  commission_rate: number
  rating: number
  review_count: number
  is_featured: boolean
  is_verified: boolean
  is_active: boolean
  booking_enabled: boolean
  contact_email: string | null
  contact_phone: string | null
  created_at: string
  updated_at: string
  provider_media?: ProviderMedia[]
  services?: Service[]
  reviews?: Review[]
}

export interface ProviderMedia {
  id: string
  provider_id: string
  url: string
  type: 'image' | 'video'
  caption: string | null
  is_cover: boolean
  sort_order: number
  created_at: string
}

export interface Service {
  id: string
  provider_id: string
  name: string
  description: string | null
  price: number | null
  price_type: PriceType
  duration_hrs: number | null
  min_guests: number | null
  max_guests: number | null
  is_active: boolean
  sort_order: number
  created_at: string
}

export interface Booking {
  id: string
  client_id: string
  provider_id: string
  service_id: string | null
  event_date: string
  event_end_date: string | null
  event_type: string | null
  guest_count: number | null
  venue_address: string | null
  total_amount: number
  platform_fee: number
  provider_amount: number
  status: BookingStatus
  stripe_payment_intent_id: string | null
  client_notes: string | null
  provider_notes: string | null
  created_at: string
  updated_at: string
  provider?: Provider
  service?: Service
  client?: Profile
}

export interface Review {
  id: string
  booking_id: string | null
  client_id: string
  provider_id: string
  rating: number
  title: string | null
  body: string | null
  response: string | null
  is_visible: boolean
  created_at: string
  client?: Profile
}

export interface Post {
  id: string
  provider_id: string
  title: string
  body: string | null
  image_url: string | null
  category: string | null
  published: boolean
  created_at: string
  updated_at: string
  provider?: Provider
}

export const CATEGORY_LABELS: Record<ProviderCategory, string> = {
  venue: 'Venues',
  catering: 'Catering',
  photography: 'Photography',
  videography: 'Videography',
  dj: 'DJ Services',
  live_music: 'Live Music',
  florist: 'Florists',
  decorator: 'Decorators',
  cake: 'Cakes & Desserts',
  hair_makeup: 'Hair & Makeup',
  planner: 'Event Planners',
  transportation: 'Transportation',
  photo_booth: 'Photo Booth',
  entertainment: 'Entertainment',
  lighting: 'Lighting',
  rentals: 'Rentals',
  officiant: 'Officiant',
  other: 'Other',
}

export const CATEGORY_ICONS: Record<ProviderCategory, string> = {
  venue: '🏛️',
  catering: '🍽️',
  photography: '📸',
  videography: '🎬',
  dj: '🎧',
  live_music: '🎸',
  florist: '🌸',
  decorator: '✨',
  cake: '🎂',
  hair_makeup: '💄',
  planner: '📋',
  transportation: '🚗',
  photo_booth: '📷',
  entertainment: '🎭',
  lighting: '💡',
  rentals: '🪑',
  officiant: '💍',
  other: '⭐',
  }
