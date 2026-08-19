import { profile } from '@/data/profile';

/** The contact buttons. Same set wherever identity appears. */
export function IdentityLinks({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? 'me__links me__links--compact' : 'me__links'}>
      {profile.links.map((l) => (
        <a
          key={l.label}
          className="wbtn"
          href={l.href}
          target={l.href.startsWith('http') ? '_blank' : undefined}
          rel={l.href.startsWith('http') ? 'noreferrer' : undefined}
        >
          {l.label}
        </a>
      ))}
    </div>
  );
}

export function Availability() {
  return (
    <p className="storyline">
      <span className="dot" aria-hidden />
      {profile.availability}
    </p>
  );
}

/**
 * Compact identity for the map column, so name and contact stay reachable
 * inside a case study, the story or a lab log now that the top bar is gone.
 */
export function IdentityBlock() {
  return (
    <div className="map__id">
      <span className="me__name">{profile.name}</span>
      <Availability />
      <IdentityLinks compact />
    </div>
  );
}
