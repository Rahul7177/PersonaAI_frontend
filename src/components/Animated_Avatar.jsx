import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

class AudioAnalyzer {
  constructor() {
    this.analyser = null;
    this.dataArray = null;
    this.audioContext = null;
  }

  async initialize() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.analyser = this.audioContext.createAnalyser();
      const source = this.audioContext.createMediaStreamSource(stream);
      source.connect(this.analyser);
      this.analyser.fftSize = 32;
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  }

  getVolume() {
    if (!this.analyser) return 0;
    this.analyser.getByteFrequencyData(this.dataArray);
    return Math.max(...this.dataArray) / 255;
  }
}

function Avatar({ analyzer }) {
  const mouthRef = useRef();
  const smoothVolume = useRef(0);

  useFrame(() => {
    if (!analyzer) return;
    const volume = analyzer.getVolume();
    smoothVolume.current = 0.8 * smoothVolume.current + 0.2 * volume;
    
    if (mouthRef.current) {
      const scaleY = 1 + smoothVolume.current * 2;
      mouthRef.current.scale.y = scaleY;
    }
  });

  return (
    <group position={[0, -1, 0]}>
      {/* Head */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#f0c9b1" />
      </mesh>
      
      {/* Mouth */}
      <mesh 
        ref={mouthRef} 
        position={[0, 1.2, 0.9]} 
        scale={[0.5, 1, 0.1]}
      >
        <boxGeometry />
        <meshStandardMaterial color="#c96d6d" />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[-0.3, 1.8, 0.9]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.3, 1.8, 0.9]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
    </group>
  );
}

function Scene() {
  const [analyzer, setAnalyzer] = useState(null);

  useEffect(() => {
    const audioAnalyzer = new AudioAnalyzer();
    audioAnalyzer.initialize().then(() => setAnalyzer(audioAnalyzer));
    return () => analyzer?.audioContext?.close();
  }, []);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Avatar analyzer={analyzer} />
      <OrbitControls enableZoom={false} />
    </>
  );
}

export default function AnimatedAvatar() {
  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <Canvas camera={{ position: [0, 0, 3] }}>
        <Scene />
      </Canvas>
      <div style={{ position: 'absolute', top: 20, left: 20 }}>
        Allow microphone access for mouth animation
      </div>
    </div>
  );
}