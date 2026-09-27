'use client';

import { useEffect, useRef, useState } from 'react';
import VolumeOff from '@material-symbols/svg-600/rounded/volume_off.svg';
import VolumeUp from '@material-symbols/svg-600/rounded/volume_up.svg';

/**
 * Ambient sound, off by default.
 *
 * Deliberately a button and not autoplay: every browser blocks audio that
 * starts without a gesture, and a site that makes noise at you unasked is
 * hostile anyway. The click is the gesture.
 *
 * The source is a file in `public/`. It is NOT a hidden YouTube embed —
 * YouTube's terms require their player stay visible and unobscured, and
 * background audio-only playback is a Premium feature, so streaming one
 * invisibly would be a terms violation rather than a technical problem.
 *
 * If TRACK is missing the button removes itself, so the control never
 * advertises something that cannot play.
 */
const TRACK = '/ambient.mp3';
const VOLUME = 0.35;

export function SoundToggle() {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [usable, setUsable] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.volume = VOLUME;
    // `metadata` preloading starts at parse time, so a 404 can already have
    // landed before this effect runs and the listener below would never hear
    // it. Reading the element's own error state catches that case.
    if (el.error) setUsable(false);
    const onError = () => setUsable(false);
    el.addEventListener('error', onError);
    return () => el.removeEventListener('error', onError);
  }, []);

  if (!usable) return null;

  const toggle = async () => {
    const el = ref.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
      return;
    }
    try {
      await el.play();
      setPlaying(true);
    } catch {
      // Refused despite the gesture, or the file will not decode.
      setUsable(false);
    }
  };

  return (
    <>
      {/* `metadata`, not `none`: the point is to learn whether TRACK exists
          before the button is offered. With `none` nothing is fetched until
          the first click, so a missing file meant showing a control that then
          disappeared under the cursor. */}
      <audio ref={ref} src={TRACK} loop preload="metadata" />
      <button
        className="ctlbtn"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? 'Turn the music off' : 'Turn the music on'}
        title={playing ? 'Turn the music off' : 'Turn the music on'}
      >
        {playing ? (
          <VolumeUp className="icon" aria-hidden focusable="false" />
        ) : (
          <VolumeOff className="icon" aria-hidden focusable="false" />
        )}
      </button>
    </>
  );
}
