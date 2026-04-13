interface ShellPlaceholderProps {
  title: string;
  description: string;
}

export function ShellPlaceholder({
  title,
  description,
}: ShellPlaceholderProps) {
  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>{title}</h2>
        <p style={descStyle}>{description}</p>
        <div style={badgeStyle}>Coming Soon</div>
      </div>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  background: '#111827',
};

const cardStyle: React.CSSProperties = {
  textAlign: 'center',
  maxWidth: 400,
  padding: 32,
};

const titleStyle: React.CSSProperties = {
  margin: '0 0 8px',
  fontSize: 24,
  fontWeight: 700,
  color: '#fff',
};

const descStyle: React.CSSProperties = {
  margin: '0 0 16px',
  fontSize: 14,
  color: '#9ca3af',
  lineHeight: 1.5,
};

const badgeStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '4px 12px',
  borderRadius: 12,
  background: '#374151',
  color: '#6b7280',
  fontSize: 12,
  fontWeight: 600,
};
