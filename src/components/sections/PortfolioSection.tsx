'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Section } from '../ui/Section';
import { projects } from '@/data/portfolio';
import { PortfolioQueryElements } from '../decorations/SectionQueryElements';
import { 
  CodeBracketIcon,
  ChartBarIcon,
  CheckCircleIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';

// Project categories for better organization
const projectCategories = [
  {
    id: 'enterprise',
    title: 'Enterprise Solutions',
    description: 'Large-scale business transformation and IT infrastructure projects',
    color: 'from-blue-600 to-blue-800',
    icon: BuildingOfficeIcon
  },
  {
    id: 'digital',
    title: 'Digital Innovation',
    description: 'Modern web applications and digital platform development',
    color: 'from-purple-600 to-purple-800',
    icon: CodeBracketIcon
  },
  {
    id: 'analytics',
    title: 'Data & Analytics',
    description: 'Business intelligence and data-driven solution implementations',
    color: 'from-green-600 to-green-800',
    icon: ChartBarIcon
  }
];

// Featured projects with detailed information
const featuredProjects = [
  {
    id: 'enterprise-transformation',
    title: 'Enterprise Digital Transformation Platform',
    company: 'PT Pertamina Gas Negara',
    category: 'Enterprise Solutions',
    duration: 'Feb 2024 - Feb 2025',
    status: 'Completed',
    description: 'Led comprehensive digital transformation initiative modernizing legacy systems and implementing cloud-native solutions for Indonesia\'s largest gas distribution company.',
    achievements: [
      'Reduced operational costs by $200K annually through process automation',
      'Improved system efficiency by 45% across 8 departments',
      'Successfully migrated 15+ critical applications to cloud infrastructure',
      'Implemented real-time monitoring reducing downtime by 60%'
    ],
    technologies: ['Cloud Computing', 'DevOps', 'System Integration', 'Infrastructure Management'],
    impact: {
      financial: '$200K+ annual cost savings',
      operational: '45% efficiency improvement',
      scale: '500+ employees, 8 departments'
    },
    metrics: [
      { label: 'Cost Reduction', value: '$200K+', description: 'Annual savings' },
      { label: 'Efficiency Gain', value: '45%', description: 'System performance' },
      { label: 'Applications Migrated', value: '15+', description: 'To cloud platform' },
      { label: 'Downtime Reduction', value: '60%', description: 'System reliability' }
    ],
    image: '/cybersecurity-bg.jpg'
  },
  {
    id: 'business-development',
    title: 'Sharia Capital Market Development Initiative',
    company: 'Indonesia Stock Exchange',
    category: 'Digital Innovation',
    duration: 'Apr 2024 - Apr 2025',
    status: 'Ongoing',
    description: 'Leading comprehensive investor education and market development initiatives for Sharia-compliant investment products, building awareness and adoption across Indonesia\'s capital market.',
    achievements: [
      'Increased investor awareness of Sharia capital market by 150%',
      'Successfully conducted 25+ educational workshops and sessions',
      'Built strategic network of 500+ Sharia-compliant investors',
      'Developed comprehensive training materials for Islamic finance principles'
    ],
    technologies: ['Financial Education', 'Investor Relations', 'Market Development', 'Islamic Finance'],
    impact: {
      financial: 'Enhanced market participation in Sharia investments',
      operational: '150% increase in investor awareness',
      scale: '500+ investors, nationwide reach'
    },
    metrics: [
      { label: 'Awareness Increase', value: '150%', description: 'Market education impact' },
      { label: 'Educational Sessions', value: '25+', description: 'Workshops conducted' },
      { label: 'Investor Network', value: '500+', description: 'Sharia-compliant investors' },
      { label: 'Training Materials', value: '100%', description: 'Comprehensive coverage' }
    ],
    image: '/cybersecurity-bg.jpg'
  },
  {
    id: 'travel-optimization',
    title: 'Southeast Asia Travel Platform Optimization',
    company: 'Traveloka',
    category: 'Data & Analytics',
    duration: 'Oct 2023 - Jun 2024',
    status: 'Completed',
    description: 'Optimized search algorithms and implemented analytics framework for Southeast Asia\'s leading travel platform, impacting millions of users across the region.',
    achievements: [
      'Improved search response time by 50% through algorithm optimization',
      'Implemented A/B testing framework for feature validation',
      'Designed analytics dashboard providing actionable business insights',
      'Enhanced mobile app performance for 60M+ active users'
    ],
    technologies: ['Mobile Development', 'Analytics', 'Performance Optimization', 'A/B Testing'],
    impact: {
      financial: 'Revenue optimization through improved UX',
      operational: '50% faster search performance',
      scale: '60M+ users, 8 countries'
    },
    metrics: [
      { label: 'Performance Gain', value: '50%', description: 'Search speed improvement' },
      { label: 'User Impact', value: '60M+', description: 'Active users affected' },
      { label: 'Geographic Reach', value: '8', description: 'Southeast Asian countries' },
      { label: 'Feature Testing', value: '100%', description: 'A/B test coverage' }
    ],
    image: '/cybersecurity-bg.jpg'
  },
  {
    id: 'cybersecurity-enterprise',
    title: 'Enterprise Cybersecurity & Business Development',
    company: 'PT Altimeda Cipta Visitama',
    category: 'Enterprise Solutions',
    duration: 'Oct 2022 - May 2023',
    status: 'Completed',
    description: 'Dual-role implementation of comprehensive cybersecurity solutions and business development strategies, enhancing company security posture while expanding market presence.',
    achievements: [
      'Enhanced cybersecurity posture by 40% through risk assessments',
      'Expanded business partnerships by 60% within 7 months',
      'Implemented robust security monitoring systems',
      'Generated new revenue streams through strategic partnerships'
    ],
    technologies: ['Cybersecurity', 'Risk Assessment', 'Business Development', 'Security Monitoring'],
    impact: {
      financial: '60% partnership expansion',
      operational: '40% security enhancement',
      scale: 'Enterprise-level security & business growth'
    },
    metrics: [
      { label: 'Security Enhancement', value: '40%', description: 'Overall posture improvement' },
      { label: 'Partnership Growth', value: '60%', description: 'Business expansion' },
      { label: 'Revenue Impact', value: 'Multiple', description: 'New streams created' },
      { label: 'Security Systems', value: '100%', description: 'Monitoring coverage' }
    ],
    image: '/cybersecurity-bg.jpg'
  }
];

export const PortfolioSection: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const selectedProjectData = featuredProjects.find(p => p.id === selectedProject);

  const filteredProjects = selectedCategory === 'all' 
    ? featuredProjects 
    : featuredProjects.filter(p => p.category === projectCategories.find(c => c.id === selectedCategory)?.title);

  return (
    <Section id="portfolio" className="py-20 bg-white relative">
      {/* Query Theme Decorations */}
      <PortfolioQueryElements />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl lg:text-5xl text-gray-900 mb-6">
            Projects & Achievements
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Delivering measurable business impact through strategic technology implementations 
            and innovative solutions across enterprise and startup environments
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Projects
          </button>
          {projectCategories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-5 h-5 mr-2" />
                {category.title}
              </button>
            );
          })}
        </motion.div>

        {/* Projects Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden"
            >
              {/* Project Image */}
              <div className="relative h-48 bg-gradient-to-br from-blue-600 to-blue-800 overflow-hidden">
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <BuildingOfficeIcon className="w-12 h-12 mx-auto mb-2 opacity-80" />
                    <p className="text-sm font-medium opacity-90">{project.company}</p>
                  </div>
                </div>
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    project.status === 'Completed'
                      ? 'bg-green-500 text-white'
                      : 'bg-blue-500 text-white'
                  }`}>
                    {project.status}
                  </span>
                </div>
              </div>

              {/* Project Content */}
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <CalendarIcon className="w-4 h-4 mr-1" />
                  {project.duration}
                </div>
                
                <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {project.description}
                </p>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {project.metrics.slice(0, 2).map((metric, idx) => (
                    <div key={idx} className="text-center p-2 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">{metric.value}</div>
                      <div className="text-xs text-gray-600">{metric.description}</div>
                    </div>
                  ))}
                </div>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.slice(0, 3).map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-md font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium">
                      +{project.technologies.length - 3} more
                    </span>
                  )}
                </div>

                {/* Action Button */}
                <button
                  onClick={() => setSelectedProject(project.id)}
                  className="w-full bg-gray-100 hover:bg-blue-600 hover:text-white text-gray-700 font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center"
                >
                  View Details
                  <ArrowTopRightOnSquareIcon className="w-4 h-4 ml-2" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Achievement Summary */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-8 lg:p-12 text-white"
        >
          <div className="text-center mb-8">
            <h3 className="font-heading text-2xl lg:text-3xl mb-4">
              Measurable Business Impact
            </h3>
            <p className="text-blue-100 text-lg max-w-3xl mx-auto">
              Consistently delivering quantifiable results across technology implementations and business transformations
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { metric: '$2M+', label: 'Project Value Delivered', description: 'Across enterprise initiatives' },
              { metric: '98%', label: 'Client Satisfaction', description: 'Consistent excellence rating' },
              { metric: '45%', label: 'Efficiency Improvement', description: 'Average system optimization' },
              { metric: '60M+', label: 'Users Impacted', description: 'Through platform optimizations' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl lg:text-4xl font-bold mb-2">{stat.metric}</div>
                <div className="font-semibold mb-1">{stat.label}</div>
                <div className="text-sm text-blue-200">{stat.description}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Project Detail Modal */}
      {selectedProject && selectedProjectData && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedProject(null)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-heading text-2xl lg:text-3xl text-gray-900 mb-2">
                  {selectedProjectData.title}
                </h3>
                <div className="flex items-center text-gray-600">
                  <BuildingOfficeIcon className="w-5 h-5 mr-2" />
                  <span className="font-medium">{selectedProjectData.company}</span>
                  <span className="mx-2">•</span>
                  <span>{selectedProjectData.duration}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Project Description */}
            <div className="mb-8">
              <h4 className="font-semibold text-gray-900 mb-3">Project Overview</h4>
              <p className="text-gray-600 leading-relaxed">
                {selectedProjectData.description}
              </p>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {selectedProjectData.metrics.map((metric, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{metric.value}</div>
                  <div className="text-sm font-medium text-gray-900 mb-1">{metric.label}</div>
                  <div className="text-xs text-gray-600">{metric.description}</div>
                </div>
              ))}
            </div>

            {/* Achievements */}
            <div className="mb-8">
              <h4 className="font-semibold text-gray-900 mb-4">Key Achievements</h4>
              <ul className="space-y-3">
                {selectedProjectData.achievements.map((achievement, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircleIcon className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Technologies */}
            <div className="mb-8">
              <h4 className="font-semibold text-gray-900 mb-4">Technologies & Methodologies</h4>
              <div className="flex flex-wrap gap-2">
                {selectedProjectData.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg font-medium text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Business Impact */}
            <div className="bg-blue-50 rounded-2xl p-6">
              <h4 className="font-semibold text-gray-900 mb-3">Business Impact</h4>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-600 mb-1">Financial Impact</div>
                  <div className="text-gray-900 font-semibold">{selectedProjectData.impact.financial}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600 mb-1">Operational Impact</div>
                  <div className="text-gray-900 font-semibold">{selectedProjectData.impact.operational}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600 mb-1">Scale & Reach</div>
                  <div className="text-gray-900 font-semibold">{selectedProjectData.impact.scale}</div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </Section>
  );
};
