'use client';

import { motion, useReducedMotion } from 'motion/react';
import { flagship, otherCases, primaryCases } from '@/data/cases';
import { labIntro } from '@/data/lab';
import { profile } from '@/data/profile';
import { springCrisp } from '@/lib/motion';
import type { CaseStudy } from '@/lib/types';
import { IdentityTile } from './IdentityTile';
import { Chips, Label, Placeholder } from './Primitives';

/**
 * The label row carries the skills, not the project name. A recruiter has
 * never heard of Lisa or Mona; they have heard of voice UX. The name is the
 * identifier and lives in the detail view and the map column, where it is
 * being navigated by rather than scanned.
 *
 * Module scope on purpose — a component created during render remounts every
 * time, which would break the shared-element transition.
 */
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
 * The work band reads in strict priority order:
 * 01 (flagship) → 02 → 03 → other case studies → lab.
 *
 * A block is one line of text and one visual. The mono label carries the
 * project name so the display type is free to carry what changed — the tile
 * says what the work was worth, not what it was called.
 */
export function BentoGrid({
  onOpenCase,
  onOpenLab,
  onOpenStory,
}: {
  onOpenCase: (slug: string) => void;
  onOpenLab: () => void;
  onOpenStory: () => void;
}) {
  const reduced = useReducedMotion();

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduced ? 0 : 0.04, delayChildren: 0.05 },
    },
  };

  const cell = reduced
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 8 },
        show: { opacity: 1, y: 0, transition: springCrisp },
      };

  const [second, third] = primaryCases;

  return (
    <motion.div className="bento" variants={container} initial="hidden" animate="show">
      {/* The pitch, at display size. */}
      <motion.section className="cell c-id" variants={cell}>
        <p className="claim">{profile.pitch}</p>
        <Chips items={profile.disciplines} />
        <p className="idstory">
          <b>{profile.story}</b>{' '}
          <button className="go" onClick={onOpenStory}>
            Read the story →
          </button>
        </p>
      </motion.section>

      {/* Who I am, what I'm doing, how to reach me — the old top bar. */}
      <motion.section className="cell c-me" variants={cell}>
        <IdentityTile />
      </motion.section>

      {/* 01 — flagship. */}
      <motion.button
        className="cell c-lisa cell--click"
        variants={cell}
        onClick={() => onOpenCase(flagship.slug)}
        aria-label={`Open case study: ${flagship.title}`}
      >
        <Head study={flagship} />
        <motion.p
          className="headline headline--lead"
          layoutId={`case-headline-${flagship.slug}`}
        >
          {flagship.headline}
        </motion.p>
        {flagship.stats?.length ? (
          <div className="stats">
            {flagship.stats.map((s) => (
              <div className="stat" key={s.label}>
                <b>{s.value}</b>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        ) : null}
        <Placeholder className="flex-1" />
      </motion.button>

      {/* 02 and 03. */}
      {[
        { study: second, cls: 'c-robin' },
        { study: third, cls: 'c-cs3' },
      ].map(({ study, cls }) => (
        <motion.button
          key={study.slug}
          className={`cell cell--click ${cls}`}
          variants={cell}
          onClick={() => onOpenCase(study.slug)}
          aria-label={`Open case study: ${study.title}`}
        >
          <Head study={study} />
          <motion.p className="headline" layoutId={`case-headline-${study.slug}`}>
            {study.headline}
          </motion.p>
          <Placeholder className="flex-1" />
        </motion.button>
      ))}

      {/* 04+ — everything that didn't earn its own tile. */}
      <motion.button
        className="cell cell--click cell--slim c-others"
        variants={cell}
        onClick={() => onOpenCase(otherCases[0].slug)}
        aria-label="Open other case studies"
      >
        <div className="cellhead">
          <Label>Other case studies</Label>
          <span className="csnum">{`${otherCases[0]?.number}+`}</span>
        </div>
        <p className="headline headline--small">
          {otherCases.map((c) => c.title).join(' · ')} →
        </p>
      </motion.button>

      {/* Lab. */}
      <motion.button
        className="cell cell--click cell--slim c-lab"
        variants={cell}
        onClick={onOpenLab}
        aria-label="Open the lab"
      >
        <div className="cellhead">
          <Label>Lab</Label>
        </div>
        <p className="headline headline--small">{labIntro}</p>
      </motion.button>
    </motion.div>
  );
}
