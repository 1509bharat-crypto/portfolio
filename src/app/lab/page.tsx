import type { Metadata } from 'next';
import Link from 'next/link';
import { LabGrid } from '@/components/LabGrid';

export const metadata: Metadata = {
  title: 'Lab',
  description:
    'Open questions and experiments: voice agents, character design, and kinetic hardware.',
};

export default function LabPage() {
  return (
    <div className="dimpage">
      <div className="dim__bar">
        <Link className="wbtn dim__back" href="/">
          ← Back
        </Link>
      </div>
      <div className="dim__scroll">
        <div className="dimbody">
          <header className="dim__hero dim__hero--short">
            <span className="lab">Lab · open questions</span>
            <h1 className="dim__title">Experiments</h1>
          </header>
          <LabGrid />
        </div>
      </div>
    </div>
  );
}
