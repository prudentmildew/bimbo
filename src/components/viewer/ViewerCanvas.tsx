import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useAppStore } from '../../store';
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
  return (
    <Canvas
      camera={{ position: [30, 20, 30], fov: 50 }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 20, 10]} intensity={0.8} />
      <directionalLight position={[-10, 10, -10]} intensity={0.3} />
      <OrbitControls target={[0, 4.5, 0]} enableDamping dampingFactor={0.1} />
      <DeselectPlane />
      <SceneContent />
      <gridHelper args={[40, 40, '#444444', '#333333']} />
    </Canvas>
  );
}
