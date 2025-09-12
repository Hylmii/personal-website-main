'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface FloatingElement {
  id: number;
  x: number;
  y: number;
  type: string;
  delay: number;
  duration: number;
}

export const QueryDecorations: React.FC = () => {
  const [floatingElements, setFloatingElements] = useState<FloatingElement[]>([]);

  useEffect(() => {
    const elements: FloatingElement[] = [];
    const queryElements = [
      '{ }', 'SELECT *', 'FROM', 'WHERE', '⚡', '🔍', '→', '←', '↑', '↓',
      '[ ]', '( )', 'JOIN', 'ORDER BY', '⚙️', '🔗', '◆', '◇', '●', '○'
    ];

    for (let i = 0; i < 15; i++) {
      elements.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        type: queryElements[Math.floor(Math.random() * queryElements.length)],
        delay: Math.random() * 10,
        duration: 20 + Math.random() * 30,
      });
    }

    setFloatingElements(elements);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Subtle background patterns */}
      <div className="absolute inset-0 opacity-[0.08]">
        <div className="absolute top-10 left-10 text-6xl font-mono text-blue-600 rotate-12">
          SELECT * FROM skills
        </div>
        <div className="absolute top-1/4 right-20 text-4xl font-mono text-gray-400 -rotate-6">
          WHERE expertise = 'advanced'
        </div>
        <div className="absolute bottom-1/4 left-1/4 text-5xl font-mono text-blue-400 rotate-3">
          ORDER BY experience DESC
        </div>
        <div className="absolute bottom-20 right-10 text-3xl font-mono text-gray-300 -rotate-12">
          JOIN projects ON skills.id
        </div>
      </div>

      {/* Floating animated elements */}
      {floatingElements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute text-blue-400 opacity-60 font-mono text-sm"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
          }}
          animate={{
            x: [0, 50, -30, 20, 0],
            y: [0, -30, 40, -20, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: element.duration,
            delay: element.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {element.type}
        </motion.div>
      ))}

      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-32 h-32 opacity-30">
        <motion.div
          className="text-blue-600 text-2xl font-mono"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {'{ query }'}
        </motion.div>
      </div>

      <div className="absolute top-0 right-0 w-32 h-32 opacity-25">
        <motion.div
          className="text-blue-400 text-xl font-mono rotate-45"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          SELECT *
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 w-32 h-32 opacity-20">
        <motion.div
          className="text-gray-400 text-lg font-mono -rotate-12"
          animate={{ y: [-5, 5, -5] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          FROM talents
        </motion.div>
      </div>

      <div className="absolute bottom-0 right-0 w-32 h-32 opacity-25">
        <motion.div
          className="text-blue-300 text-xl font-mono rotate-12"
          animate={{ x: [-3, 3, -3] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ORDER BY
        </motion.div>
      </div>

      {/* Data node connections */}
      <svg className="absolute inset-0 w-full h-full opacity-10">
        <defs>
          <linearGradient id="queryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#1E40AF" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        
        {/* Connecting lines between imaginary data nodes */}
        <motion.path
          d="M 50 50 Q 150 100 250 50 T 450 50"
          stroke="url(#queryGradient)"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
        />
        
        <motion.path
          d="M 100 200 Q 200 150 300 200 T 500 200"
          stroke="url(#queryGradient)"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", delay: 2 }}
        />
        
        <motion.path
          d="M 80 400 Q 180 350 280 400 T 480 400"
          stroke="url(#queryGradient)"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 12, repeat: Infinity, repeatType: "reverse", delay: 4 }}
        />
      </svg>
    </div>
  );
};
