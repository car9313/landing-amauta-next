import { redis } from '@/lib/redis'

const INTEREST_MAP: Record<string, string> = {
  high:   'loveIt',
  medium: 'interested',
  low:    'unsure',
}

const FEATURE_MAP: Record<string, string> = {
  mascot:    'prefMascot',
  games:     'prefGames',
  dashboard: 'prefDashboard',
  offline:   'prefOffline',
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { voteId, interest, feature, comments, name } = body

    if (!voteId || !interest || !feature) {
      return Response.json(
        { error: 'voteId, interest and feature are required' },
        { status: 400 }
      )
    }

    if (!INTEREST_MAP[interest] || !FEATURE_MAP[feature]) {
      return Response.json(
        { error: 'Invalid interest or feature value' },
        { status: 400 }
      )
    }

    // Deduplicación — evita doble conteo si el cliente reintenta
    const dedupKey = `survey:dedup:${voteId}`
    const isNew = await redis.setnx(dedupKey, '1')
    if (!isNew) {
      return Response.json({ success: true })
    }
    await redis.expire(dedupKey, 60 * 60 * 24)

    // Pipeline: 3 incrementos en una sola llamada HTTP a Upstash
    const pipeline = redis.pipeline()
    pipeline.hincrby('survey:stats', 'total', 1)
    pipeline.hincrby('survey:stats', INTEREST_MAP[interest], 1)
    pipeline.hincrby('survey:stats', FEATURE_MAP[feature], 1)

    if (comments || name) {
      pipeline.lpush(
        'survey:responses',
        JSON.stringify({
          voteId,
          interest,
          feature,
          comments: comments ?? '',
          name:     name     ?? '',
          createdAt: new Date().toISOString(),
        })
      )
    }

    await pipeline.exec()

    return Response.json({ success: true })
  } catch (error) {
    console.error('❌ Redis vote error (network/service unavailable):', error)
    return new Response(
      JSON.stringify({ error: 'Vote service temporarily unavailable' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    )
  }
}