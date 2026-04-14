import { ObjectProperties } from '../properties/ObjectProperties';

export function RightPanel() {
  return (
    <aside className="panel-right">
      <div className="panel-header">
        <h2 className="panel-title">Properties</h2>
      </div>
      <div className="panel-body">
        <ObjectProperties />
      </div>
    </aside>
  );
}
