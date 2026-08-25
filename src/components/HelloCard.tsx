import { stack } from '@/data/cases';
import { profile } from '@/data/profile';
import { Availability, IdentityLinks } from './Identity';

/**
 * The last card of the deck: everything someone needs once they have decided
 * they want to talk. How the work is made, what it is held to, what it is
 * built with, and how to reach him.
 *
 * The two statement columns are numbered in mono and set in ink, the same way
 * case studies are numbered, so they read as claims rather than metadata. The
 * stack is chips instead, because tools are a set and not an argument — and it
 * is derived from the case studies, so it can never drift from what the work
 * actually says.
 */
export function HelloCard({ onOpenStory }: { onOpenStory: () => void }) {
  const statements = [
    { label: 'How I work', items: profile.howIWork },
    { label: 'What I value', items: profile.values },
  ];

  return (
    <>
      <span className="lab">{profile.story}</span>
      <p className="hpitch">Say hello.</p>

      <div className="hello__now">
        <Availability />
        <p className="storyline">
          <b>{profile.now.where}.</b> {profile.now.what}
        </p>
      </div>

      <div className="hello__cols">
        {statements.map((col) => (
          <div className="hello__col" key={col.label}>
            <span className="lab">{col.label}</span>
            <ol className="hello__list">
              {col.items.map((item, i) => (
                <li key={item}>
                  <span className="csnum hello__num" aria-hidden>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {item}
                </li>
              ))}
            </ol>
          </div>
        ))}

        <div className="hello__col" key="stack">
          <span className="lab">Built with</span>
          <div className="chips hello__stack">
            {stack.map((tool) => (
              <span className="chip" key={tool}>
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="hello__foot">
        <IdentityLinks />
        <button className="go" onClick={onOpenStory}>
          Read the story →
        </button>
      </div>
    </>
  );
}
