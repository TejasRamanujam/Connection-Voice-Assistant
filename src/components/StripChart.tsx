'use client'

import { useEffect, useRef } from 'react'
import type { AssistantState } from '@/types'

interface StripChartProps {
  state: AssistantState
  theme?: 'paper' | 'night'
  /** bump this number to inject a jolt of energy into the pen (e.g. on interim speech) */
  kick?: number
  /** stop the rAF loop entirely (e.g. when covered by the voice deck) */
  paused?: boolean
  className?: string
}

const INK = '#1C1A15'
const SIGNAL = '#D9420B'
const AMBER = '#FFB000'

/**
 * A continuously scrolling chart-recorder trace — the living instrument.
 * The pen sits at the right edge; paper scrolls left beneath it.
 * Its handwriting changes with the assistant state:
 *   idle      → flat carrier with a slow heartbeat blip
 *   listening → nervous, voice-fed jitter
 *   processing→ regular data bursts
 *   speaking  → syllabic speech envelope
 */
export function StripChart({ state, theme = 'paper', kick = 0, paused = false, className = '' }: StripChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const stateRef = useRef(state)
  const kickEnergy = useRef(0)
  const lastKick = useRef(kick)
  stateRef.current = state

  if (kick !== lastKick.current) {
    lastKick.current = kick
    kickEnergy.current = Math.min(1, kickEnergy.current + 0.55)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const SAMPLE_PX = 2
    let samples: number[] = []
    let cssW = 0
    let cssH = 0
    let dpr = 1
    let raf = 0
    let t = 0
    let env = 0.03
    let gridOffset = 0

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      cssW = Math.max(1, rect.width)
      cssH = Math.max(1, rect.height)
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(cssW * dpr)
      canvas.height = Math.round(cssH * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.ceil(cssW / SAMPLE_PX) + 2
      while (samples.length < count) samples.unshift(0)
      if (samples.length > count) samples = samples.slice(samples.length - count)
    }

    const carrier = (time: number) =>
      Math.sin(time * 11) * 0.62 + Math.sin(time * 23 + 1.3) * 0.27 + Math.sin(time * 47 + 4.1) * 0.11

    const targetEnv = (time: number): number => {
      switch (stateRef.current) {
        case 'listening': {
          const wander = 0.24 + 0.14 * Math.sin(time * 2.9) + (Math.random() - 0.5) * 0.1
          return Math.max(0.08, wander) + kickEnergy.current * 0.6
        }
        case 'processing':
          return Math.sin(time * 13) > 0.5 ? 0.58 : 0.05
        case 'speaking': {
          const syllable = Math.max(0, Math.sin(time * 3.6) * Math.sin(time * 1.15 + 0.6))
          return 0.1 + syllable * 0.62
        }
        default: {
          // idle: near-flat carrier with a heartbeat blip every ~4s
          const phase = time % 4.2
          const blip = Math.exp(-Math.pow(phase / 0.22, 2)) * 0.34
          return 0.022 + blip
        }
      }
    }

    const pushSample = (time: number) => {
      const rate = stateRef.current === 'processing' ? 0.3 : 0.08
      env += (targetEnv(time) - env) * rate
      kickEnergy.current *= 0.94
      const noise = (Math.random() - 0.5) * (stateRef.current === 'listening' ? 0.16 : 0.05)
      samples.push(carrier(time) * env + noise * env * 4)
      samples.shift()
    }

    const draw = () => {
      const night = theme === 'night'
      const trace = night ? AMBER : INK
      const grid = night ? 'rgba(255,176,0,0.13)' : 'rgba(28,26,21,0.10)'
      const mid = cssH / 2
      const amp = cssH * 0.42

      ctx.clearRect(0, 0, cssW, cssH)

      // ruled chart paper: center line + quarter lines + scrolling ticks
      ctx.lineWidth = 1
      ctx.strokeStyle = grid
      ctx.beginPath()
      ctx.moveTo(0, mid + 0.5)
      ctx.lineTo(cssW, mid + 0.5)
      ctx.moveTo(0, Math.round(cssH * 0.14) + 0.5)
      ctx.lineTo(cssW, Math.round(cssH * 0.14) + 0.5)
      ctx.moveTo(0, Math.round(cssH * 0.86) + 0.5)
      ctx.lineTo(cssW, Math.round(cssH * 0.86) + 0.5)
      ctx.stroke()

      const tickGap = 72
      ctx.beginPath()
      for (let x = -(gridOffset % tickGap); x < cssW; x += tickGap) {
        ctx.moveTo(Math.round(x) + 0.5, 0)
        ctx.lineTo(Math.round(x) + 0.5, cssH)
      }
      ctx.stroke()

      // the trace — soft halo pass, then the pen line
      const line = () => {
        ctx.beginPath()
        for (let i = 0; i < samples.length; i++) {
          const x = i * SAMPLE_PX
          const y = mid - samples[i] * amp
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
      }
      ctx.lineJoin = 'round'
      ctx.lineCap = 'round'
      if (night) {
        ctx.strokeStyle = 'rgba(255,176,0,0.28)'
        ctx.lineWidth = 4.5
        line()
      }
      ctx.strokeStyle = trace
      ctx.lineWidth = night ? 1.6 : 1.4
      line()

      // pen head at the right edge
      const last = samples[samples.length - 1] ?? 0
      ctx.fillStyle = night ? AMBER : SIGNAL
      ctx.beginPath()
      ctx.arc(cssW - SAMPLE_PX, mid - last * amp, night ? 3.2 : 2.6, 0, Math.PI * 2)
      ctx.fill()
    }

    const frame = () => {
      t += 1 / 60
      gridOffset += SAMPLE_PX * 2
      pushSample(t)
      pushSample(t + 1 / 120)
      draw()
      raf = requestAnimationFrame(frame)
    }

    resize()

    // pre-fill so the strip never starts blank
    for (let i = 0; i < samples.length; i++) {
      t += 1 / 60
      pushSample(t)
    }
    draw()

    const ro = new ResizeObserver(() => {
      resize()
      draw()
    })
    ro.observe(canvas)

    if (!reduceMotion && !paused) {
      raf = requestAnimationFrame(frame)
    }

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
    // theme/paused restart the loop; state flows through stateRef without restarting
  }, [theme, paused])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`block w-full h-full ${className}`}
    />
  )
}
