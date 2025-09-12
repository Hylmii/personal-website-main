'use client';

import { motion } from 'framer-motion';

export const HeroQueryElements: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Hero-specific query elements */}
      <motion.div
        className="absolute top-20 right-10 text-blue-400 opacity-60 font-mono text-lg"
        animate={{ 
          y: [0, -10, 0],
          opacity: [0.4, 0.8, 0.4] 
        }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        SELECT name, role, expertise
      </motion.div>

      <motion.div
        className="absolute bottom-32 left-10 text-blue-500 opacity-50 font-mono text-sm"
        animate={{ 
          x: [0, 5, 0],
          rotate: [0, 2, 0] 
        }}
        transition={{ duration: 6, repeat: Infinity }}
      >
        FROM professionals WHERE skills = 'expert'
      </motion.div>

      {/* Floating search icons */}
      <motion.div
        className="absolute top-1/3 left-1/4 text-blue-600 opacity-70 text-2xl"
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 360] 
        }}
        transition={{ duration: 8, repeat: Infinity }}
      >
        🔍
      </motion.div>

      <motion.div
        className="absolute top-2/3 right-1/4 text-blue-500 opacity-60 text-xl"
        animate={{ 
          y: [0, -15, 0],
          x: [0, 10, 0] 
        }}
        transition={{ duration: 5, repeat: Infinity, delay: 2 }}
      >
        ⚡
      </motion.div>

      {/* Bracket decorations */}
      <motion.div
        className="absolute top-1/4 right-20 text-blue-300 opacity-50 font-mono text-4xl"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        {'{'}
      </motion.div>

      <motion.div
        className="absolute bottom-1/4 right-16 text-blue-300 opacity-50 font-mono text-4xl"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
      >
        {'}'}
      </motion.div>

      {/* Additional prominent query decorations */}
      <motion.div
        className="absolute top-10 left-1/3 text-blue-600 opacity-70 font-mono text-2xl font-bold"
        animate={{ 
          scale: [1, 1.05, 1],
          opacity: [0.5, 0.8, 0.5] 
        }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        {'< SQL />'}
      </motion.div>

      <motion.div
        className="absolute bottom-20 right-1/3 text-blue-500 opacity-60 font-mono text-lg"
        animate={{ 
          rotate: [0, 5, -5, 0],
          y: [0, -5, 0] 
        }}
        transition={{ duration: 6, repeat: Infinity }}
      >
        SELECT talents WHERE ready = true;
      </motion.div>

      <motion.div
        className="absolute top-1/2 left-10 text-blue-400 opacity-40 font-mono text-sm"
        animate={{ 
          x: [0, 10, 0],
          opacity: [0.3, 0.6, 0.3] 
        }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
      >
        // Available for opportunities
      </motion.div>
    </div>
  );
};

export const AboutQueryElements: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <motion.div
        className="absolute top-10 left-5 text-gray-300 opacity-15 font-mono text-xs hidden md:block"
        animate={{ opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        SELECT bio, experience, achievements
      </motion.div>

      <motion.div
        className="absolute bottom-20 right-5 text-blue-200 opacity-20 font-mono text-sm hidden lg:block"
        animate={{ x: [0, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
      >
        WHERE passion = true AND dedication = 'maximum'
      </motion.div>

      {/* Data visualization elements */}
      <motion.div
        className="absolute top-1/3 right-10 text-blue-300 opacity-25 text-lg"
        animate={{ rotate: [0, 180, 360] }}
        transition={{ duration: 10, repeat: Infinity }}
      >
        ◆
      </motion.div>

      <motion.div
        className="absolute bottom-1/3 left-10 text-blue-400 opacity-20 text-xl"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
      >
        ●
      </motion.div>
    </div>
  );
};

export const SkillsQueryElements: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <motion.div
        className="absolute top-5 right-10 text-blue-200 opacity-15 font-mono text-sm hidden md:block"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      >
        SELECT skill, proficiency FROM expertise
      </motion.div>

      <motion.div
        className="absolute bottom-10 left-5 text-gray-300 opacity-20 font-mono text-xs hidden lg:block"
        animate={{ opacity: [0.2, 0.3, 0.2] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        ORDER BY mastery_level DESC, years_experience DESC
      </motion.div>

      {/* Technical symbols */}
      <motion.div
        className="absolute top-1/4 left-5 text-blue-300 opacity-25 font-mono text-2xl"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 12, repeat: Infinity }}
      >
        {'</>'}
      </motion.div>

      <motion.div
        className="absolute top-2/3 right-5 text-blue-400 opacity-20 text-xl"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 4, repeat: Infinity, delay: 2 }}
      >
        ⚙️
      </motion.div>
    </div>
  );
};

export const ExperienceQueryElements: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <motion.div
        className="absolute top-10 left-10 text-blue-200 opacity-15 font-mono text-sm hidden md:block"
        animate={{ x: [0, 5, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
      >
        SELECT company, role, duration, achievements
      </motion.div>

      <motion.div
        className="absolute bottom-5 right-10 text-gray-300 opacity-20 font-mono text-xs hidden lg:block"
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        FROM career_history WHERE impact = 'significant'
      </motion.div>

      {/* Timeline elements */}
      <motion.div
        className="absolute top-1/3 right-5 text-blue-300 opacity-25 text-lg"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      >
        →
      </motion.div>

      <motion.div
        className="absolute bottom-1/3 left-5 text-blue-400 opacity-20 text-xl"
        animate={{ x: [0, 8, 0] }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
      >
        ↗
      </motion.div>
    </div>
  );
};

export const PortfolioQueryElements: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <motion.div
        className="absolute top-5 left-5 text-blue-200 opacity-15 font-mono text-sm hidden md:block"
        animate={{ opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 5, repeat: Infinity }}
      >
        SELECT project_name, tech_stack, status
      </motion.div>

      <motion.div
        className="absolute bottom-10 right-5 text-gray-300 opacity-20 font-mono text-xs hidden lg:block"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        FROM portfolio WHERE status = 'completed' AND showcase = true
      </motion.div>

      {/* Project symbols */}
      <motion.div
        className="absolute top-1/4 right-10 text-blue-300 opacity-25 text-2xl"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 5, repeat: Infinity }}
      >
        🔗
      </motion.div>

      <motion.div
        className="absolute bottom-1/4 left-10 text-blue-400 opacity-20 text-xl"
        animate={{ rotate: [0, 180, 360] }}
        transition={{ duration: 8, repeat: Infinity, delay: 1 }}
      >
        ◇
      </motion.div>
    </div>
  );
};

export const ContactQueryElements: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <motion.div
        className="absolute top-10 right-5 text-blue-200 opacity-15 font-mono text-sm hidden md:block"
        animate={{ x: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      >
        SELECT contact_method, availability, response_time
      </motion.div>

      <motion.div
        className="absolute bottom-5 left-5 text-gray-300 opacity-20 font-mono text-xs hidden lg:block"
        animate={{ opacity: [0.2, 0.3, 0.2] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        FROM communication_channels WHERE active = true
      </motion.div>

      {/* Communication symbols */}
      <motion.div
        className="absolute top-1/3 left-10 text-blue-300 opacity-25 text-2xl"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        📧
      </motion.div>

      <motion.div
        className="absolute bottom-1/3 right-10 text-blue-400 opacity-20 text-xl"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, delay: 2 }}
      >
        💬
      </motion.div>
    </div>
  );
};
