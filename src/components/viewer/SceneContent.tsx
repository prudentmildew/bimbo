import { useEffect, useMemo } from 'react';
import { useAppStore } from '../../store';
import { BimMesh } from './BimMesh';

export function SceneContent() {
  const objects = useAppStore((s) => s.objects);
  const loadProceduralModel = useAppStore((s) => s.loadProceduralModel);
  const isObjectVisible = useAppStore((s) => s.isObjectVisible);

  useEffect(() => {
    if (objects.length === 0) {
      loadProceduralModel();
    }
  }, [objects.length, loadProceduralModel]);

  const visibleObjects = useMemo(
    () => objects.filter(isObjectVisible),
    [objects, isObjectVisible],
  );

  return (
    <>
      {visibleObjects.map((obj) => (
        <BimMesh key={obj.id} object={obj} />
      ))}
    </>
  );
}
