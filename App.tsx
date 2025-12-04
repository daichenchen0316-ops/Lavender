import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader } from '@react-three/drei';
import { Scene } from './components/Scene';
import { UIOverlay } from './components/UIOverlay';
import { AppState } from './types';
import { CONFIG } from './constants';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppState>(AppState.SCATTERED);
  
  // Color State
  const [treeColor, setTreeColor] = useState('#002A18');
  const [ornamentColorA, setOrnamentColorA] = useState('#FFD700');
  const [ornamentColorB, setOrnamentColorB] = useState('#D90429');

  const toggleMode = () => {
    setMode((prev) => (prev === AppState.SCATTERED ? AppState.TREE_SHAPE : AppState.SCATTERED));
  };

  return (
    <div className="w-full h-screen bg-black relative">
      
      {/* 3D Scene */}
      <div className="absolute inset-0 z-0">
        <Canvas
          dpr={[1, 2]}
          gl={{ 
            antialias: false, 
            stencil: false,
            depth: true,
            alpha: false
          }}
          camera={{ position: [0, 0, 20], fov: 45 }}
        >
          <color attach="background" args={[CONFIG.COLORS.BG_GRADIENT_START]} />
          <fog attach="fog" args={[CONFIG.COLORS.BG_GRADIENT_START, 20, 60]} />
          
          <Suspense fallback={null}>
            <Scene 
                mode={mode} 
                treeColor={treeColor}
                ornamentColorA={ornamentColorA}
                ornamentColorB={ornamentColorB}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* UI Layer */}
      <UIOverlay 
        mode={mode} 
        onToggle={toggleMode}
        treeColor={treeColor}
        setTreeColor={setTreeColor}
        ornamentColorA={ornamentColorA}
        setOrnamentColorA={setOrnamentColorA}
        ornamentColorB={ornamentColorB}
        setOrnamentColorB={setOrnamentColorB}
      />
      
      <Loader 
        containerStyles={{ background: '#000000' }} 
        innerStyles={{ width: '40vw', height: '2px', background: '#333' }} 
        barStyles={{ background: '#FFD700', height: '2px' }}
        dataStyles={{ color: '#FFD700', fontFamily: 'serif', marginTop: '1rem' }}
      />
    </div>
  );
};

export default App;