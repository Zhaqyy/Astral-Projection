import React, { useEffect, useRef, forwardRef } from 'react'
import * as THREE from 'three'
import { ComputedAttribute } from '@react-three/drei'
// import Perlin from 'perlin.js'
import { createNoise3D } from "simplex-noise";

const noise3D = createNoise3D();
// Perlin.seed(Math.random())

const computeFlowerDensity = (geometry) => {
  const position = geometry.getAttribute('position')
  const density = []
  const vertex = new THREE.Vector3()
  for (let i = 0; i < position.count; i++) {
    vertex.fromBufferAttribute(position, i)
    const p = vertex.clone().multiplyScalar(1)
    const n = noise3D(...p.toArray())
    let m = THREE.MathUtils.mapLinear(n, -1, 1, 0, 1)
    if (m > 0.15) m = 0
    density.push(m)
  }
  return new THREE.Float32BufferAttribute(density, 1)
}

export const BlobGeometry = forwardRef((props, ref) => {
  const geom = useRef()

  // useEffect(() => {
  //   const vertex = new THREE.Vector3()
  //   const normal = new THREE.Vector3()
  //   let newPositionAttribute = []
  //   const positionAttribute = geom.current.getAttribute('position')
  //   const normalAttribute = geom.current.getAttribute('normal')
  //   for (let i = 0; i < positionAttribute.count; i++) {
  //     vertex.fromBufferAttribute(positionAttribute, i)
  //     normal.fromBufferAttribute(normalAttribute, i)
  //     const v = vertex.multiplyScalar(0.5)
  //     const n = noise3D(...v.toArray())
  //     vertex.add(normal.multiplyScalar(n * 0.3))
  //     newPositionAttribute.push(vertex.x, vertex.y, vertex.z)
  //   }
  //   geom.current.setAttribute('position', new THREE.Float32BufferAttribute(newPositionAttribute, 3))
  //   geom.current.attributes.position.needsUpdate = true
  //   geom.current.computeVertexNormals()
  // }, [])

  return (
    <mesh ref={ref}>
      <planeGeometry args={[10, 10,32,32]} ref={geom}>
        <ComputedAttribute
          name="density"
          compute={computeFlowerDensity}
          usage={THREE.StaticReadUsage}
        />
      </planeGeometry>
      <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
    </mesh>
  )
})
