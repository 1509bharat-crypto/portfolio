import type { Metadata } from 'next';
import { Pager } from '@/components/Pager';
import { StoryDetail } from '@/components/StoryDetail';
import { story } from '@/data/story';

export const metadata: Metadata = {
  title: story.title,
  description: story.lede,
};

export default function StoryPage() {
  return (
    <div className="shell">
      <div className="frame">
        <div className="frame__body">
          <div className="focusview">
            <div className="focus__main">
              <StoryDetail />
            </div>
            <Pager backHref="/" showArrows={false} />
          </div>
        </div>
      </div>
    </div>
  );
}
