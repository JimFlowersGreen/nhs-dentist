import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req) {
  const { postcode, radius = 5000 } = req.query
  if (!postcode) {
    return new Response(JSON.stringify({ error: 'Postcode is required' }), { status: 400 })
  }
  const norm = postcode.replace(/\s+/g, '').toUpperCase()
  const geoRes = await fetch(`https://api.postcodes.io/postcodes/${norm}`)
  const geo = await geoRes.json()
  if (!geo.result) {
    return new Response(JSON.stringify({ error: 'Invalid UK postcode' }), { status: 400 })
  }
  const { longitude, latitude } = geo.result
  const { data, error } = await supabase
    .rpc('search_practices', { _lon: longitude, _lat: latitude, _radius: parseInt(radius,10) })
  if (error) {
    return new Response(JSON.stringify({ error: 'Database query failed' }), { status: 500 })
  }
  return new Response(JSON.stringify({ practices: data }), {
    headers: { 'Content-Type': 'application/json' }
  })
}
