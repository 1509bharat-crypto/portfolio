'use client';

import { motion } from 'motion/react';
import type { CaseStudy } from '@/lib/types';
import { easeOut } from '@/lib/motion';
import { BarLines, Placeholder } from './Primitives';

/**
 * The body of one case study. Shared by the overlay on the home card and the
 * standalone /work/[slug] page, so both stay in sync from one definition.
 *
 * `morph` opts the title into the shared-element transition: the same layoutId
 * sits on the grid tile, so clicking a tile flies its title into this heading
 * rather than cross-fading two separate pieces of text.
 */
export function CaseDetail({
  study,
  morph = false,
}: {
  study: CaseStudy;
  morph?: boolean;
}) {
  const stagger = {
    hidden: { opacity: 0, y: 6 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.05 + i * 0.04, duration: 0.32, ease: easeOut },
    }),
  };

  return (
    <>
      <motion.span className="lab" custom={0} variants={stagger} initial="hidden" animate="show">
        {study.kicker}
      </motion.span>

      {morph ? (
        <motion.h1 layoutId={`case-title-${study.slug}`}>{study.title}</motion.h1>
      ) : (
        <h1>{study.title}</h1>
      )}

      <motion.p
        className="lisa-sub"
        custom={1}
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        {study.summary}
      </motion.p>

      {study.stats?.length ? (
        <motion.div
          className="stats"
          custom={2}
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          {study.stats.map((s) => (
            <div className="stat" key={s.label}>
              <b>{s.value}</b>
              <span>{s.label}</span>
            </div>
          ))}
        </motion.div>
      ) : null}

      <div className="dgrid">
        {study.blocks.map((b, i) => (
          <motion.div
            className="dblock"
            key={`${b.title}-${i}`}
            custom={3 + i}
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            <b>{b.title}</b>
            {b.body ? <p className="storyline">{b.body}</p> : <BarLines />}
          </motion.div>
        ))}
      </div>

      {study.stack?.length ? (
        <div className="meta">
          {study.stack.map((t, i) => (
            <span key={t}>
              {t}
              {i < study.stack!.length - 1 ? <span aria-hidden> ·</span> : null}
            </span>
          ))}
        </div>
      ) : null}

      <Placeholder className="min-h-[110px] flex-1" />
    </>
  );
}
