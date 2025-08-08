import { Suspense, useRef, useEffect, useState, memo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// 🧠 Model komponenti üçün memo ilə optimizasiya
const Model = memo(({ globalMouse, scale }) => {
    const { scene } = useGLTF('/models/Untitled.glb');
    const modelRef = useRef();

    useFrame(() => {
        if (modelRef.current && globalMouse.current) {
            const { x, y } = globalMouse.current;
            const xRot = (y / window.innerHeight - 0.5) * 0.8;
            const yRot = (x / window.innerWidth - 0.5) * 2.5;
            modelRef.current.rotation.x = THREE.MathUtils.lerp(modelRef.current.rotation.x, xRot, 0.1);
            modelRef.current.rotation.y = THREE.MathUtils.lerp(modelRef.current.rotation.y, yRot, 0.1);
        }
    });

    return (
        <primitive
            object={scene}
            ref={modelRef}
            scale={scale}
            receiveShadow
            castShadow
        />
    );
});

function ModelViewer() {
    const globalMouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    const [isMobile, setIsMobile] = useState(false);
    const [isMobile111, setIsMobile111] = useState(false);
    const [isSmallMobile111, setIsSmallMobile111] = useState(false);
    const [isSmallMobile, setIsSmallMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setIsMobile(width < 768);
            setIsMobile111(width < 768);
            setIsSmallMobile(width < 400);
            setIsSmallMobile111(width < 400);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const handleMouseMove = (event) => {
            globalMouse.current = { x: event.clientX, y: event.clientY };
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const canvasHeight = isSmallMobile ? 350 : isMobile ? 590 : 650;
    const scale = isSmallMobile ? 1.4 : isMobile ? 1.5 : 1.6;
    const scale111 = isSmallMobile111 ? 49 : isMobile111 ? 55 : 58;

    return (
        <div
            style={{
                width: '100%',
                height: `${canvasHeight}px`,
                marginTop: '-20px'
            }}
        >

            <Canvas
                camera={{ position: [0, 0, 26], fov: scale111 }}
                gl={{ antialias: true, alpha: true }}
                shadows
            >
                <ambientLight intensity={0.7} />
                <directionalLight position={[5, 5, 5]} intensity={1.2} />
                <directionalLight position={[-5, 5, -5]} intensity={0.6} />
                <Suspense fallback={null}>
                    <Environment preset="warehouse" background={false} />
                    <Model globalMouse={globalMouse} scale={scale} />
                </Suspense>
            </Canvas>
        </div>
    );
}

export default memo(ModelViewer);
