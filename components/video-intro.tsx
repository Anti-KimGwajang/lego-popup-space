'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

type VideoIntroProps = {
  onFinish: () => void;
};

export default function VideoIntro({ onFinish }: VideoIntroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<number | null>(null);
  const finishedRef = useRef(false);
  const [closing, setClosing] = useState(false);
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(true);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setClosing(true);
    timerRef.current = window.setTimeout(onFinish, 750);
  }, [onFinish]);

  const toggleSound = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;
    if (!started) {
      video.currentTime = 0;
      video.muted = false;
      video.volume = 1;
      try {
        await video.play();
        setStarted(true);
        setMuted(false);
      } catch {
        video.muted = true;
        setMuted(true);
      }
      return;
    }
    const nextMuted = !video.muted;
    video.muted = nextMuted;
    video.volume = 1;
    setMuted(nextMuted);
  }, [started]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') finish();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, [finish]);

  return (
    <dialog
      open
      className={`video-intro${closing ? ' video-intro-closing' : ''}`}
      aria-label="LEGO 프로젝트 시네마틱 오프닝"
    >
      <video
        ref={videoRef}
        className="video-intro-media"
        src="./assets/lego-cinematic.mp4"
        muted
        playsInline
        preload="auto"
        onEnded={finish}
      />
      <div className="video-intro-fade" aria-hidden="true" />
      <div className="video-intro-controls">
        <Button className="intro-sound" onClick={() => void toggleSound()}>
          {muted ? 'SOUND ON' : 'SOUND OFF'}
        </Button>
        <Button className="intro-skip" onClick={finish}>
          SKIP INTRO
        </Button>
      </div>
    </dialog>
  );
}
