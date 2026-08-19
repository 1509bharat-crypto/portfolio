import type { Metadata } from 'next';
import { CaseMap } from '@/components/CaseMap';
import { StoryDetail } from '@/components/StoryDetail';
import { TopBar } from '@/components/TopBar';
import { story } from '@/data/story';

export const metadata: Metadata = {
  title: story.title,
  description: story.lede,
};

export default function StoryPage() {
  return (
    <div className="shell">
      <TopBar />
      <div className="frame">
        <div className="frame__body">
          <div className="focusview">
            <div className="focus__main">
              <StoryDetail />
            </div>
            <CaseMap />
          </div>
        </div>
      </div>
    </div>
  );
}
