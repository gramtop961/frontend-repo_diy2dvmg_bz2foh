import { useState } from 'react'
import Hero from './components/Hero'
import Lobby from './components/Lobby'
import Game from './components/Game'

function App() {
  const [phase, setPhase] = useState('home') // home | lobby | game
  const [code, setCode] = useState('')
  const [playerId, setPlayerId] = useState('')

  const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const createRoom = async ({ name, avatar }) => {
    const res = await fetch(`${base}/rooms/create`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, avatar }) })
    if (res.ok) {
      const data = await res.json()
      setCode(data.code)
      setPlayerId(data.player_id)
      setPhase('lobby')
    }
  }

  const joinRoom = async ({ name, avatar, code }) => {
    const res = await fetch(`${base}/rooms/join`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, avatar, code }) })
    if (res.ok) {
      const data = await res.json()
      setCode(data.code)
      setPlayerId(data.player_id)
      setPhase('lobby')
    }
  }

  if (phase === 'home') return <Hero onCreate={createRoom} onJoin={joinRoom} />
  if (phase === 'lobby') return <Lobby code={code} playerId={playerId} onStart={() => setPhase('game')} />
  if (phase === 'game') return <Game code={code} playerId={playerId} />

  return null
}

export default App
