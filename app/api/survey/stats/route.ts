import { redis } from '@/lib/redis'

export async function GET() {
  try {
    const stats = (await redis.hgetall('survey:stats')) ?? {}

    return Response.json({
      stats: {
        total:         Number(stats.total)         || 0,
        loveIt:        Number(stats.loveIt)        || 0,
        interested:    Number(stats.interested)    || 0,
        unsure:        Number(stats.unsure)        || 0,
        prefMascot:    Number(stats.prefMascot)    || 0,
        prefGames:     Number(stats.prefGames)     || 0,
        prefDashboard: Number(stats.prefDashboard) || 0,
        prefOffline:   Number(stats.prefOffline)   || 0,
      },
    })
  } catch (error) {
    console.error('❌ Redis stats error (network/service unavailable):', error)
    return new Response(
      JSON.stringify({ error: 'Stats service temporarily unavailable' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    )
  }
}