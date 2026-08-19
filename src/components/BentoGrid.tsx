'use client';

import { motion, useReducedMotion } from 'motion/react';
import { flagship, otherCases, primaryCases } from '@/data/cases';
import { lab } from '@/data/lab';
import { profile } from '@/data/profile';
import { IdentityTile } from './IdentityTile';
import { springCrisp } from '@/lib/motion';
import { BarLines, CellHead, Chips, Placeholder } from './Primitives';

/**
 * The work band reads in strict priority order:
 * 01 (flagship) → 02 → 03 → other case studies → lab.
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

  // Tiles arrive in reading order, each one settling before the next commits.
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
        <CellHead label="The pitch / story" />
        <p className="claim">{profile.pitch}</p>
        <Chips items={profile.disciplines} />
        <p className="idstory">
          <b>{profile.story.split('.')[0]}.</b>
          {profile.story.slice(profile.story.indexOf('.') + 1)}{' '}
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
        <CellHead label="Case study · flagship" number={flagship.number} />
        <motion.div className="lisa-title" layoutId={`case-title-${flagship.slug}`}>
          {flagship.title}
        </motion.div>
        <p className="lisa-sub">{flagship.tagline}</p>
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
        <Placeholder />
        <div className="meta">
          {flagship.stack?.map((t, i) => (
            <span key={t}>
              {t}
              {i < flagship.stack!.length - 1 ? <span aria-hidden> ·</span> : null}
            </span>
          ))}
        </div>
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
          <CellHead
            label={study.slot ? 'Case study · slot' : 'Case study'}
            number={study.number}
          />
          <motion.div className="cs-title" layoutId={`case-title-${study.slug}`}>
            {study.title}
          </motion.div>
          <p className="storyline">{study.tagline}</p>
          <BarLines widths={[80, 40]} />
        </motion.button>
      ))}

      {/* 04+ — everything that didn't earn its own tile. */}
      <motion.button
        className="cell cell--click cell--slim c-others"
        variants={cell}
        onClick={() => onOpenCase(otherCases[0].slug)}
        aria-label="Open other case studies"
      >
        <CellHead label="Other case studies" number={`${otherCases[0]?.number}+`} />
        <p className="storyline">
          {otherCases.map((c, i) => (
            <span key={c.slug}>
              <b>{c.title}</b>
              {i < otherCases.length - 1 ? ' · ' : ' →'}
            </span>
          ))}
        </p>
      </motion.button>

      {/* Lab. */}
      <motion.button
        className="cell cell--click cell--slim c-lab"
        variants={cell}
        onClick={onOpenLab}
        aria-label="Open the lab"
      >
        <CellHead label="Lab" />
        <p className="storyline">
          {lab.map((e, i) => (
            <span key={e.slug}>
              <b>{e.title}</b>
              {i < lab.length - 1 ? ' · ' : ''}
            </span>
          ))}
        </p>
      </motion.button>
    </motion.div>
  );
}
