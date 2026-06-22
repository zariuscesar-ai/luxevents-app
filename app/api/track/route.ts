import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { provider_id, event_type, session_id } = await req.json()
    if (!provider_id || !event_type) {
      return NextResponse.json({ error: 'missing fields' }, { status: 400 })
    }
    const supabase = await createClient()
    await supabase.from('provider_analytics').insert({ provider_id, event_type, session_id })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 })
  }
}
