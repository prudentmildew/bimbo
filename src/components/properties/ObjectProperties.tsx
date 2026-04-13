import { Badge } from '@/components/ui/badge';
import { useAppStore } from '../../store';

export function ObjectProperties() {
  const selectedObjectId = useAppStore((s) => s.selectedObjectId);
  const getObjectById = useAppStore((s) => s.getObjectById);

  if (!selectedObjectId) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <p className="m-0 text-xs text-muted-foreground">
          Select an object to view properties
        </p>
      </div>
    );
  }

  const obj = getObjectById(selectedObjectId);
  if (!obj) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <p className="m-0 text-xs text-muted-foreground">Object not found</p>
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
    <div className="p-3">
      <h3 className="m-0 mb-1 text-sm font-semibold text-foreground">
        {obj.name}
      </h3>
      <Badge className="mb-3 bg-primary/10 text-primary border-primary/20 font-mono text-[11px]">
        {obj.ifcType}
      </Badge>

      <div className="space-y-0">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="flex py-1 border-b border-[#1a1a1e] font-mono text-xs"
          >
            <span className="w-[40%] shrink-0 text-[#52525b]">{label}</span>
            <span className="text-[#d4d4d8]">{value}</span>
          </div>
        ))}
        {extraProps.map(([key, value]) => (
          <div
            key={key}
            className="flex py-1 border-b border-[#1a1a1e] font-mono text-xs"
          >
            <span className="w-[40%] shrink-0 text-[#52525b]">{key}</span>
            <span className="text-[#d4d4d8]">{String(value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
