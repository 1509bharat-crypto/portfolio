import type { Metadata } from 'next';
import { LabView } from '@/components/LabView';

export const metadata: Metadata = {
  title: 'Lab',
  description:
    'Open questions and experiments: voice agents, character design, and kinetic hardware.',
};

export default function LabPage() {
  return (
    <div className="dimpage">
      <LabView />
    </div>
  );
}
