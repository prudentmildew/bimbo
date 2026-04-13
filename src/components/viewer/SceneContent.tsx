import { useEffect, useMemo } from 'react';
import type { Group } from 'three';
import { useAppStore } from '../../store';
import { BimMesh } from './BimMesh';

export function SceneContent() {
  const objects = useAppStore((s) => s.objects);
  const modelSource = useAppStore((s) => s.modelSource);
  const gltfScene = useAppStore((s) => s.gltfScene) as Group | null;
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

  if (modelSource === 'gltf' && gltfScene) {
    return <primitive object={gltfScene} />;
  }

  return (
    <>
      {visibleObjects.map((obj) => (
        <BimMesh key={obj.id} object={obj} />
      ))}
    </>
  );
}
