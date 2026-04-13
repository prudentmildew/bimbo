import { useEffect } from 'react';
import type { Group } from 'three';
import { useAppStore } from '../../store';
import { BimMesh } from './BimMesh';

export function SceneContent() {
  const objects = useAppStore((s) => s.objects);
  const modelSource = useAppStore((s) => s.modelSource);
  const gltfScene = useAppStore((s) => s.gltfScene) as Group | null;
  const loadProceduralModel = useAppStore((s) => s.loadProceduralModel);
  const disciplineVisibility = useAppStore((s) => s.disciplineVisibility);
  const typeVisibility = useAppStore((s) => s.typeVisibility);

  useEffect(() => {
    if (objects.length === 0) {
      loadProceduralModel();
    }
  }, [objects.length, loadProceduralModel]);

  if (modelSource === 'gltf' && gltfScene) {
    return <primitive object={gltfScene} />;
  }

  const visibleObjects = objects.filter((obj) => {
    if (!disciplineVisibility[obj.discipline]) return false;
    return typeVisibility[obj.ifcType] ?? true;
  });

  return (
    <>
      {visibleObjects.map((obj) => (
        <BimMesh key={obj.id} object={obj} />
      ))}
    </>
  );
}
