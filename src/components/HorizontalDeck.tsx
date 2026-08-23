'use client';

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from 'motion/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { flagship, otherCases, primaryCases } from '@/data/cases';
import { lab, labIntro } from '@/data/lab';
import { profile } from '@/data/profile';
import type { CaseStudy } from '@/lib/types';
import { Availability, IdentityLinks } from './Identity';
import { Label, Placeholder } from './Primitives';

/** Card width (70vw) plus the gap between cards (4vw). */
const STEP_VW = 74;

type DeckItem = {
  key: string;
  className?: string;
  ariaLabel?: string;
  onClick?: () => void;
  body: ReactNode;
};

function Head({ study }: { study: CaseStudy }) {
  return (
    <div className="cellhead">
      <span className="lab">
        <span className="lab__name">{study.company}</span>
        {study.skills.map((skill) => (
          <span key={skill}>
            <span aria-hidden> · </span>
            {skill}
          </span>
        ))}
      </span>
      <span className="csnum">{study.number}</span>
    </div>
  );
}

/**
 * One card of the deck. Focus is positional: a card is fully present only
 * while it owns the center of the viewport, and eases back as it leaves.
 */
function DeckCard({
  item,
  index,
  total,
  progress,
  reduced,
}: {
  item: DeckItem;
  index: number;
  total: number;
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  const center = total > 1 ? index / (total - 1) : 0;
  const span = total > 1 ? 1 / (total - 1) : 1;

  // Scroll-linked transforms compile to native ScrollTimeline keyframes, and
  // keyframe offsets must stay inside [0, 1], so the first and last card get
  // one-sided ranges instead of a clipped triangle.
  const input =
    center <= 0
      ? [0, span]
      : center >= 1
        ? [1 - span, 1]
        : [center - span, center, center + span];
  const dimmed =
    center <= 0 ? [1, 0.25] : center >= 1 ? [0.25, 1] : [0.25, 1, 0.25];
  const shrunk =
    center <= 0 ? [1, 0.94] : center >= 1 ? [0.94, 1] : [0.94, 1, 0.94];

  const opacity = useTransform(progress, input, dimmed);
  const scale = useTransform(progress, input, shrunk);

  const style = reduced ? { opacity } : { opacity, scale };
  const className = `hcard ${item.className ?? ''}`;

  return item.onClick ? (
    <motion.button
      style={style}
      className={className}
      onClick={item.onClick}
      aria-label={item.ariaLabel}
    >
      {item.body}
    </motion.button>
  ) : (
    <motion.article style={style} className={className}>
      {item.body}
    </motion.article>
  );
}

/**
 * Home as one horizontal run of viewport-sized cards. Vertical scroll drives
 * horizontal travel; full-height snap stops keep exactly one card in focus.
 * The whole track zooms out in proportion to scroll speed and springs back to
 * rest when the scrolling stops, so fast travel reads as pulling back from
 * the shelf and stopping reads as leaning in.
 */
export function HorizontalDeck({
  onOpenCase,
  onOpenLab,
  onOpenStory,
}: {
  onOpenCase: (slug: string) => void;
  onOpenLab: () => void;
  onOpenStory: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [desktop, setDesktop] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 760px)');
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Full-viewport snap stops, only while the deck owns the page.
  useEffect(() => {
    if (!desktop) return;
    const root = document.documentElement;
    const prev = root.style.scrollSnapType;
    root.style.scrollSnapType = 'y mandatory';
    return () => {
      root.style.scrollSnapType = prev;
    };
  }, [desktop]);

  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ['start start', 'end end'],
  });

  const items: DeckItem[] = [
    {
      key: 'pitch',
      className: 'hcard--pitch',
      body: (
        <>
          <span className="lab">
            {profile.name} · {profile.role} · {profile.location}
          </span>
          <p className="hpitch">{profile.pitch}</p>
          <span className="lab hdeck__hint" aria-hidden>
            scroll →
          </span>
        </>
      ),
    },
    ...[flagship, ...primaryCases].map((study) => ({
      key: study.slug,
      className: 'hcard--surface',
      ariaLabel: `Open case study: ${study.title}`,
      onClick: () => onOpenCase(study.slug),
      body: (
        <>
          <Head study={study} />
          <p className="headline headline--lead">{study.headline}</p>
          {study.stats?.length ? (
            <div className="stats">
              {study.stats.map((s) => (
                <div className="stat" key={s.label}>
                  <b>{s.value}</b>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          ) : null}
          <Placeholder className="flex-1" />
        </>
      ),
    })),
    {
      key: 'others',
      className: 'hcard--surface',
      ariaLabel: 'Open other case studies',
      onClick: () => onOpenCase(otherCases[0].slug),
      body: (
        <>
          <div className="cellhead">
            <Label>Other case studies</Label>
            <span className="csnum">{`${otherCases[0]?.number}+`}</span>
          </div>
          <p className="headline">
            {otherCases.map((c) => c.title).join(' · ')} →
          </p>
          <Placeholder className="flex-1" />
        </>
      ),
    },
    {
      key: 'lab',
      className: 'hcard--surface',
      ariaLabel: 'Open the lab',
      onClick: onOpenLab,
      body: (
        <>
          <div className="cellhead">
            <Label>Lab</Label>
          </div>
          <p className="headline">{labIntro}</p>
          <p className="lab">{lab.map((e) => e.title).join(' · ')}</p>
          <Placeholder className="flex-1" />
        </>
      ),
    },
    {
      key: 'end',
      className: 'hcard--pitch',
      body: (
        <>
          <span className="lab">{profile.story}</span>
          <p className="hpitch">Say hello.</p>
          <Availability />
          <div className="hcard__actions">
            <button className="go" onClick={onOpenStory}>
              Read the story →
            </button>
          </div>
          <IdentityLinks />
        </>
      ),
    },
  ];

  const total = items.length;

  const x = useTransform(
    scrollYProgress,
    (p) => `${-p * (total - 1) * STEP_VW}vw`,
  );

  // Scroll speed pulls the whole shelf back; rest brings it home.
  const velocity = useVelocity(scrollYProgress);
  const settled = useSpring(velocity, { stiffness: 260, damping: 44, mass: 0.9 });
  const zoom = useTransform(settled, [-2.2, 0, 2.2], [0.9, 1, 0.9], {
    clamp: true,
  });

  if (!desktop) {
    return (
      <div className="vdeck">
        {items.map((item) =>
          item.onClick ? (
            <button
              key={item.key}
              className={`hcard ${item.className ?? ''}`}
              onClick={item.onClick}
              aria-label={item.ariaLabel}
            >
              {item.body}
            </button>
          ) : (
            <article key={item.key} className={`hcard ${item.className ?? ''}`}>
              {item.body}
            </article>
          ),
        )}
      </div>
    );
  }

  return (
    <div
      className="hdeck"
      ref={rootRef}
      style={{ height: `${total * 100}vh` }}
    >
      <div className="hdeck__viewport">
        <motion.div
          className="hdeck__track"
          style={reduced ? { x } : { x, scale: zoom }}
        >
          {items.map((item, i) => (
            <DeckCard
              key={item.key}
              item={item}
              index={i}
              total={total}
              progress={scrollYProgress}
              reduced={!!reduced}
            />
          ))}
        </motion.div>
      </div>

      {items.map((_, i) => (
        <div
          key={i}
          className="hdeck__step"
          style={{ top: `${i * 100}vh` }}
          aria-hidden
        />
      ))}
    </div>
  );
}
