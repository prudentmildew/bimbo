import { Badge } from '@/components/ui/badge';
import { useAppStore } from '../../store';

export function ObjectProperties() {
  const selectedObjectId = useAppStore((s) => s.selectedObjectId);
  const getObjectById = useAppStore((s) => s.getObjectById);

  if (!selectedObjectId) {
    return (
      <div className="props-empty">
        <p className="props-empty-text">
          Select an object to view properties
        </p>
      </div>
    );
  }

  const obj = getObjectById(selectedObjectId);
  if (!obj) {
    return (
      <div className="props-empty">
        <p className="props-empty-text">Object not found</p>
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
    <div className="props-panel">
      <h3 className="props-title">{obj.name}</h3>
      <Badge className="props-type-badge">{obj.ifcType}</Badge>

      <div className="props-table">
        {rows.map(([label, value]) => (
          <div key={label} className="props-row">
            <span className="props-label">{label}</span>
            <span className="props-value">{value}</span>
          </div>
        ))}
        {extraProps.map(([key, value]) => (
          <div key={key} className="props-row">
            <span className="props-label">{key}</span>
            <span className="props-value">{String(value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
