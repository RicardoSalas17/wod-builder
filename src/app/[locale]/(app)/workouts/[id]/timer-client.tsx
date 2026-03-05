'use client';

import { useEffect, useMemo, useState, useRef } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type TimerCopy = {
  title: string;
  mode: string;
  emom: string;
  amrap: string;
  forTime: string;
  intervalSeconds: string;
  rounds: string;
  durationMinutes: string;
  start: string;
  pause: string;
  reset: string;
  statusIdle: string;
  statusRunning: string;
  statusPaused: string;
  statusFinished: string;
  roundLabel: string;
  timeRemaining: string;
  timeElapsed: string;
  announceStart: string;
  announcePause: string;
  announceReset: string;
  announceTen: string;
  announceComplete: string;
  soundToggle: string;
  soundOn: string;
  soundOff: string;
};

type TimerClientProps = {
  copy: TimerCopy;
};

type TimerMode = 'emom' | 'amrap' | 'fortime';

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function TimerClient({ copy }: TimerClientProps) {
  const [mode, setMode] = useState<TimerMode>('amrap');
  const [amrapMinutes, setAmrapMinutes] = useState(12);
  const [emomInterval, setEmomInterval] = useState(60);
  const [emomRounds, setEmomRounds] = useState(12);
  const [elapsed, setElapsed] = useState(0);
  const [status, setStatus] = useState<
    'idle' | 'running' | 'paused' | 'finished'
  >('idle');
  const [announcement, setAnnouncement] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(false);

  const modeLabel =
    mode === 'emom' ? copy.emom : mode === 'amrap' ? copy.amrap : copy.forTime;

  const statusChipClass = {
    idle: 'border-border/60 bg-background text-muted-foreground',
    running: 'border-accent/60 bg-accent/10 text-accent',
    paused: 'border-border/60 bg-muted/40 text-muted-foreground',
    finished: 'border-foreground bg-foreground text-background',
  }[status];

  const modeChipClass = 'border-accent/60 bg-accent/10 text-accent';

  const audioContextRef = useRef<AudioContext | null>(null);

  const ensureAudioContext = async () => {
    if (typeof window === 'undefined') return;
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }
  };

  const playBeep = async (durationMs = 180, frequency = 880) => {
    if (!soundEnabled) return;
    await ensureAudioContext();
    const ctx = audioContextRef.current;
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    gain.gain.value = 0.04;

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + durationMs / 1000);
  };

  const totalSeconds = useMemo(() => {
    if (mode === 'amrap') return amrapMinutes * 60;
    if (mode === 'emom') return emomInterval * emomRounds;
    return null;
  }, [mode, amrapMinutes, emomInterval, emomRounds]);

  const remainingSeconds =
    totalSeconds === null ? null : Math.max(totalSeconds - elapsed, 0);

  const displayTime =
    mode === 'fortime'
      ? formatTime(elapsed)
      : formatTime(remainingSeconds ?? 0);

  const roundInfo = useMemo(() => {
    if (mode !== 'emom') return null;
    const round = Math.min(Math.floor(elapsed / emomInterval) + 1, emomRounds);
    const roundRemaining = emomInterval - (elapsed % emomInterval || 0);
    return { round, roundRemaining };
  }, [mode, elapsed, emomInterval, emomRounds]);

  useEffect(() => {
    if (status !== 'running') return;

    const id = setInterval(() => {
      setElapsed((value) => value + 1);
    }, 1000);

    return () => clearInterval(id);
  }, [status]);

  useEffect(() => {
    if (status !== 'running') return;
    if (totalSeconds !== null && elapsed >= totalSeconds) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus('finished');
      setAnnouncement(copy.announceComplete);
      playBeep(600, 520);
    }
  }, [elapsed, status, totalSeconds, copy.announceComplete]);

  useEffect(() => {
    if (status !== 'running') return;
    if (remainingSeconds === 10) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAnnouncement(copy.announceTen);
      playBeep(200, 880);
    }
  }, [remainingSeconds, status, copy.announceTen]);

  const startTimer = () => {
    if (soundEnabled) {
      void ensureAudioContext();
    }
    if (status === 'finished') {
      setElapsed(0);
    }
    setStatus('running');
    setAnnouncement(copy.announceStart);
  };

  const pauseTimer = () => {
    setStatus('paused');
    setAnnouncement(copy.announcePause);
  };

  const resetTimer = () => {
    setStatus('idle');
    setElapsed(0);
    setAnnouncement(copy.announceReset);
  };

  const statusLabel =
    status === 'running'
      ? copy.statusRunning
      : status === 'paused'
        ? copy.statusPaused
        : status === 'finished'
          ? copy.statusFinished
          : copy.statusIdle;

  return (
    <Card className="bg-muted/40">
      <CardHeader>
        <CardTitle>{copy.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="sr-only" aria-live="polite">
          {announcement}
        </div>

        <fieldset className="space-y-2">
          <legend className="text-sm font-semibold">{copy.mode}</legend>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'emom', label: copy.emom },
              { value: 'amrap', label: copy.amrap },
              { value: 'fortime', label: copy.forTime },
            ].map((item) => (
              <label  key={item.value} className="cursor-pointer">
              <input
                type="radio"
                name="timer-mode"
                value={item.value}
                checked={mode === item.value}
                onChange={() => {
                  setMode(item.value as TimerMode);
                  setElapsed(0);
                  setStatus("idle");
                }}
                className="peer sr-only"
              />
              <span className="inline-flex items-center rounded-full border border-border/60 px-3 py-1 text-sm transition peer-checked:border-accent/60 peer-checked:bg-accent/10 peer-checked:text-accent peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-accent">
                {item.label}
              </span>
            </label>
            ))}
          </div>
        </fieldset>

        {mode === 'amrap' && (
          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold">
              {copy.durationMinutes}
            </label>
            <input
              type="number"
              min={1}
              className="border-border/60 focus-visible:ring-accent w-24 rounded-md border bg-transparent px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
              value={amrapMinutes}
              onChange={(e) => {
                setAmrapMinutes(Number(e.target.value));
                setElapsed(0);
                setStatus('idle');
              }}
            />
          </div>
        )}

        {mode === 'emom' && (
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-sm font-semibold">
              {copy.intervalSeconds}
            </label>
            <input
              type="number"
              min={10}
              className="border-border/60 focus-visible:ring-accent w-24 rounded-md border bg-transparent px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
              value={emomInterval}
              onChange={(e) => {
                setEmomInterval(Number(e.target.value));
                setElapsed(0);
                setStatus('idle');
              }}
            />
            <label className="text-sm font-semibold">{copy.rounds}</label>
            <input
              type="number"
              min={1}
              className="border-border/60 focus-visible:ring-accent w-24 rounded-md border bg-transparent px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
              value={emomRounds}
              onChange={(e) => {
                setEmomRounds(Number(e.target.value));
                setElapsed(0);
                setStatus('idle');
              }}
            />
          </div>
        )}

        <div className="border-accent/60 bg-background rounded-2xl border px-6 py-6 text-center">
          <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
            {mode === 'fortime' ? copy.timeElapsed : copy.timeRemaining}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-[0.65rem] font-semibold tracking-[0.2em] uppercase">
            <span className={`rounded-full border px-3 py-1 ${modeChipClass}`}>
              {modeLabel}
            </span>
          </div>

          <div className="mt-2 text-4xl font-semibold">{displayTime}</div>
          {roundInfo && (
            <p className="text-muted-foreground mt-2 text-sm">
              {copy.roundLabel} {roundInfo.round} ·{' '}
              {formatTime(roundInfo.roundRemaining)}
            </p>
          )}
          <p className="text-accent mt-2 text-xs tracking-[0.2em] uppercase">
            {statusLabel}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {status === 'running' ? (
            <Button onClick={pauseTimer}>{copy.pause}</Button>
          ) : (
            <Button onClick={startTimer}>{copy.start}</Button>
          )}
          <Button variant="outline" onClick={resetTimer}>
            {copy.reset}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            aria-pressed={soundEnabled}
            aria-label={copy.soundToggle}
            onClick={() => setSoundEnabled((prev) => !prev)}
          >
            {soundEnabled ? copy.soundOn : copy.soundOff}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
