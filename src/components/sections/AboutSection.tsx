'use client';

import { motion } from 'framer-motion';
import { Section } from '../ui/Section';
import { SectionTitle } from '../ui/SectionTitle';
import { aboutMe } from '@/data/portfolio';
import { AboutQueryElements } from '../decorations/SectionQueryElements';
import { CheckCircleIcon, AcademicCapIcon, BriefcaseIcon, TrophyIcon } from '@heroicons/react/24/outline';

export const AboutSection: React.FC = () => {
  const highlights = [
    {
      icon: BriefcaseIcon,
      title: "Professional Experience",
      description: "2+ years in IT consulting and business solutions"
    },
    {
      icon: AcademicCapIcon,
      title: "Education & Certifications",
      description: "15+ industry certifications in cybersecurity and cloud"
    },
    {
      icon: TrophyIcon,
      title: "Project Success",
      description: "50+ successful implementations across various industries"
    }
  ];

  return (
    <Section id="about" className="py-20 bg-gray-50 relative">
      {/* Query Theme Decorations */}
      <AboutQueryElements />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl lg:text-5xl text-gray-900 mb-6">
            About Me
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transforming business challenges into technical solutions with expertise in cybersecurity and strategic IT consulting
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="font-heading text-2xl lg:text-3xl text-gray-900 mb-6">
              Bridging Technology & Business Strategy
            </h3>
            <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
              <p>
                As an experienced IT professional, I specialize in integrating cutting-edge technology solutions 
                with strategic business objectives. My expertise spans cybersecurity, application development, 
                and systems analysis.
              </p>
              <p>
                I have a proven track record of enhancing operational efficiency and supporting critical 
                business decision-making through innovative technology implementations. My approach combines 
                technical excellence with deep business acumen.
              </p>
              <p>
                Currently focused on cloud security, digital transformation, and helping organizations 
                build resilient, scalable technology infrastructures that drive business growth.
              </p>
            </div>

            {/* Key Strengths */}
            <div className="mt-8">
              <h4 className="font-semibold text-gray-900 mb-4">Core Competencies:</h4>
              <div className="grid grid-cols-2 gap-4">
                {[
                  'Cybersecurity Strategy',
                  'Cloud Architecture',
                  'Business Analysis',
                  'Project Management',
                  'Risk Assessment',
                  'Digital Transformation'
                ].map((skill, index) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center"
                  >
                    <CheckCircleIcon className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{skill}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Professional Stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {highlights.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.2 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mr-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Values & Approach */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl"
        >
          <div className="text-center mb-12">
            <h3 className="font-heading text-2xl lg:text-3xl text-gray-900 mb-4">
              My Professional Approach
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Built on the foundation of integrity, innovation, and results-driven solutions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Strategic Thinking",
                description: "Aligning technology initiatives with business objectives for maximum impact and ROI"
              },
              {
                title: "Security-First Mindset",
                description: "Implementing robust security measures from the ground up in every solution"
              },
              {
                title: "Continuous Innovation",
                description: "Staying ahead of industry trends and emerging technologies to drive competitive advantage"
              }
            ].map((principle, index) => (
              <motion.div
                key={principle.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 + index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">{index + 1}</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-3">{principle.title}</h4>
                <p className="text-gray-600">{principle.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  );
};
