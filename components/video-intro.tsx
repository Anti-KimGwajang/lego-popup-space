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
  const [playBlocked, setPlayBlocked] = useState(false);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setClosing(true);
    timerRef.current = window.setTimeout(onFinish, 750);
  }, [onFinish]);

  const play = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    try {
      await video.play();
      setPlayBlocked(false);
    } catch {
      setPlayBlocked(true);
    }
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const playFrame = window.requestAnimationFrame(() => void play());
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') finish();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.cancelAnimationFrame(playFrame);
      window.removeEventListener('keydown', onKeyDown);
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, [finish, play]);

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
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={finish}
        onError={() => setPlayBlocked(true)}
      />
      <div className="video-intro-fade" aria-hidden="true" />
      {playBlocked && (
        <Button className="video-intro-play" onClick={() => void play()}>
          OPENING PLAY
        </Button>
      )}
      <Button className="intro-skip" onClick={finish}>
        SKIP INTRO
      </Button>
    </dialog>
  );
}
