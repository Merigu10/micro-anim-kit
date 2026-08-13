import { useEffect, useState } from 'react';
import {
  FadeIn,
  SlideIn,
  PopIn,
  StateSwitch,
  StatusPulse,
  Skeleton,
  ConfettiBurst,
  MetricSpark,
  StaggerList,
  DragDismiss,
  CountUp,
  Sparkline,
  ProgressRing,
  type Status,
} from '../src';

const cardStyle: React.CSSProperties = {
  background: '#161a22',
  border: '1px solid #262b36',
  borderRadius: 12,
  padding: 20,
  color: '#e6e8eb',
};

const buttonStyle: React.CSSProperties = {
  background: '#2563eb',
  color: 'white',
  border: 'none',
  borderRadius: 8,
  padding: '8px 14px',
  cursor: 'pointer',
  fontSize: 13,
};

export function App() {
  const [showEntry, setShowEntry] = useState(true);
  const [status, setStatus] = useState<Status>('idle');
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [metricValue, setMetricValue] = useState(128);
  const [rows, setRows] = useState([
    { id: 1, label: 'Revenue up 4.2%' },
    { id: 2, label: 'New signups: 18' },
    { id: 3, label: 'Latency p99: 210ms' },
    { id: 4, label: 'Error rate: 0.02%' },
  ]);
  const [nextRowId, setNextRowId] = useState(5);
  const [dismissedCount, setDismissedCount] = useState(0);
  const [toastKey, setToastKey] = useState(0);
  const [revenue, setRevenue] = useState(48210);
  const [trend, setTrend] = useState([12, 18, 14, 22, 19, 27, 24, 31]);
  const [quota, setQuota] = useState(0.62);
  const [loading, setLoading] = useState(true);

  const statuses: Status[] = ['idle', 'loading', 'success', 'error'];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  function bumpRevenue() {
    const delta = Math.round((Math.random() - 0.35) * 4000);
    setRevenue((v) => Math.max(0, v + delta));
    setTrend((t) => [...t.slice(1), Math.max(4, t[t.length - 1] + Math.round((Math.random() - 0.4) * 8))]);
  }

  function bumpQuota() {
    setQuota((q) => Math.min(1, Math.max(0, q + (Math.random() - 0.5) * 0.3)));
  }

  function addRow() {
    setRows((r) => [...r, { id: nextRowId, label: `New event #${nextRowId}` }]);
    setNextRowId((n) => n + 1);
  }

  function removeRow(id: number) {
    setRows((r) => r.filter((row) => row.id !== id));
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0b0d12',
        fontFamily: 'system-ui, sans-serif',
        padding: 40,
        display: 'grid',
        gap: 24,
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        maxWidth: 1000,
        margin: '0 auto',
      }}
    >
      <h1 style={{ gridColumn: '1 / -1', color: '#e6e8eb', fontSize: 20, margin: 0 }}>
        micro-anim-kit — dashboard micro-animation demo
      </h1>

      {/* Spring entries */}
      <section style={cardStyle}>
        <h2 style={{ fontSize: 14, marginTop: 0 }}>Spring Entries</h2>
        <button style={buttonStyle} onClick={() => setShowEntry((s) => !s)}>
          Toggle ({showEntry ? 'visible' : 'hidden'})
        </button>
        <div style={{ marginTop: 16, display: 'grid', gap: 10 }}>
          <FadeIn show={showEntry}>
            <div style={{ padding: 10, background: '#1f2430', borderRadius: 8 }}>FadeIn card</div>
          </FadeIn>
          <SlideIn show={showEntry} direction="left">
            <div style={{ padding: 10, background: '#1f2430', borderRadius: 8 }}>SlideIn (left) card</div>
          </SlideIn>
          <PopIn show={showEntry}>
            <div style={{ padding: 10, background: '#1f2430', borderRadius: 8 }}>PopIn card</div>
          </PopIn>
        </div>
      </section>

      {/* State transitions */}
      <section style={cardStyle}>
        <h2 style={{ fontSize: 14, marginTop: 0 }}>State Transitions</h2>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
          {statuses.map((s) => (
            <button key={s} style={buttonStyle} onClick={() => setStatus(s)}>
              {s}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <StatusPulse status={status} />
          <span style={{ fontSize: 13, opacity: 0.8 }}>{status}</span>
        </div>
        <StateSwitch state={status}>
          {(s) => (
            <div style={{ padding: 10, background: '#1f2430', borderRadius: 8, fontSize: 13 }}>
              Current dashboard state: <strong>{s}</strong>
            </div>
          )}
        </StateSwitch>
      </section>

      {/* Particles */}
      <section style={cardStyle}>
        <h2 style={{ fontSize: 14, marginTop: 0 }}>Canvas Particles</h2>
        <button style={buttonStyle} onClick={() => setConfettiTrigger((t) => t + 1)}>
          Fire confetti
        </button>
        <div style={{ marginTop: 12 }}>
          <ConfettiBurst trigger={confettiTrigger} width={240} height={140} />
        </div>
      </section>

      {/* Metric spark */}
      <section style={cardStyle}>
        <h2 style={{ fontSize: 14, marginTop: 0 }}>Metric Spark</h2>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <button style={buttonStyle} onClick={() => setMetricValue((v) => v + Math.ceil(Math.random() * 20))}>
            Increase
          </button>
          <button style={buttonStyle} onClick={() => setMetricValue((v) => v - Math.ceil(Math.random() * 20))}>
            Decrease
          </button>
        </div>
        <div style={{ position: 'relative', width: 100, height: 50 }}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              fontWeight: 600,
            }}
          >
            {metricValue}
          </div>
          <MetricSpark value={metricValue} width={100} height={50} />
        </div>
      </section>

      {/* Stagger list */}
      <section style={cardStyle}>
        <h2 style={{ fontSize: 14, marginTop: 0 }}>Stagger List</h2>
        <button style={buttonStyle} onClick={addRow}>
          Add event
        </button>
        <div style={{ marginTop: 12, display: 'grid', gap: 8 }}>
          <StaggerList staggerMs={60} direction="left" distance={20}>
            {rows.map((row) => (
              <div
                key={row.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 10px',
                  background: '#1f2430',
                  borderRadius: 8,
                  fontSize: 13,
                }}
              >
                <span>{row.label}</span>
                <button
                  style={{ ...buttonStyle, background: '#2a2f3b', padding: '4px 8px', fontSize: 12 }}
                  onClick={() => removeRow(row.id)}
                >
                  Dismiss
                </button>
              </div>
            ))}
          </StaggerList>
        </div>
      </section>

      {/* Drag to dismiss */}
      <section style={cardStyle}>
        <h2 style={{ fontSize: 14, marginTop: 0 }}>Drag to Dismiss</h2>
        <button style={buttonStyle} onClick={() => setToastKey((k) => k + 1)}>
          Show toast ({dismissedCount} dismissed)
        </button>
        <div style={{ marginTop: 12, minHeight: 48 }}>
          <DragDismiss
            key={toastKey}
            axis="x"
            onDismiss={() => setDismissedCount((c) => c + 1)}
            style={{
              padding: '10px 14px',
              background: '#1f2430',
              borderRadius: 8,
              fontSize: 13,
              userSelect: 'none',
            }}
          >
            Swipe me left or right to dismiss
          </DragDismiss>
        </div>
      </section>

      {/* KPI tile: CountUp + Sparkline */}
      <section style={cardStyle}>
        <h2 style={{ fontSize: 14, marginTop: 0 }}>KPI Tile (CountUp + Sparkline)</h2>
        <button style={buttonStyle} onClick={bumpRevenue}>
          Simulate update
        </button>
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>Revenue (30d)</div>
            <div style={{ fontSize: 26, fontWeight: 600 }}>
              $<CountUp value={revenue} spring="gentle" />
            </div>
          </div>
          <Sparkline data={trend} width={110} height={40} color="#22c55e" fill="#22c55e22" />
        </div>
      </section>

      {/* Progress ring */}
      <section style={cardStyle}>
        <h2 style={{ fontSize: 14, marginTop: 0 }}>Progress Ring</h2>
        <button style={buttonStyle} onClick={bumpQuota}>
          Randomize usage
        </button>
        <div style={{ marginTop: 16 }}>
          <ProgressRing value={quota} size={72} color="#a855f7">
            <span style={{ fontSize: 14, fontWeight: 600 }}>
              <CountUp value={Math.round(quota * 100)} spring="stiff" />%
            </span>
          </ProgressRing>
        </div>
      </section>

      {/* Skeleton loader */}
      <section style={cardStyle}>
        <h2 style={{ fontSize: 14, marginTop: 0 }}>Skeleton Loader</h2>
        <button style={buttonStyle} onClick={() => setLoading((l) => !l)}>
          Toggle loading
        </button>
        <div style={{ marginTop: 16, display: 'grid', gap: 10 }}>
          {loading ? (
            <>
              <Skeleton variant="circle" width={36} height={36} />
              <Skeleton width="80%" />
              <Skeleton width="60%" />
            </>
          ) : (
            <>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: '#3b82f6',
                }}
              />
              <div style={{ fontSize: 13 }}>Dashboard data loaded</div>
              <div style={{ fontSize: 13, opacity: 0.7 }}>Last synced just now</div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
