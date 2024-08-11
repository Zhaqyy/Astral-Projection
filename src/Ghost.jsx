import React, { forwardRef, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useAnimations, QuadraticBezierLine, CatmullRomLine, Trail } from "@react-three/drei";
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

// function Tether({ start, end, v1 = new THREE.Vector3(), v2 = new THREE.Vector3() }) {
//   const ref = useRef();
//   useFrame(() => ref.current.setPoints(start.current.getWorldPosition(v1), end.current.getWorldPosition(v2)), []);
//   return <QuadraticBezierLine ref={ref} lineWidth={15} color='#51a4de' />;
// }


export const Ghost = () => {
  const ghost = useRef();
  const tomb = useRef();
  const degreesToRadians = degrees => (degrees * Math.PI) / 180;

  const { viewport } = useThree();

  const lerpFactor = 0.01;
  const idleTimeLimit = 2000;
  let lastMouseMoveTime = 0;
  let currentZ = 6;
  let targetZ = 6;
  let zLerpFactor = 0.008;
  let fullRotationInterval = Math.random() * 500 + 1000; // 5 to 10 seconds

  useEffect(() => {
    const handleMouseMove = () => {
      lastMouseMoveTime = performance.now();
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame(({ pointer, clock }) => {
    const time = clock.getElapsedTime();
    const mouseX = (pointer.x * viewport.width) / 2;
    const mouseY = (pointer.y * viewport.height) / 2;

    const ghostPos = ghost.current.position;

    // Lerp movement towards the mouse position
    ghostPos.x += (mouseX - ghostPos.x) * lerpFactor;
    ghostPos.y += (mouseY - ghostPos.y) * lerpFactor;

    // Z-axis movement interpolation
    if (Math.abs(targetZ - currentZ) < 0.01) {
      targetZ = THREE.MathUtils.randFloat(-3, 15);
    }
    currentZ += (targetZ - currentZ) * zLerpFactor;
    ghostPos.z = currentZ;

    // Calculate direction vector
    const targetDirection = new THREE.Vector3(mouseX, mouseY, ghostPos.z).sub(ghostPos).normalize();
    const currentDirection = new THREE.Vector3(0, 1, 0);

    // Create quaternions for smooth rotation
    const quaternion = new THREE.Quaternion().setFromUnitVectors(currentDirection, targetDirection);
    ghost.current.quaternion.slerp(quaternion, 0.5);

    // Idle behavior: Figure 8 rotation
    // if (performance.now() - lastMouseMoveTime > idleTimeLimit) {
    //   const figure8RotationX = Math.sin(time * 2) * 2; // Adjust amplitude and speed
    //   const figure8RotationY = Math.sin(time * 4) * 2;
    //   ghost.current.rotation.x = figure8RotationX;
    //   ghost.current.rotation.y = figure8RotationY;
    // }

    // Random full Z-axis rotation
    // if (performance.now() - lastMouseMoveTime < idleTimeLimit && time > fullRotationInterval) {
    //   ghost.current.rotation.z += Math.PI * 2; // Full rotation
    //   fullRotationInterval = time + Math.random() * 500 + 1000; // Set next rotation interval
    // }
  });

  return (
    <>
      <Trail
        width={10} // Width of the line
        color={"#51a4de"} // Color of the line
        length={3}
        attenuation={width => width}
      >
        <GhostM ref={ghost} position={[0, 1, 6]} scale={[0.7, 0.7, 0.7]} />
      </Trail>
      <Tomb ref={tomb} scale={[0.7, 0.7, 0.7]} rotation={[degreesToRadians(20), 0, degreesToRadians(-10)]} position={[0, -0.25, 2.5]} />
      {/* <Tether start={tomb} end={ghost} /> */}
    </>
  );
};

  // working
  // let translY = 0;
  // let translAccelleration = 0;
  // let angleZ = 0;
  // let angleAccelleration = 0;

  // useFrame(({ pointer }) => {
  //   const targetY = (pointer.y * viewport.height) / 2;

  //   // Translation logic
  //   translAccelleration += (targetY - translY) * 0.002;
  //   translAccelleration *= 0.95;
  //   translY += translAccelleration;

  //   // Rotation logic
  //   const dir = new THREE.Vector3(pointer.x, targetY, 0).sub(new THREE.Vector3(0, translY, 0)).normalize();
  //   const dirCos = dir.dot(new THREE.Vector3(0, 1, 0));
  //   const angle = Math.acos(dirCos) - Math.PI * 0.5;

  //   angleAccelleration += (angle - angleZ) * 0.01;
  //   angleAccelleration *= 0.85;
  //   angleZ += angleAccelleration;

  //   // Update ghost position and rotation
  //   ghost.current.position.set((pointer.x * viewport.width) / 2, translY, 6);
  //   ghost.current.rotation.set(angleZ, 0, angleZ, 'ZXY');
  // });
