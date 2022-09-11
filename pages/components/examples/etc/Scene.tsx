import createManifold from '@30ma19-02/noneuclid';
import type { Manifold, Point } from '@30ma19-02/noneuclid/build/main/lib';
import { Html, Line, OrbitControls, PerspectiveCamera, Sphere, Stats, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import { Canvas, useThree } from '@react-three/fiber';
import React from 'react';

const Loading: React.FC = (prop) => {
    const { progress } = useProgress();
    return <Html center>{progress} % loaded</Html>;
};

type State = {
    manifold: Manifold;
    stepTranslation: Point;
    stepRotation: Point;
}
type InitializeParam = {
    q: number;
    p: number;
    cw: (lambda: number) => THREE.Color;
    cf: (lambda: number) => THREE.Color;
}
const initializer: (param: InitializeParam) => State = ({ p, q }) => {
    const vertexAngle = 2 * Math.PI / q;
    const radialAngle = 2 * Math.PI / p;
    const cosLength = (Math.cos(radialAngle) + Math.cos(vertexAngle / 2) * Math.cos(vertexAngle / 2)) / (Math.sin(vertexAngle / 2) * Math.sin(vertexAngle / 2));
    const getLambda = (cosLength: number, length: number): number => {
        const acos = cosLength <= 1 ? Math.acos : Math.acosh;
        const absLambda = acos(cosLength) / length;
        const lambda = cosLength <= 1 ? absLambda : - absLambda;
        if (absLambda < 1e-5)
            return 0;
        return lambda;
    }
    const edgeLength = 1;
    const lambda = getLambda(cosLength, edgeLength);
    const manifold = createManifold(2, lambda);
    const stepTranslation = manifold.Point.fromTranslation([edgeLength, 0]);
    const stepRotation = manifold.Point.fromOrientation([[vertexAngle]]);
    return {
        manifold,
        stepTranslation,
        stepRotation,
    };
}

const Scene_: React.FC = () => {
    const size = useThree((state) => state.size);
    console.log(useThree((state) => state.camera));

    const poly = React.useCallback(
        (param: InitializeParam) => {
            const state = initializer(param)
            const origin = state.manifold.Point.fromPosition([0, 0]);
            const nextEdge: Point = state.manifold.Point.Identity()
                .transform(state.manifold.Point.fromOrientation([[Math.PI]]))
                .transform(state.stepRotation)
                .transform(state.stepTranslation)
                ;
            // TODO: optimize
            let poly: Point[] = [];
            {
                const vertex: Point[][] = [];
                {
                    const polygon_: Point[] = [];
                    for (let i = 1; i < param.p; i++) {
                        const top = polygon_.pop() ?? state.manifold.Point.Identity();
                        polygon_.push(top);
                        polygon_.push(top.transform(nextEdge));
                    }
                    const polygon: Point[][] = [];
                    for (let i = 0; i < polygon_.length; i++)
                        for (let j = 1; j < polygon_.length; j++)
                            for (let k = 2; k < polygon_.length; k++)
                                polygon.push([polygon_[i], polygon_[j], polygon_[k]]);
                    vertex.push(polygon.flat())
                }
                for (let i = 1; i < param.q; i++) {
                    const top = vertex.pop()!;
                    vertex.push(top);
                    vertex.push(top.flatMap(p => p.transform(state.stepRotation)));
                }
                poly = vertex.flat();
            }
            for (let i = 0; i < 1; i++) {
                const poly_: Point[][] = [poly];
                let o = state.manifold.Point.Identity();
                for (let j = 0; j < param.q; j++) {
                    poly_.push(poly.flatMap(p => {
                        let p_ = p;
                        for (let k = 0; k <= i; k++)
                            p_ = p_.transform(nextEdge);
                        return p_.transform(o);
                    }));
                    o = o.transform(state.stepRotation);
                }
                poly = poly_.flat();
            }
            const pointVertices: Point[] = poly.flat();
            const vertices: number[] = pointVertices.map(point => {
                const pr = new THREE.Vector3(...point.transform(origin).project);
                const or = new THREE.Vector3(...state.manifold.Point.Identity().project);
                const p = pr.sub(or).multiplyScalar(state.manifold.lambda > 0 ? 1 : -1);
                return [p.x, p.y, p.z]
            }).flat();
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3))
            return (
                <>
                    <mesh geometry={geometry}>
                        <meshBasicMaterial color={param.cf(state.manifold.lambda)} side={THREE.DoubleSide} />
                    </mesh>
                    <mesh geometry={geometry}>
                        <meshBasicMaterial color={param.cw(state.manifold.lambda)} wireframe />
                    </mesh>
                </>
            )
        },
        []
    );

    const cf = (lambda: number) => {
        if (lambda > 0)
            return new THREE.Color(Math.exp(-0.5 * Math.pow(lambda, 2)), 0, 0)
        if (lambda < 0)
            return new THREE.Color(0, 0, Math.exp(-0.5 * Math.pow(lambda, 2)))
        return new THREE.Color(0.05, 0, 0.05)
    }
    const cw = (lambda: number) => {
        return new THREE.Color(0, Math.exp(-0.4 * Math.pow(lambda, 2)), 0)
    };

    return (
        <>
            <color attach="background" args={[0, 0, 0]} />
            {/* <PerspectiveCamera aspect={size.width / size.height} rotation={new THREE.Euler(0, Math.PI / 2, -Math.PI / 6)} position={new THREE.Vector3(0, 5, -7.5)}> */}
            <PerspectiveCamera aspect={size.width / size.height}>
                <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} enableDamping={false} />
                {new Array(25).fill(0).map((_, i) => poly({ p: 3, q: i + 2, cw, cf }))}
            </PerspectiveCamera>
        </>
    );
};

const Scene: React.FC = (prop) => {
    return (
        <>
            <Canvas frameloop={'demand'}>
                <React.Suspense fallback={<Loading />}>
                    <Scene_ />
                    <Stats />
                </React.Suspense>
            </Canvas>
        </>
    );
};
export default Scene;
