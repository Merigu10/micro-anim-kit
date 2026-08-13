import { CSSProperties, ReactNode } from 'react';
import { colors, fonts, radius, spacing } from './theme';

export function SectionHeading({ eyebrow, title, description }: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div style={{ gridColumn: '1 / -1', marginTop: spacing[8] }}>
      <div
        style={{
          fontFamily: fonts.body,
          fontSize: 14,
          fontWeight: 400,
          color: colors.textFaint,
          marginBottom: spacing[8],
        }}
      >
        {eyebrow}
      </div>
      <h2
        style={{
          fontFamily: fonts.display,
          fontWeight: 400,
          fontSize: 32,
          lineHeight: 1.25,
          letterSpacing: '-0.4px',
          margin: `0 0 ${spacing[8]}px`,
          color: colors.text,
        }}
      >
        {title}
      </h2>
      <p style={{ fontFamily: fonts.body, fontSize: 16, lineHeight: 1.5, margin: 0, color: colors.textMuted, maxWidth: 640 }}>
        {description}
      </p>
    </div>
  );
}

export function DemoCard({
  title,
  pattern,
  controls,
  children,
}: {
  title: string;
  pattern: string;
  controls?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      style={{
        background: colors.cardMist,
        borderRadius: radius.card,
        padding: spacing[20],
        color: colors.text,
        display: 'flex',
        flexDirection: 'column',
        gap: spacing[16],
      }}
    >
      <div>
        <h3 style={{ fontFamily: fonts.body, fontSize: 16, fontWeight: 500, margin: `0 0 ${spacing[4]}px`, color: colors.text }}>
          {title}
        </h3>
        <p style={{ fontFamily: fonts.body, fontSize: 13, margin: 0, color: colors.textFaint }}>{pattern}</p>
      </div>
      {controls && <div style={{ display: 'flex', gap: spacing[8], flexWrap: 'wrap' }}>{controls}</div>}
      <div
        style={{
          marginTop: 'auto',
          paddingTop: spacing[16],
          borderTop: `1px solid ${colors.border}`,
          display: 'flex',
          flexDirection: 'column',
          gap: spacing[8],
          minHeight: 0,
        }}
      >
        {children}
      </div>
    </section>
  );
}

export function Btn({
  variant = 'filled',
  style,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'filled' | 'ghost' }) {
  const base: CSSProperties =
    variant === 'filled'
      ? { background: colors.accent, color: colors.accentInk, border: 'none' }
      : { background: 'transparent', color: colors.text, border: `1px solid ${colors.border}` };

  return (
    <button
      {...props}
      style={{
        ...base,
        borderRadius: radius.button,
        padding: '8px 16px',
        cursor: 'pointer',
        fontFamily: fonts.body,
        fontSize: 14,
        fontWeight: 400,
        transition: 'filter 120ms ease',
        ...style,
      }}
    />
  );
}

export function InlineTile({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        padding: '10px 12px',
        background: colors.sectionFog,
        borderRadius: radius.smallCard,
        fontFamily: fonts.body,
        fontSize: 14,
        color: colors.text,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
