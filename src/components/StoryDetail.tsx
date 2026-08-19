'use client';

import { motion } from 'motion/react';
import { story } from '@/data/story';
import { easeOut } from '@/lib/motion';
import { BarLines, Placeholder } from './Primitives';

/**
 * The story, shared by the overlay on the home card and the standalone /story
 * page — the same dual rendering the case studies use.
 */
export function StoryDetail() {
  const stagger = {
    hidden: { opacity: 0, y: 6 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.05 + i * 0.05, duration: 0.32, ease: easeOut },
    }),
  };

  return (
    <>
      <span className="lab">{story.kicker}</span>
      <h1>{story.title}</h1>
      <motion.p
        className="lisa-sub"
        custom={0}
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        {story.lede}
      </motion.p>

      <div className="dgrid">
        {story.phases.map((phase, i) => (
          <motion.div
            className="dblock"
            key={phase.number}
            custom={1 + i}
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            <span className="cellhead">
              <b>{phase.title}</b>
              <span className="csnum">{phase.number}</span>
            </span>
            {phase.body ? <p className="storyline">{phase.body}</p> : <BarLines />}
          </motion.div>
        ))}
      </div>

      <Placeholder className="min-h-[110px] flex-1" />
    </>
  );
}
