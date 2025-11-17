import { useState } from 'react'

export default function Hero({ onCreate, onJoin }) {
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState('')
  const [joinCode, setJoinCode] = useState('')

  const submitCreate = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    onCreate({ name: name.trim(), avatar: avatar.trim() || undefined })
  }

  const submitJoin = (e) => {
    e.preventDefault()
    if (!name.trim() || !joinCode.trim()) return
    onJoin({ name: name.trim(), avatar: avatar.trim() || undefined, code: joinCode.trim().toUpperCase() })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-sky-900 to-slate-800 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8">
        <div className="p-8 rounded-2xl bg-white/10 backdrop-blur border border-white/10">
          <h1 className="text-3xl font-bold mb-2">Rider Online</h1>
          <p className="text-white/80 mb-6">Multiplayer traffic rider vibes. Create a room and invite friends.</p>
          <form onSubmit={submitCreate} className="space-y-4">
            <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Your name" className="w-full px-4 py-3 rounded bg-white/10 border border-white/20 focus:outline-none" />
            <input value={avatar} onChange={(e)=>setAvatar(e.target.value)} placeholder="Avatar URL (optional)" className="w-full px-4 py-3 rounded bg-white/10 border border-white/20 focus:outline-none" />
            <button type="submit" className="w-full py-3 rounded bg-sky-500 hover:bg-sky-400 transition font-semibold">Create Room</button>
          </form>
        </div>
        <div className="p-8 rounded-2xl bg-white/10 backdrop-blur border border-white/10">
          <h2 className="text-2xl font-semibold mb-2">Join via Invite</h2>
          <p className="text-white/80 mb-6">Got a code? Jump right in.</p>
          <form onSubmit={submitJoin} className="space-y-4">
            <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Your name" className="w-full px-4 py-3 rounded bg-white/10 border border-white/20 focus:outline-none" />
            <input value={avatar} onChange={(e)=>setAvatar(e.target.value)} placeholder="Avatar URL (optional)" className="w-full px-4 py-3 rounded bg-white/10 border border-white/20 focus:outline-none" />
            <input value={joinCode} onChange={(e)=>setJoinCode(e.target.value)} placeholder="Room code" className="w-full px-4 py-3 rounded bg-white/10 border border-white/20 focus:outline-none uppercase tracking-widest" />
            <button type="submit" className="w-full py-3 rounded bg-emerald-500 hover:bg-emerald-400 transition font-semibold">Join Room</button>
          </form>
        </div>
      </div>
    </div>
  )
}
