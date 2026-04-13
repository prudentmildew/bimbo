import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { SceneContent } from './SceneContent';

export function ViewerCanvas() {
  return (
    <Canvas
      camera={{ position: [30, 20, 30], fov: 50 }}
      className="h-full w-full"
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 20, 10]} intensity={0.8} />
      <directionalLight position={[-10, 10, -10]} intensity={0.3} />
      <OrbitControls target={[0, 4.5, 0]} enableDamping dampingFactor={0.1} />
      <SceneContent />
      <gridHelper args={[40, 40, '#444444', '#333333']} />
    </Canvas>
  );
}
