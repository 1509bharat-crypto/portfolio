import type { Metadata } from 'next';
import Link from 'next/link';
import { StoryDetail } from '@/components/StoryDetail';
import { story } from '@/data/story';

export const metadata: Metadata = {
  title: story.title,
  description: story.lede,
};

export default function StoryPage() {
  return (
    <div className="dimpage">
      <div className="dim__bar">
        <Link className="wbtn dim__back" href="/" aria-label="Back to the deck">
          <span aria-hidden>←</span>
        </Link>
      </div>
      <div className="dim__scroll">
        <div className="dimbody">
          <StoryDetail />
        </div>
      </div>
    </div>
  );
}
