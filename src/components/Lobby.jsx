import { useEffect, useState, useRef } from 'react'

export default function Lobby({ code, playerId, onStart }) {
  const [players, setPlayers] = useState([])
  const [status, setStatus] = useState('waiting')
  const wsRef = useRef(null)

  useEffect(() => {
    const fetchRoom = async () => {
      const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      const res = await fetch(`${base}/rooms/${code}`)
      if (res.ok) {
        const data = await res.json()
        setPlayers(data.players || [])
        setStatus(data.status)
      }
    }
    fetchRoom()
    const interval = setInterval(fetchRoom, 2000)

    const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
    const wsUrl = base.replace('http', 'ws') + `/ws/rooms/${code}`
    const ws = new WebSocket(wsUrl)
    wsRef.current = ws
    ws.onmessage = (evt) => {
      try {
        const msg = JSON.parse(evt.data)
        if (msg.type === 'state' && msg.payload?.players) {
          setPlayers(msg.payload.players)
        }
        if (msg.type === 'status' && msg.payload?.status) {
          setStatus(msg.payload.status)
        }
      } catch {}
    }
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'join', player_id: playerId }))
    }
    return () => {
      clearInterval(interval)
      ws.close()
    }
  }, [code, playerId])

  const start = async () => {
    const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
    await fetch(`${base}/rooms/start`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }) })
    wsRef.current?.send(JSON.stringify({ type: 'status', payload: { status: 'active' } }))
    onStart()
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white/10 border border-white/10 rounded-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Room {code}</h2>
          <span className="px-3 py-1 rounded-full text-sm bg-yellow-500/20 border border-yellow-500/30">{status}</span>
        </div>
        <p className="text-white/70 mb-4">Share this code with friends to join.</p>
        <div className="grid grid-cols-2 gap-3 mb-8">
          {players.map(p => (
            <div key={p} className="p-3 rounded bg-white/5 border border-white/10 text-sm break-all">{p}</div>
          ))}
          {players.length === 0 && <div className="text-white/50">Waiting for players...</div>}
        </div>
        <div className="flex gap-3">
          <button onClick={start} className="px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-400 font-semibold">Start Game</button>
        </div>
      </div>
    </div>
  )
}
