import { useAppStore } from '../../store';

export function ObjectProperties() {
  const selectedObjectId = useAppStore((s) => s.selectedObjectId);
  const getObjectById = useAppStore((s) => s.getObjectById);

  if (!selectedObjectId) {
    return (
      <div style={emptyStyle}>
        <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>
          Select an object to view properties
        </p>
      </div>
    );
  }

  const obj = getObjectById(selectedObjectId);
  if (!obj) {
    return (
      <div style={emptyStyle}>
        <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>
          Object not found
        </p>
      </div>
    );
  }

  const rows: [string, string | number][] = [
    ['Name', obj.name],
    ['IFC Type', obj.ifcType],
    ['Material', obj.material],
    ['Discipline', obj.discipline],
    ['Floor', obj.floor],
    ['Width', `${obj.dimensions.width.toFixed(2)} m`],
    ['Height', `${obj.dimensions.height.toFixed(2)} m`],
    ['Depth', `${obj.dimensions.depth.toFixed(2)} m`],
  ];

  const extraProps = Object.entries(obj.properties).filter(
    ([key]) => !['ifcType', 'material', 'discipline', 'floor'].includes(key),
  );

  return (
    <div style={{ padding: 12 }}>
      <h3 style={nameStyle}>{obj.name}</h3>
      <p style={typeTagStyle}>{obj.ifcType}</p>

      <table style={tableStyle}>
        <tbody>
          {rows.map(([label, value]) => (
            <tr key={label}>
              <td style={labelCellStyle}>{label}</td>
              <td style={valueCellStyle}>{value}</td>
            </tr>
          ))}
          {extraProps.map(([key, value]) => (
            <tr key={key}>
              <td style={labelCellStyle}>{key}</td>
              <td style={valueCellStyle}>{String(value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const emptyStyle: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 16,
};

const nameStyle: React.CSSProperties = {
  margin: '0 0 4px',
  fontSize: 14,
  fontWeight: 600,
  color: '#fff',
};

const typeTagStyle: React.CSSProperties = {
  margin: '0 0 12px',
  fontSize: 11,
  color: '#4fc3f7',
};

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: 12,
};

const labelCellStyle: React.CSSProperties = {
  padding: '4px 0',
  color: '#9ca3af',
  verticalAlign: 'top',
  width: '40%',
};

const valueCellStyle: React.CSSProperties = {
  padding: '4px 0',
  color: '#e5e7eb',
  verticalAlign: 'top',
};
