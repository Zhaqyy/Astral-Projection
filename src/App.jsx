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

const rand = new Array(15).fill(0).map(() => ({
  position: [MathUtils.randFloat(0.5, 0.7), MathUtils.randFloat(0.5, 0.7), MathUtils.randFloat(0.5, 0.7)],
  scale: MathUtils.randFloat(0.5, 1),
}));

export default function App() {
  return (
    <>
      <Canvas
        dpr={1.5}
        camera={{ position: [15, 15, 10] }} //
        // gl={{ preserveDrawingBuffer: true }}
      >
        <Perf position='top-left' />
        <Suspense fallback={null}>
          {/* <Grass>
            <BlobGeometry />
          </Grass> */}
          <Grass />
          {/* {rand.map((e, i) => (
            <Butterfly key={i} {...e} />
          ))} */}
          <Ghost />
          {/* <Clouds /> */}
          <Sky azimuth={0.5} inclination={0.55} distance={100} />
          {/* <ambientLight Intensity={500}/> */}
          {/* <pointLight position={[10, 10, 10]} /> */}
          <Environment
            preset='sunset'
            // environmentIntensity={1.5}
          />
        </Suspense>
        {/* <Particles /> */}

        {/* <OrbitControls enableZoom={false} makeDefault autoRotate autoRotateSpeed={0.8} /> */}
        <OrbitControls makeDefault />
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
