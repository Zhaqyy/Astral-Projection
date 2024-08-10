import React, { forwardRef, useEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, QuadraticBezierLine } from "@react-three/drei";
import HolographicMaterial from "./Helper/Hologram";

const GhostM = forwardRef((props, ref) => {
  // const ref = useRef();
  const { nodes, materials, animations } = useGLTF("/models/ghost.glb");
  const { actions, names } = useAnimations(animations, ref);

  // useEffect(() => {
  //   actions[names[0]].reset().fadeIn(0.5).play()
  // }, [])

  return (
    <group ref={ref} {...props} dispose={null} name='ghost'>
      <skinnedMesh name='Ch36' geometry={nodes.Ch36.geometry} skeleton={nodes.Ch36.skeleton}>
        <HolographicMaterial
          fresnelAmount={0.75}
          fresnelOpacity={1}
          hologramBrightness={1.5}
          scanlineSize={1}
          signalSpeed={0}
          hologramColor={"#51a4de"}
          hologramOpacity={0.5}
          blinkFresnelOnly={false}
          enableBlinking={false}
          enableAdditive={false}
          side={"FrontSide"}
        />
      </skinnedMesh>
      <primitive object={nodes.mixamorig1Spine} />
    </group>
  );
});

useGLTF.preload("/models/ghost.glb");

const Tomb = forwardRef((props, ref) => {
  const { nodes, materials } = useGLTF("/models/tomb.glb");

  return (
    <group {...props} ref={ref} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.Tomb.geometry} material={nodes.Tomb.material} />
    </group>
  );
});

useGLTF.preload("/models/tomb.glb");

function Tether({ start, end, v1 = new THREE.Vector3(), v2 = new THREE.Vector3() }) {
  const ref = useRef();
  useFrame(() => ref.current.setPoints(start.current.getWorldPosition(v1), end.current.getWorldPosition(v2)), []);
  return <QuadraticBezierLine ref={ref} lineWidth={15} color='#51a4de' />;
}

export const Ghost = () => {
  const ghost = useRef();
  const tomb = useRef();
  const degreesToRadians = degrees => (degrees * Math.PI) / 180;

  return (
    <>
      <GhostM ref={ghost} position={[0, 1, 6]} scale={[0.7, 0.7, 0.7]} />
      <Tomb ref={tomb} scale={[0.7, 0.7, 0.7]} rotation={[degreesToRadians(20), 0, degreesToRadians(-10)]} position={[0, -0.25, 2.5]} />
      <Tether start={tomb} end={ghost} />
    </>
  );
};
