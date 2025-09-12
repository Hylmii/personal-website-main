'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Section } from '../ui/Section';
import { personalInfo } from '@/data/portfolio';
import { HeroQueryElements } from '../decorations/SectionQueryElements';

export const HeroSection: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleScrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToPortfolio = () => {
    const element = document.querySelector('#portfolio');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Section 
      id="home" 
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-white"
    >
      {/* Query Theme Decorations */}
      <HeroQueryElements />
      
      {/* Professional Clean Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100">
        {/* Subtle geometric pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg width="60" height="60" viewBox="0 0 60 60" className="absolute inset-0 w-full h-full">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="30" cy="30" r="1" fill="#000" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        {/* Elegant accent elements */}
        <div className="absolute top-20 left-10 w-2 h-20 bg-gradient-to-b from-blue-600 to-blue-800 rounded-full opacity-20" />
        <div className="absolute bottom-20 right-10 w-2 h-20 bg-gradient-to-b from-blue-600 to-blue-800 rounded-full opacity-20" />
        <div className="absolute top-1/2 left-20 w-20 h-2 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full opacity-10" />
        <div className="absolute top-1/3 right-20 w-20 h-2 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full opacity-10" />
      </div>
      
      {/* Content Grid Layout */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column - Content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Professional greeting */}
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-200 mb-6">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></span>
                <span className="text-sm font-medium text-gray-700">Available for opportunities</span>
              </div>
              
              <h1 className="font-display text-4xl lg:text-6xl xl:text-7xl text-gray-900 mb-6 leading-tight">
                Hi, I'm{' '}
                <span className="relative">
                  <span className="text-blue-600">{personalInfo.name.split(' ')[0]}</span>
                  <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full opacity-30"></div>
                </span>
              </h1>
              
              <h2 className="font-heading text-xl lg:text-2xl xl:text-3xl text-gray-700 mb-8 font-medium">
                {personalInfo.jobTitle}
              </h2>
              
              <p className="font-body text-lg lg:text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl">
                {personalInfo.intro}
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  onClick={handleScrollToContact}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Get In Touch
                </Button>
                <Button
                  onClick={handleScrollToPortfolio}
                  variant="outline"
                  className="border-2 border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300"
                >
                  View Portfolio
                </Button>
              </div>
              
              {/* Professional Stats */}
              <div className="grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-gray-200">
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-blue-600">5+</div>
                  <div className="text-sm text-gray-600">Years Experience</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-blue-600">50+</div>
                  <div className="text-sm text-gray-600">Projects Completed</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-blue-600">15+</div>
                  <div className="text-sm text-gray-600">Certifications</div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Right Column - Professional Image */}
          <div className="order-1 lg:order-2 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              {/* Main image container */}
              <div className="relative w-80 h-80 lg:w-96 lg:h-96">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl transform rotate-6"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl transform -rotate-6 opacity-10"></div>
                
                {/* Image */}
                <div className="relative w-full h-full rounded-3xl overflow-hidden bg-white p-4 shadow-2xl">
                  <Image
                    src={personalInfo.avatar}
                    alt={personalInfo.name}
                    fill
                    className="object-cover rounded-2xl"
                    priority
                  />
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg">
                  💼
                </div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg">
                  ✓
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-500 mb-2">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1 h-3 bg-blue-600 rounded-full mt-2"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
};
