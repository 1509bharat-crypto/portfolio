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
    <div className="shell">
      <div className="frame">
        <div className="frame__body">
          <div className="labview">
            <div className="labview__head">
              <div>
                <span className="lab">Lab · open questions</span>
                <h1>Experiments</h1>
              </div>
              <Link className="wbtn" href="/">
                ⌗ Back to grid
              </Link>
            </div>
            <LabGrid />
          </div>
        </div>
      </div>
    </div>
  );
}
