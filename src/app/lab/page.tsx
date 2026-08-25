import type { Metadata } from 'next';
import { LabPage } from '@/components/LabPage';

export const metadata: Metadata = {
  title: 'Lab',
  description:
    'Open questions and experiments: voice agents, character design, and kinetic hardware.',
};

export default function Page() {
  return <LabPage />;
}
