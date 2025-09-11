'use client';

import { motion } from 'framer-motion';
import { Section } from '../ui/Section';
import { experiences } from '@/data/portfolio';
import { CalendarIcon, BuildingOfficeIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export const ExperienceSection: React.FC = () => {
  return (
    <Section id="experience" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl lg:text-5xl text-gray-900 mb-6">
            Professional Experience
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A track record of delivering exceptional results across diverse industries and challenging projects
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 lg:left-1/2 lg:transform lg:-translate-x-px top-0 bottom-0 w-0.5 bg-blue-600"></div>

          <div className="space-y-12">
            {experiences.map((experience, index) => (
              <motion.div
                key={experience.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}
              >
                {/* Timeline marker */}
                <div className="absolute left-8 lg:left-1/2 lg:transform lg:-translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg z-10"></div>

                {/* Content card */}
                <div className={`w-full lg:w-5/12 ml-20 lg:ml-0 ${
                  index % 2 === 0 ? 'lg:mr-8' : 'lg:ml-8'
                }`}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <BuildingOfficeIcon className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {experience.position}
                          </h3>
                          <p className="text-blue-600 font-medium">{experience.company}</p>
                        </div>
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="flex items-center text-gray-600 mb-4">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      <span className="text-sm">
                        {experience.startDate} - {experience.endDate}
                      </span>
                    </div>

                    {/* Responsibilities */}
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-900 mb-3">Key Responsibilities:</h4>
                      <ul className="space-y-2">
                        {experience.responsibilities.slice(0, 3).map((responsibility, idx) => (
                          <li key={idx} className="flex items-start">
                            <CheckCircleIcon className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600 text-sm">{responsibility}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Achievements */}
                    {experience.achievements && experience.achievements.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Key Achievements:</h4>
                        <ul className="space-y-2">
                          {experience.achievements.slice(0, 2).map((achievement, idx) => (
                            <li key={idx} className="flex items-start">
                              <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                              <span className="text-gray-600 text-sm font-medium">{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 bg-white rounded-3xl p-8 lg:p-12 shadow-xl"
        >
          <div className="text-center mb-8">
            <h3 className="font-heading text-2xl lg:text-3xl text-gray-900 mb-4">
              Career Highlights
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Measurable impact across technology, security, and business transformation initiatives
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                metric: "5+",
                label: "Years Experience",
                description: "In IT consulting and cybersecurity"
              },
              {
                metric: "50+",
                label: "Projects Delivered",
                description: "Across various industries"
              },
              {
                metric: "15+",
                label: "Certifications",
                description: "Industry-recognized credentials"
              },
              {
                metric: "99.9%",
                label: "Client Satisfaction",
                description: "Consistent excellence delivery"
              }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl lg:text-4xl font-bold text-blue-600 mb-2">
                  {stat.metric}
                </div>
                <div className="font-semibold text-gray-900 mb-1">{stat.label}</div>
                <div className="text-sm text-gray-600">{stat.description}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  );
};
