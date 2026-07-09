'use client'

import { useEffect, useRef } from 'react'
import { StripChart } from './StripChart'
import type { AssistantState } from '@/types'

interface VoiceDeckProps {
  state: AssistantState
  interimTranscript: string
  lastReply: string
  error: string
  onKeyClick: () => void
  onClose: () => void
}

const STATE_WORD: Record<AssistantState, string> = {
  idle: 'Standby',
  listening: 'Listening',
  processing: 'Routing',
  speaking: 'Speaking',
}

const KEY_LABEL: Record<AssistantState, string> = {
  idle: 'Tap to talk',
  listening: 'Tap when done',
  processing: 'Tap to cancel',
  speaking: 'Tap to interrupt',
}

/**
 * The instrument's night face — full-screen live voice channel.
 * Amber phosphor on near-black; the same chart recorder, after dark.
 */
export function VoiceDeck({
  state,
  interimTranscript,
  lastReply,
  error,
  onKeyClick,
  onClose,
}: VoiceDeckProps) {
  const closeRef = useRef<HTMLButtonElement | null>(null)
  const kick = interimTranscript.length

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const caption = error
    ? error
    : state === 'listening'
      ? interimTranscript || 'Go ahead — the channel is open.'
      : state === 'speaking'
        ? lastReply
        : state === 'processing'
          ? 'Thinking down the wire…'
          : 'Channel idle. Tap the key to talk.'

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Live voice channel"
      className="deck fixed inset-0 z-50 bg-night text-bone flex flex-col animate-deck-in"
    >
      {/* header */}
      <div className="flex items-center justify-between px-4 sm:px-8 pt-4 sm:pt-6 shrink-0">
        <span className="flex items-center gap-2.5 text-[10px] sm:text-[11px] tracking-wide2 uppercase text-amber">
          <span className="inline-block w-2 h-2 rounded-full bg-amber animate-lamp" aria-hidden="true" />
          Live channel
        </span>
        <button
          ref={closeRef}
          onClick={onClose}
          className="text-[10px] sm:text-[11px] tracking-wide2 uppercase text-bone/70 hover:text-amber
                     border border-night-line hover:border-amber px-3 sm:px-4 py-2 transition-colors"
        >
          Close &times;
        </button>
      </div>

      {/* status word */}
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center px-6 text-center">
        <p
          key={state}
          className="font-display italic font-medium text-amber leading-none animate-word-in
                     text-[clamp(3rem,14vw,8.5rem)] select-none"
          aria-live="polite"
        >
          {STATE_WORD[state]}
        </p>

        <p
          className={`mt-6 sm:mt-8 max-w-xl mx-auto text-[13px] sm:text-[15px] leading-relaxed
                      max-h-28 sm:max-h-36 overflow-hidden [mask-image:linear-gradient(to_bottom,black_65%,transparent)]
                      ${error ? 'text-amber' : state === 'speaking' ? 'text-bone/85' : 'text-bone/55 italic'}`}
        >
          {caption}
          {state === 'listening' && (
            <span className="animate-caret text-amber" aria-hidden="true">▌</span>
          )}
        </p>
      </div>

      {/* night chart */}
      <div className="shrink-0 h-28 sm:h-40 border-y border-night-line relative">
        <StripChart state={state} theme="night" kick={kick} />
        <span className="absolute left-4 sm:left-8 top-2 text-[9px] sm:text-[10px] tracking-wide2 uppercase text-amber-dim">
          CH&#8211;01 &middot; voice trace
        </span>
      </div>

      {/* telegraph key */}
      <div className="shrink-0 flex flex-col items-center gap-3 py-6 sm:py-8">
        <button
          onClick={onKeyClick}
          aria-label={KEY_LABEL[state]}
          className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 transition-all duration-200
                      flex items-center justify-center
                      ${
                        state === 'listening'
                          ? 'border-amber bg-amber text-night scale-105'
                          : 'border-amber/60 bg-transparent text-amber hover:border-amber hover:scale-105'
                      }`}
        >
          {state === 'processing' ? (
            <span className="font-mono text-2xl leading-none animate-caret" aria-hidden="true">…</span>
          ) : state === 'speaking' ? (
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
              <rect x="6" y="6" width="12" height="12" fill="currentColor" />
            </svg>
          ) : (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor" />
              <path d="M5 11a7 7 0 0 0 14 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M12 18v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </button>
        <span className="text-[10px] sm:text-[11px] tracking-wide2 uppercase text-bone/50">
          {KEY_LABEL[state]}
        </span>
      </div>
    </div>
  )
}
