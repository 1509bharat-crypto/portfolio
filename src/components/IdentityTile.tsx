import { profile } from '@/data/profile';
import { Availability, IdentityLinks } from './Identity';

/**
 * The old floating top bar, folded into the grid. Name, availability, what
 * I'm doing now, and how to reach me — one tile instead of a bar hovering
 * above the card.
 */
export function IdentityTile() {
  return (
    <>
      <span className="me__name">
        <span className="mono me__mark" aria-hidden>
          ⌗
        </span>
        {profile.name}
      </span>
      <p className="storyline me__role">
        {profile.role}, {profile.location}
      </p>

      <Availability />

      <p className="storyline me__now">
        <b>{profile.now.where}.</b> {profile.now.what}
      </p>

      <IdentityLinks />
    </>
  );
}
