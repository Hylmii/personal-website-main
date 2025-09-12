'use client';

import { motion } from 'framer-motion';

interface QuerySeparatorProps {
  type?: 'brackets' | 'sql' | 'arrows' | 'nodes';
  className?: string;
}

export const QuerySeparator: React.FC<QuerySeparatorProps> = ({ 
  type = 'sql', 
  className = '' 
}) => {
  const renderSeparator = () => {
    switch (type) {
      case 'brackets':
        return (
          <div className={`flex items-center justify-center space-x-4 ${className}`}>
            <motion.span
              className="text-blue-300 opacity-40 font-mono text-2xl"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {'{'}
            </motion.span>
            <div className="flex space-x-2">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-blue-400 rounded-full opacity-30"
                  animate={{ scale: [0.8, 1.2, 0.8] }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity, 
                    delay: i * 0.2 
                  }}
                />
              ))}
            </div>
            <motion.span
              className="text-blue-300 opacity-40 font-mono text-2xl"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            >
              {'}'}
            </motion.span>
          </div>
        );

      case 'sql':
        return (
          <div className={`flex items-center justify-center space-x-6 ${className}`}>
            <motion.span
              className="text-blue-400 opacity-30 font-mono text-sm"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              SELECT
            </motion.span>
            <motion.div
              className="w-20 h-[1px] bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-40"
              animate={{ scaleX: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.span
              className="text-blue-300 opacity-30 font-mono text-sm"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            >
              *
            </motion.span>
            <motion.div
              className="w-20 h-[1px] bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-40"
              animate={{ scaleX: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            />
            <motion.span
              className="text-blue-400 opacity-30 font-mono text-sm"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, delay: 2 }}
            >
              FROM
            </motion.span>
          </div>
        );

      case 'arrows':
        return (
          <div className={`flex items-center justify-center space-x-4 ${className}`}>
            <motion.span
              className="text-blue-300 opacity-40 text-xl"
              animate={{ x: [-5, 5, -5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ←
            </motion.span>
            <div className="flex space-x-1">
              {[...Array(7)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 h-1 bg-blue-400 rounded-full opacity-40"
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ 
                    duration: 1, 
                    repeat: Infinity, 
                    delay: i * 0.1 
                  }}
                />
              ))}
            </div>
            <motion.span
              className="text-blue-300 opacity-40 text-xl"
              animate={{ x: [-5, 5, -5] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            >
              →
            </motion.span>
          </div>
        );

      case 'nodes':
        return (
          <div className={`flex items-center justify-center space-x-8 ${className}`}>
            <motion.div
              className="relative"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity }}
            >
              <div className="w-4 h-4 border-2 border-blue-400 rounded-full opacity-40" />
              <div className="absolute inset-1 bg-blue-300 rounded-full opacity-30" />
            </motion.div>
            
            <motion.div
              className="w-16 h-[1px] bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400 opacity-30"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            
            <motion.div
              className="relative"
              animate={{ rotate: [360, 0] }}
              transition={{ duration: 8, repeat: Infinity }}
            >
              <div className="w-4 h-4 border-2 border-blue-300 rounded-full opacity-40" />
              <div className="absolute inset-1 bg-blue-400 rounded-full opacity-30" />
            </motion.div>
            
            <motion.div
              className="w-16 h-[1px] bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400 opacity-30"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            />
            
            <motion.div
              className="relative"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, delay: 1 }}
            >
              <div className="w-4 h-4 border-2 border-blue-400 rounded-full opacity-40" />
              <div className="absolute inset-1 bg-blue-300 rounded-full opacity-30" />
            </motion.div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="py-8 md:py-12">
      {renderSeparator()}
    </div>
  );
};
