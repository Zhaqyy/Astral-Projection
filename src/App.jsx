import { Canvas, useThree } from "@react-three/fiber";
import { Environment, OrbitControls, Sky, Cloud, CameraShake, Plane } from "@react-three/drei";
import { Suspense } from "react";
import { MathUtils } from "three";
// import { Grass } from './Grass'
import Grass from "./Helper/Grass.jsx";
// import { BlobGeometry } from "./BlobGeometry";
// import { Butterfly } from "./Butterfly";
// import { Particles } from "./Particles";
// import { button, useControls } from 'leva'
import { Perf } from "r3f-perf";
import { Ghost } from "./Ghost.jsx";
import Tree from "./Tree.jsx";

const rand = new Array(15).fill(0).map(() => ({
  position: [MathUtils.randFloat(0.5, 0.7), MathUtils.randFloat(0.5, 0.7), MathUtils.randFloat(0.5, 0.7)],
  scale: MathUtils.randFloat(0.5, 1),
}));

export default function App() {
  const degreesToRadians = (degrees) => (degrees * Math.PI) / 180;
  return (
    <>
      <Canvas
        dpr={1.5}
        camera={{ position: [0, 3, 50] }} //
        // gl={{ preserveDrawingBuffer: true }}
        fov={75}
        color="#000000"
      >
        <Perf position='top-left' />
        <Suspense fallback={null}>
          {/* <Grass>
            <BlobGeometry />
          </Grass> */}
          <Tree/>
          <Ghost />
          <Grass rotation={[0,degreesToRadians(153),0]} />
          {/* {rand.map((e, i) => (
            <Butterfly key={i} {...e} />
          ))} */}
          {/* <Clouds /> */}
          {/* <Sky azimuth={0.5} inclination={0.15} distance={100} /> */}
          {/* <ambientLight Intensity={500}/> */}
          {/* <pointLight position={[10, 10, 10]} /> */}
          <Environment
            preset='city'
            environmentIntensity={0.5}
          />
        </Suspense>
        {/* <Particles /> */}

        {/* <OrbitControls enableZoom={false} makeDefault autoRotate autoRotateSpeed={0.8} /> */}
        <OrbitControls />
        {/* <CameraShake maxRoll={0.2} maxPitch={0.2} maxYaw={0.2} /> */}
      </Canvas>
    </>
  );
}

function Clouds() {
  return (
    <group>
      <Cloud position={[-10, -6, -10]} speed={0.2} opacity={0.4} />
      <Cloud position={[10, 6, -15]} speed={0.2} opacity={0.25} />
      <Cloud position={[0, 10, 0]} speed={0.2} opacity={0.2} />
      <Cloud position={[0, -10, 0]} speed={0.2} opacity={0.2} />
      <Cloud position={[-10, -6, 15]} speed={0.2} opacity={0.3} />
      <Cloud position={[10, 6, 10]} speed={0.2} opacity={0.25} />
    </group>
  );
}
