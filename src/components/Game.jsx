import { useEffect, useRef, useState } from 'react'

// Very simple lane runner prototype: move bike left/right, avoid boxes. Sync position via WS.
export default function Game({ code, playerId }) {
  const canvasRef = useRef(null)
  const wsRef = useRef(null)
  const [others, setOthers] = useState({})

  useEffect(() => {
    const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
    const wsUrl = base.replace('http', 'ws') + `/ws/rooms/${code}`
    const ws = new WebSocket(wsUrl)
    wsRef.current = ws
    ws.onmessage = (evt) => {
      try {
        const msg = JSON.parse(evt.data)
        if (msg.type === 'state' && msg.payload?.pos && msg.player_id && msg.player_id !== playerId) {
          setOthers(prev => ({ ...prev, [msg.player_id]: msg.payload.pos }))
        }
      } catch {}
    }
    return () => ws.close()
  }, [code, playerId])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let running = true

    const state = {
      x: 150,
      y: 380,
      speed: 3,
      obstacles: [],
      tick: 0,
    }

    const lanes = [50, 150, 250]

    const onKey = (e) => {
      if (e.key === 'ArrowLeft') state.x = lanes[Math.max(0, lanes.indexOf(state.x) - 1)]
      if (e.key === 'ArrowRight') state.x = lanes[Math.min(lanes.length - 1, lanes.indexOf(state.x) + 1)]
      wsRef.current?.send(JSON.stringify({ type: 'state', player_id: playerId, payload: { pos: { x: state.x, y: state.y } } }))
    }
    window.addEventListener('keydown', onKey)

    function spawnObstacle() {
      const lane = lanes[Math.floor(Math.random()*lanes.length)]
      state.obstacles.push({ x: lane, y: -40 })
    }

    function loop() {
      if (!running) return
      state.tick++
      if (state.tick % 60 === 0) spawnObstacle()
      state.obstacles.forEach(o => o.y += state.speed)
      state.obstacles = state.obstacles.filter(o => o.y < 480)

      ctx.fillStyle = '#0f172a'
      ctx.fillRect(0,0,300,450)

      // road
      ctx.fillStyle = '#1f2937'
      ctx.fillRect(20,0,260,450)
      ctx.fillStyle = '#6b7280'
      for (let i=0;i<10;i++) ctx.fillRect(145, i*50 + (state.tick%50), 10, 30)

      // bike
      ctx.fillStyle = '#22d3ee'
      ctx.fillRect(state.x-15, state.y-20, 30, 40)

      // others
      ctx.fillStyle = '#a78bfa'
      Object.values(others).forEach(p => {
        ctx.fillRect(p.x-15, p.y-20, 30, 40)
      })

      // obstacles
      ctx.fillStyle = '#ef4444'
      state.obstacles.forEach(o => ctx.fillRect(o.x-15, o.y-15, 30, 30))

      requestAnimationFrame(loop)
    }
    requestAnimationFrame(loop)

    return () => {
      running = false
      window.removeEventListener('keydown', onKey)
    }
  }, [others, playerId])

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="bg-white/10 border border-white/10 rounded-2xl p-4">
        <canvas ref={canvasRef} width={300} height={450} className="block rounded bg-slate-900" />
        <p className="mt-3 text-center text-white/70 text-sm">Use left/right arrows to switch lanes. This is a lightweight prototype to showcase online play.</p>
      </div>
    </div>
  )
}
