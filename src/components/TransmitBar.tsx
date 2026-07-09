'use client'

import { FormEvent, useState } from 'react'
import type { AssistantState } from '@/types'

interface TransmitBarProps {
  state: AssistantState
  isSupported: boolean
  onSubmitText: (text: string) => void
  onVoiceMode: () => void
}

export function TransmitBar({ state, isSupported, onSubmitText, onVoiceMode }: TransmitBarProps) {
  const [text, setText] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed || state === 'processing') return
    onSubmitText(trimmed)
    setText('')
  }

  return (
    <div className="relative z-10 shrink-0 border-t-2 border-ink bg-paper px-4 sm:px-8 py-3 sm:py-4">
      <form onSubmit={handleSubmit} className="flex items-center gap-2 sm:gap-4 max-w-3xl">
        <button
          type="button"
          onClick={onVoiceMode}
          disabled={!isSupported}
          aria-label={isSupported ? 'Open the live voice channel' : 'Voice input not supported in this browser'}
          title={isSupported ? 'Open live voice channel' : 'Voice needs Chrome or Edge'}
          className="group relative shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 border-ink bg-signal text-paper
                     transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0
                     disabled:opacity-35 disabled:hover:translate-y-0 disabled:cursor-not-allowed
                     flex items-center justify-center"
        >
          {/* microphone glyph */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor" />
            <path d="M5 11a7 7 0 0 0 14 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M12 18v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <label htmlFor="transmit-input" className="sr-only">
          Type your transmission
        </label>
        <input
          id="transmit-input"
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type your transmission…"
          autoComplete="off"
          className="flex-1 min-w-0 bg-transparent border-b border-paper-line focus:border-ink
                     text-[15px] text-ink placeholder:text-ink-dim py-2 outline-none
                     focus-visible:outline-none transition-colors"
        />

        <button
          type="submit"
          disabled={!text.trim() || state === 'processing'}
          className="shrink-0 text-[11px] sm:text-xs tracking-tele uppercase font-semibold
                     border-2 border-ink px-3 sm:px-5 py-2.5 text-ink bg-transparent
                     transition-colors duration-150 hover:bg-ink hover:text-paper
                     disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-ink disabled:cursor-not-allowed"
        >
          Send&nbsp;&rarr;
        </button>
      </form>
    </div>
  )
}
