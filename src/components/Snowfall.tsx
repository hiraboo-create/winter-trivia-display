import { useEffect, useRef } from 'react'

interface Flake {
  x: number
  y: number
  r: number
  speed: number
  drift: number
  opacity: number
}

export default function Snowfall() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const flakesRef = useRef<Flake[]>([])
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Initialise flakes
    flakesRef.current = Array.from({ length: 120 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 3 + 1,
      speed: Math.random() * 0.8 + 0.3,
      drift: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.6 + 0.2,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      flakesRef.current.forEach((f) => {
        ctx.beginPath()
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${f.opacity})`
        ctx.fill()

        f.y += f.speed
        f.x += f.drift

        if (f.y > canvas.height + 5) {
          f.y = -5
          f.x = Math.random() * canvas.width
        }
        if (f.x > canvas.width + 5) f.x = -5
        if (f.x < -5) f.x = canvas.width + 5
      })
      rafRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}
