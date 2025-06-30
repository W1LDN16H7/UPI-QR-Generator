"use client"

import { useEffect, useState } from "react"

interface Star {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  speed: number
}

export function SpaceBackground() {
  const [stars, setStars] = useState<Star[]>([])

  useEffect(() => {
    // Create static stars
    const staticStars = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.8 + 0.2,
      speed: 0,
    }))

    // Create shooting stars
    const shootingStars = Array.from({ length: 3 }, (_, i) => ({
      id: i + 100,
      x: -10,
      y: Math.random() * 100,
      size: 1,
      opacity: 1,
      speed: Math.random() * 2 + 1,
    }))

    setStars([...staticStars, ...shootingStars])

    // Animate shooting stars
    const interval = setInterval(() => {
      setStars((prev) =>
        prev.map((star) => {
          if (star.speed > 0) {
            const newX = star.x + star.speed
            return newX > 110 ? { ...star, x: -10, y: Math.random() * 100 } : { ...star, x: newX }
          }
          return star
        }),
      )
    }, 50)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            boxShadow: star.speed > 0 ? `0 0 6px rgba(255,255,255,0.8)` : "none",
          }}
        />
      ))}
    </div>
  )
}
