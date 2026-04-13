import { ObjectProperties } from '../properties/ObjectProperties';

export function RightPanel() {
  return (
    <aside style={panelStyle}>
      <div style={headerStyle}>
        <h2 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#fff' }}>
          Properties
        </h2>
      </div>
      <ObjectProperties />
    </aside>
  );
}

const panelStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  width: 256,
  borderLeft: '1px solid #374151',
  background: '#1f2937',
  flexShrink: 0,
};

const headerStyle: React.CSSProperties = {
  padding: 12,
  borderBottom: '1px solid #374151',
};
