import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import dev1Animation from '../assets/dev1.json';

export default function LottiePlayer() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let anim = null;
    try {
      anim = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: dev1Animation,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid meet',
          clearCanvas: true,
          progressiveLoad: true,
          hideOnTransparent: true,
        }
      });
    } catch (e) {
      console.error("Lottie load error", e);
    }

    return () => {
      if (anim) anim.destroy();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full flex items-center justify-center bg-transparent"
    />
  );
}
