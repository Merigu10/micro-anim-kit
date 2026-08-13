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
import { colors, fonts, radius, spacing } from './theme';
import { DemoCard, SectionHeading, Btn, InlineTile } from './components';

const statuses: Status[] = ['idle', 'loading', 'success', 'error'];

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
    <div style={{ minHeight: '100vh', background: colors.canvas, fontFamily: fonts.body }}>
      {/* Hero */}
      <header style={{ padding: `${spacing[64]}px ${spacing[40]}px ${spacing[40]}px` }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ fontFamily: fonts.body, fontSize: 14, color: colors.textFaint, marginBottom: spacing[16] }}>
            React · Spring physics · 0 runtime deps
          </div>
          <h1
            style={{
              fontFamily: fonts.display,
              fontWeight: 400,
              fontSize: 56,
              lineHeight: 1.15,
              letterSpacing: '-0.8px',
              margin: `0 0 ${spacing[16]}px`,
              color: colors.text,
            }}
          >
            micro-anim-kit
          </h1>
          <p style={{ fontFamily: fonts.body, fontSize: 17, lineHeight: 1.5, margin: `0 0 ${spacing[24]}px`, color: colors.textMuted, maxWidth: 620 }}>
            A design system of micro-animations built specifically for dashboard UIs — KPI tiles, status
            indicators, dismissible rows, and loading states, driven by spring physics instead of duration-based
            tweens.
          </p>
          <div style={{ display: 'flex', gap: spacing[12], flexWrap: 'wrap' }}>
            <a
              href="https://github.com/Merigu10/micro-anim-kit"
              style={{
                background: colors.accent,
                color: colors.accentInk,
                borderRadius: radius.button,
                padding: '10px 20px',
                fontSize: 14,
                fontWeight: 400,
                textDecoration: 'none',
              }}
            >
              View on GitHub
            </a>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing[8],
                padding: '10px 20px',
                borderRadius: radius.button,
                fontSize: 14,
                color: colors.textMuted,
                border: `1px solid ${colors.border}`,
              }}
            >
              ~7 kB gzip · tree-shakeable per category
            </div>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1080, margin: '0 auto', padding: `${spacing[40]}px ${spacing[40]}px ${spacing[80]}px` }}>
        {/* Entries */}
        <div style={{ display: 'grid', gap: spacing[20], gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', alignItems: 'start', marginBottom: spacing[64] }}>
          <SectionHeading
            eyebrow="Entries"
            title="Entry & list animations"
            description="Spring-driven fade/slide/pop-in for cards and badges, plus staggered mount/unmount for lists that grow and shrink."
          />

          <DemoCard
            title="FadeIn / SlideIn / PopIn"
            pattern="A card or badge appearing on screen"
            controls={
              <Btn onClick={() => setShowEntry((s) => !s)}>Toggle ({showEntry ? 'visible' : 'hidden'})</Btn>
            }
          >
            <FadeIn show={showEntry}>
              <InlineTile>FadeIn card</InlineTile>
            </FadeIn>
            <SlideIn show={showEntry} direction="left">
              <InlineTile>SlideIn (left) card</InlineTile>
            </SlideIn>
            <PopIn show={showEntry}>
              <InlineTile>PopIn card</InlineTile>
            </PopIn>
          </DemoCard>

          <DemoCard
            title="StaggerList"
            pattern="A table/list row arriving or being dismissed"
            controls={<Btn onClick={addRow}>Add event</Btn>}
          >
            <StaggerList staggerMs={60} direction="left" distance={20}>
              {rows.map((row) => (
                <div
                  key={row.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 12px',
                    background: colors.sectionFog,
                    borderRadius: radius.smallCard,
                    fontSize: 14,
                    marginBottom: spacing[8],
                  }}
                >
                  <span>{row.label}</span>
                  <Btn variant="ghost" style={{ padding: '4px 12px', fontSize: 12 }} onClick={() => removeRow(row.id)}>
                    Dismiss
                  </Btn>
                </div>
              ))}
            </StaggerList>
          </DemoCard>
        </div>

        {/* Transitions */}
        <div style={{ display: 'grid', gap: spacing[20], gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', alignItems: 'start', marginBottom: spacing[64] }}>
          <SectionHeading
            eyebrow="Transitions"
            title="State & loading transitions"
            description="Crossfade between loading/success/error views, pulse a sync indicator, and shimmer placeholders while data resolves."
          />

          <DemoCard
            title="StateSwitch + StatusPulse"
            pattern="A sync/status indicator crossfading between states"
            controls={statuses.map((s) => (
              <Btn key={s} variant={status === s ? 'filled' : 'ghost'} onClick={() => setStatus(s)}>
                {s}
              </Btn>
            ))}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing[8] }}>
              <StatusPulse status={status} />
              <span style={{ fontSize: 14, color: colors.textMuted }}>{status}</span>
            </div>
            <StateSwitch state={status}>
              {(s) => (
                <InlineTile>
                  Current dashboard state: <strong>{s}</strong>
                </InlineTile>
              )}
            </StateSwitch>
          </DemoCard>

          <DemoCard
            title="Skeleton"
            pattern="A widget placeholder while data loads"
            controls={<Btn onClick={() => setLoading((l) => !l)}>Toggle loading</Btn>}
          >
            {loading ? (
              <>
                <Skeleton variant="circle" width={36} height={36} />
                <Skeleton width="80%" />
                <Skeleton width="60%" />
              </>
            ) : (
              <>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: colors.accent }} />
                <div style={{ fontSize: 14 }}>Dashboard data loaded</div>
                <div style={{ fontSize: 14, color: colors.textMuted }}>Last synced just now</div>
              </>
            )}
          </DemoCard>
        </div>

        {/* Metrics */}
        <div style={{ display: 'grid', gap: spacing[20], gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', alignItems: 'start', marginBottom: spacing[64] }}>
          <SectionHeading
            eyebrow="Metrics"
            title="KPI-tile primitives"
            description="Numbers that spring toward new values instead of snapping, with trend lines and gauges for quota/SLA widgets."
          />

          <DemoCard
            title="CountUp + Sparkline"
            pattern="A KPI number with a trend line, updating live"
            controls={<Btn onClick={bumpRevenue}>Simulate update</Btn>}
          >
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 13, color: colors.textMuted, marginBottom: spacing[4] }}>Revenue (30d)</div>
                <div style={{ fontFamily: fonts.display, fontSize: 28, fontWeight: 400 }}>
                  $<CountUp value={revenue} spring="gentle" />
                </div>
              </div>
              <Sparkline data={trend} width={110} height={40} color={colors.accent} fill={`${colors.accent}33`} />
            </div>
          </DemoCard>

          <DemoCard
            title="ProgressRing"
            pattern="A quota/SLA/resource-usage gauge"
            controls={<Btn onClick={bumpQuota}>Randomize usage</Btn>}
          >
            <ProgressRing value={quota} size={72} color={colors.accent} trackColor={colors.border}>
              <span style={{ fontFamily: fonts.display, fontSize: 15, fontWeight: 400 }}>
                <CountUp value={Math.round(quota * 100)} spring="stiff" />%
              </span>
            </ProgressRing>
          </DemoCard>

          <DemoCard
            title="MetricSpark"
            pattern="A number with a directional delta spark"
            controls={
              <>
                <Btn onClick={() => setMetricValue((v) => v + Math.ceil(Math.random() * 20))}>Increase</Btn>
                <Btn variant="ghost" onClick={() => setMetricValue((v) => v - Math.ceil(Math.random() * 20))}>
                  Decrease
                </Btn>
              </>
            }
          >
            <div style={{ position: 'relative', width: 100, height: 50 }}>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: fonts.display,
                  fontSize: 24,
                  fontWeight: 400,
                }}
              >
                {metricValue}
              </div>
              <MetricSpark value={metricValue} width={100} height={50} />
            </div>
          </DemoCard>
        </div>

        {/* Gestures & particles */}
        <div style={{ display: 'grid', gap: spacing[20], gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', alignItems: 'start' }}>
          <SectionHeading
            eyebrow="Gestures & particles"
            title="Interaction & celebration"
            description="Swipe-to-dismiss toasts with velocity-based flick detection, and canvas particle bursts for milestone moments."
          />

          <DemoCard
            title="DragDismiss"
            pattern="A dismissible toast/notification"
            controls={<Btn onClick={() => setToastKey((k) => k + 1)}>Show toast ({dismissedCount} dismissed)</Btn>}
          >
            <div style={{ minHeight: 44 }}>
              <DragDismiss
                key={toastKey}
                axis="x"
                onDismiss={() => setDismissedCount((c) => c + 1)}
                style={{
                  padding: '10px 14px',
                  background: colors.sectionFog,
                  borderRadius: radius.smallCard,
                  fontSize: 14,
                  userSelect: 'none',
                }}
              >
                Swipe me left or right to dismiss
              </DragDismiss>
            </div>
          </DemoCard>

          <DemoCard
            title="ConfettiBurst"
            pattern="A task-complete / milestone celebration"
            controls={<Btn onClick={() => setConfettiTrigger((t) => t + 1)}>Fire confetti</Btn>}
          >
            <ConfettiBurst trigger={confettiTrigger} width={240} height={140} />
          </DemoCard>
        </div>
      </main>

      <footer
        style={{
          borderTop: `1px solid ${colors.border}`,
          padding: `${spacing[24]}px ${spacing[40]}px`,
          textAlign: 'center',
          fontSize: 13,
          color: colors.textFaint,
        }}
      >
        micro-anim-kit — MIT-style demo · built with React + Vite
      </footer>
    </div>
  );
}
