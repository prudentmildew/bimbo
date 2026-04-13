import { useEffect } from 'react';
import { useAppStore } from '../../store';
import { BimMesh } from './BimMesh';

export function SceneContent() {
  const objects = useAppStore((s) => s.objects);
  const loadProceduralModel = useAppStore((s) => s.loadProceduralModel);

  useEffect(() => {
    if (objects.length === 0) {
      loadProceduralModel();
    }
  }, [objects.length, loadProceduralModel]);

  return (
    <>
      {objects.map((obj) => (
        <BimMesh key={obj.id} object={obj} />
      ))}
    </>
  );
}
