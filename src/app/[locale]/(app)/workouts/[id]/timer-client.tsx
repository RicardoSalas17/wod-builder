"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
};

type TimerClientProps = {
  copy: TimerCopy;
};

type TimerMode = "emom" | "amrap" | "fortime";

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function TimerClient({ copy }: TimerClientProps) {
  const [mode, setMode] = useState<TimerMode>("amrap");
  const [amrapMinutes, setAmrapMinutes] = useState(12);
  const [emomInterval, setEmomInterval] = useState(60);
  const [emomRounds, setEmomRounds] = useState(12);
  const [elapsed, setElapsed] = useState(0);
  const [status, setStatus] = useState<
    "idle" | "running" | "paused" | "finished"
  >("idle");
  const [announcement, setAnnouncement] = useState("");

  const totalSeconds = useMemo(() => {
    if (mode === "amrap") return amrapMinutes * 60;
    if (mode === "emom") return emomInterval * emomRounds;
    return null;
  }, [mode, amrapMinutes, emomInterval, emomRounds]);

  const remainingSeconds = totalSeconds === null ? null : Math.max(totalSeconds - elapsed, 0);

  const displayTime =
    mode === "fortime" ? formatTime(elapsed) : formatTime(remainingSeconds ?? 0);

  const roundInfo = useMemo(() => {
    if (mode !== "emom") return null;
    const round = Math.min(Math.floor(elapsed / emomInterval) + 1, emomRounds);
    const roundRemaining = emomInterval - (elapsed % emomInterval || 0);
    return { round, roundRemaining };
  }, [mode, elapsed, emomInterval, emomRounds]);

  useEffect(() => {
    if (status !== "running") return;

    const id = setInterval(() => {
      setElapsed((value) => value + 1);
    }, 1000);

    return () => clearInterval(id);
  }, [status]);

  useEffect(() => {
    if (status !== "running") return;
    if (totalSeconds !== null && elapsed >= totalSeconds) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("finished");
      setAnnouncement(copy.announceComplete);
    }
}, [elapsed, status, totalSeconds, copy.announceComplete]);

useEffect(() => {
    if (status !== "running") return;
    if (remainingSeconds === 10) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
      setAnnouncement(copy.announceTen);
    }
  }, [remainingSeconds, status, copy.announceTen]);

  const startTimer = () => {
    if (status === "finished") {
      setElapsed(0);
    }
    setStatus("running");
    setAnnouncement(copy.announceStart);
  };

  const pauseTimer = () => {
    setStatus("paused");
    setAnnouncement(copy.announcePause);
  };

  const resetTimer = () => {
    setStatus("idle");
    setElapsed(0);
    setAnnouncement(copy.announceReset);
  };

  const statusLabel =
    status === "running"
      ? copy.statusRunning
      : status === "paused"
        ? copy.statusPaused
        : status === "finished"
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
              { value: "emom", label: copy.emom },
              { value: "amrap", label: copy.amrap },
              { value: "fortime", label: copy.forTime },
            ].map((item) => (
              <label
                key={item.value}
                className="flex items-center gap-2 rounded-full border border-border/60 px-3 py-1 text-sm"
              >
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
                />
                {item.label}
              </label>
            ))}
          </div>
        </fieldset>

        {mode === "amrap" && (
          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold">{copy.durationMinutes}</label>
            <input
              type="number"
              min={1}
              className="w-24 rounded-md border border-border/60 bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              value={amrapMinutes}
              onChange={(e) => {
                setAmrapMinutes(Number(e.target.value));
                setElapsed(0);
                setStatus("idle");
              }}
            />
          </div>
        )}

        {mode === "emom" && (
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-sm font-semibold">{copy.intervalSeconds}</label>
            <input
              type="number"
              min={10}
              className="w-24 rounded-md border border-border/60 bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              value={emomInterval}
              onChange={(e) => {
                setEmomInterval(Number(e.target.value));
                setElapsed(0);
                setStatus("idle");
              }}
            />
            <label className="text-sm font-semibold">{copy.rounds}</label>
            <input
              type="number"
              min={1}
              className="w-24 rounded-md border border-border/60 bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              value={emomRounds}
              onChange={(e) => {
                setEmomRounds(Number(e.target.value));
                setElapsed(0);
                setStatus("idle");
              }}
            />
          </div>
        )}

        <div className="rounded-2xl border border-accent/60 bg-background px-6 py-6 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {mode === "fortime" ? copy.timeElapsed : copy.timeRemaining}
          </p>
          <div className="mt-2 text-4xl font-semibold">{displayTime}</div>
          {roundInfo && (
            <p className="mt-2 text-sm text-muted-foreground">
              {copy.roundLabel} {roundInfo.round} · {formatTime(roundInfo.roundRemaining)}
            </p>
          )}
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-accent">
            {statusLabel}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {status === "running" ? (
            <Button onClick={pauseTimer}>{copy.pause}</Button>
          ) : (
            <Button onClick={startTimer}>{copy.start}</Button>
          )}
          <Button variant="outline" onClick={resetTimer}>
            {copy.reset}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
