'use client'
import { createClient } from '@/lib/supabase/client'

export type AnalyticsEvent =
  | 'profile_view'
  | 'contact_click'
  | 'book_click'
  | 'website_click'
  | 'phone_click'
  | 'instagram_click'

let _sessionId: string | null = null
function getSessionId(): string {
  if (!_sessionId) {
    _sessionId = Math.random().toString(36).slice(2) + Date.now().toString(36)
  }
  return _sessionId
}

export async function trackEvent(providerId: string, eventType: AnalyticsEvent): Promise<void> {
  try {
    const supabase = createClient()
    await supabase.from('provider_analytics').insert({
      provider_id: providerId,
      event_type: eventType,
      session_id: getSessionId(),
    })
  } catch {
    // never throw — analytics must never break the UI
  }
}
