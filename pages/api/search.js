import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  const { postcode, radius = 5000 } = req.query
  if (!postcode) {
    return res.status(400).json({ error: 'Postcode is required' })
  }
  const norm = postcode.replace(/\s+/g, '').toUpperCase()
  const geoRes = await fetch(`https://api.postcodes.io/postcodes/${norm}`)
  const geoJson = await geoRes.json()
  if (!geoJson.result) {
    return res.status(400).json({ error: 'Invalid UK postcode' })
  }
  const { longitude, latitude } = geoJson.result

  const { data, error } = await supabase
    .rpc('search_practices', {
      _lon: longitude,
      _lat: latitude,
      _radius: parseInt(radius, 10),
    })

  if (error) {
    console.error(error)
    return res.status(500).json({ error: 'Database query failed' })
  }

  res.status(200).json({ practices: data })
}
