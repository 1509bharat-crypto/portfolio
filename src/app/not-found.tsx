import Link from 'next/link';
import { TopBar } from '@/components/TopBar';
import { BarLines } from '@/components/Primitives';

export default function NotFound() {
  return (
    <div className="shell">
      <TopBar />
      <div className="frame">
        <div className="frame__body">
          <div className="focus__main" style={{ flex: 1 }}>
            <span className="lab">404 · no such tile</span>
            <h1>This one isn&apos;t in the grid</h1>
            <p className="lisa-sub">
              The page you asked for doesn&apos;t exist — it may have been a slot
              that never got filled.
            </p>
            <div className="dgrid">
              <div className="dblock">
                <b>Try the work</b>
                <BarLines />
                <Link href="/" className="wbtn" style={{ alignSelf: 'flex-start' }}>
                  ⌗ Back to the grid
                </Link>
              </div>
              <div className="dblock">
                <b>Or the lab</b>
                <BarLines />
                <Link href="/lab" className="wbtn" style={{ alignSelf: 'flex-start' }}>
                  Experiments →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
