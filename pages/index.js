// pages/index.js
import { useState } from 'react'

export default function Home() {
  const [pc, setPc] = useState('')
  const [results, setResults] = useState([])

  const onSearch = async (e) => {
    e.preventDefault()
    const res = await fetch(`/api/search?postcode=${pc}&radius=5000`)
    const json = await res.json()
    setResults(json.practices || [])
  }

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>Find an NHS Dentist Near You</h1>
      <form onSubmit={onSearch} style={{ marginBottom: '1rem' }}>
        <input
          value={pc}
          onChange={e => setPc(e.target.value)}
          placeholder="Enter postcode"
          required
          style={{ padding: '0.5rem', width: '70%' }}
        />
        <button type="submit" style={{ padding: '0.5rem', marginLeft: '0.5rem' }}>
          Search
        </button>
      </form>
      <ul>
        {results.map((p, i) => (
          <li key={i}>
            <strong>{p.provider_name}</strong> ({p.postcode}) — UDA cap {p.uda_perf_target}, {p.distance_meters} m away
          </li>
        ))}
      </ul>
    </div>
  )
}
