import { Canvas } from '@react-three/fiber';
import { useCallback, useState } from 'react';
import { parseGltfFile } from '../../lib/model/gltf-adapter';
import { useAppStore } from '../../store';
import { CameraRig } from './CameraRig';
import { ClipPlaneHelper } from './ClipPlaneHelper';
import { SceneContent } from './SceneContent';

function DeselectPlane() {
  const selectObject = useAppStore((s) => s.selectObject);
  return (
    <mesh
      position={[0, 0, 0]}
      visible={false}
      onClick={() => selectObject(null)}
    >
      <planeGeometry args={[1000, 1000]} />
      <meshBasicMaterial />
    </mesh>
  );
}

export function ViewerCanvas() {
  const loadGltfObjects = useAppStore((s) => s.loadGltfObjects);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      setError(null);

      const file = e.dataTransfer.files[0];
      if (!file) return;

      const name = file.name.toLowerCase();
      if (!name.endsWith('.gltf') && !name.endsWith('.glb')) {
        setError('Please drop a .glTF or .glb file');
        return;
      }

      try {
        const { objects, scene } = await parseGltfFile(file);
        loadGltfObjects(objects, scene);
      } catch {
        setError('Failed to load model');
      }
    },
    [loadGltfObjects],
  );

  return (
    <div
      style={{ position: 'relative', width: '100%', height: '100%' }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {dragging && (
        <div style={dropOverlayStyle}>
          <p style={{ fontSize: 18, fontWeight: 600 }}>
            Drop .glTF / .glb file
          </p>
        </div>
      )}
      {error && (
        <div style={errorStyle}>
          {error}
          <button
            type="button"
            onClick={() => setError(null)}
            style={errorCloseStyle}
          >
            x
          </button>
        </div>
      )}
      <Canvas
        camera={{ position: [30, 20, 30], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
        gl={{ localClippingEnabled: true }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 20, 10]} intensity={0.8} />
        <directionalLight position={[-10, 10, -10]} intensity={0.3} />
        <CameraRig />
        <DeselectPlane />
        <ClipPlaneHelper />
        <SceneContent />
        <gridHelper args={[40, 40, '#444444', '#333333']} />
      </Canvas>
    </div>
  );
}

const dropOverlayStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  zIndex: 20,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(79, 195, 247, 0.15)',
  border: '2px dashed #4fc3f7',
  borderRadius: 8,
  color: '#4fc3f7',
  pointerEvents: 'none',
};

const errorStyle: React.CSSProperties = {
  position: 'absolute',
  top: 8,
  right: 8,
  zIndex: 20,
  background: '#991b1b',
  color: '#fecaca',
  padding: '6px 12px',
  borderRadius: 4,
  fontSize: 12,
  display: 'flex',
  alignItems: 'center',
  gap: 8,
};

const errorCloseStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#fecaca',
  cursor: 'pointer',
  fontSize: 12,
};
