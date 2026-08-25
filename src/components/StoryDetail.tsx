import { story } from '@/data/story';
import { BarLines, Placeholder } from './Primitives';

/**
 * The story, shared by the view on the deck and the standalone /story page.
 */
export function StoryDetail() {
  return (
    <div className="dimbody">
      <header className="dim__hero">
        <span className="lab">{story.kicker}</span>
        <h1 className="dim__title">{story.title}</h1>
        <p className="lisa-sub">{story.lede}</p>
      </header>

      <div className="dgrid">
        {story.phases.map((phase) => (
          <div className="dblock" key={phase.number}>
            <span className="cellhead">
              <b>{phase.title}</b>
              <span className="csnum">{phase.number}</span>
            </span>
            {phase.body ? <p className="storyline">{phase.body}</p> : <BarLines />}
          </div>
        ))}
      </div>

      <Placeholder className="dim__ph" />
    </div>
  );
}
