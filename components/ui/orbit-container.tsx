import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

export interface OrbitContainerProps {
  centerpiece: ReactNode;
  orbitingItems: {
    content: ReactNode;
    angle: number; // 0 to 360
    distance: number; // Radius from center
    delay?: number;
  }[];
  className?: string;
  isProcessing?: boolean;
}

export function OrbitContainer({ 
  centerpiece, 
  orbitingItems, 
  className = '', 
  isProcessing = false 
}: OrbitContainerProps) {
  return (
    <div className={`relative flex items-center justify-center min-h-[500px] w-full ${className}`}>
      
      {/* 3D Perspective Container */}
      <div 
        className="relative flex items-center justify-center w-full h-full"
        style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
      >
        {/* Orbital Rings (Background) */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          animate={{ rotateX: 60, rotateZ: isProcessing ? 360 : 0 }}
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
          style={{ transformStyle: 'preserve-3d' }}
        >
           <div className="absolute w-[300px] h-[300px] rounded-full border border-skin-border/20" />
           <div className="absolute w-[450px] h-[450px] rounded-full border border-skin-border/10" style={{ transform: 'translateZ(-10px)' }} />
           <div className="absolute w-[600px] h-[600px] rounded-full border border-skin-violet/10" style={{ transform: 'translateZ(-20px)' }} />
        </motion.div>

        {/* Centerpiece (The AI Brain) */}
        <div className="relative z-50">
          {centerpiece}
        </div>

        {/* Orbiting Items (Panels/Cards) */}
        {orbitingItems.map((item, index) => {
          // Convert polar coordinates to cartesian for layout
          const radians = (item.angle - 90) * (Math.PI / 180);
          const x = Math.cos(radians) * item.distance;
          const y = Math.sin(radians) * item.distance;

          return (
            <motion.div
              key={index}
              className="absolute z-40 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8, x: x * 0.5, y: y * 0.5 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                x, 
                // Add slight floating effect
                y: [y, y - 10, y],
              }}
              transition={{
                opacity: { duration: 0.8, delay: item.delay || 0 },
                scale: { type: "spring", stiffness: 100, delay: item.delay || 0 },
                y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: (item.delay || 0) + index * 0.5 }
              }}
            >
              <div 
                className="transform transition-transform duration-500 hover:scale-105 hover:z-50"
                style={{ 
                  // Slight counter-rotation if we were spinning the whole container, 
                  // but here we just keep them flat facing the user.
                  transformStyle: 'preserve-3d' 
                }}
              >
                {item.content}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
