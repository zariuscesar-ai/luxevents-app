'use client'
import { useEffect } from 'react'
import { trackEvent } from '@/lib/analytics'

export default function TrackView({ providerId }: { providerId: string }) {
  useEffect(() => {
    trackEvent(providerId, 'profile_view')
  }, [providerId])
  return null
}
