'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Section } from '../ui/Section';
import { skills } from '@/data/portfolio';
import { 
  CloudIcon, 
  ShieldCheckIcon, 
  CogIcon, 
  ChartBarIcon,
  CommandLineIcon,
  UserGroupIcon,
  StarIcon,
  CheckCircleIcon,
  XMarkIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const skillCategories = [
  {
    icon: ShieldCheckIcon,
    title: "Cybersecurity",
    color: "from-red-500 to-red-600",
    bgColor: "bg-gradient-to-br from-red-50 to-red-100",
    description: "Security frameworks and threat analysis",
    level: "Expert",
    details: {
      overview: "Comprehensive cybersecurity expertise with focus on enterprise security architecture and threat mitigation strategies.",
      experience: "5+ years in cybersecurity implementations and security audits",
      keyAreas: [
        "Security Architecture Design",
        "Threat Analysis & Intelligence",
        "Security Policy Development",
        "Compliance & Risk Management",
        "Security Incident Response"
      ],
      tools: ["Splunk", "Nessus", "Wireshark", "Metasploit", "Burp Suite"],
      achievements: [
        "Led security transformation for 50+ enterprise clients",
        "Reduced security incidents by 85% through proactive measures",
        "Certified in multiple security frameworks (ISO 27001, NIST)"
      ]
    }
  },
  {
    icon: CloudIcon,
    title: "Cloud Technologies",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
    description: "AWS, Azure, and cloud architecture",
    level: "Advanced",
    details: {
      overview: "Expert in cloud infrastructure design, migration strategies, and multi-cloud environments with emphasis on scalability and cost optimization.",
      experience: "4+ years in cloud architecture and DevOps implementations",
      keyAreas: [
        "Cloud Architecture Design",
        "Infrastructure as Code",
        "Container Orchestration",
        "Serverless Computing",
        "Cloud Security & Compliance"
      ],
      tools: ["AWS", "Azure", "Docker", "Kubernetes", "Terraform", "CloudFormation"],
      achievements: [
        "Migrated 100+ applications to cloud with 99.9% uptime",
        "Reduced infrastructure costs by 40% through optimization",
        "Architected auto-scaling solutions handling 10M+ requests/day"
      ]
    }
  },
  {
    icon: CogIcon,
    title: "DevOps & Automation",
    color: "from-green-500 to-green-600",
    bgColor: "bg-gradient-to-br from-green-50 to-green-100",
    description: "CI/CD, containerization, and infrastructure",
    level: "Advanced",
    details: {
      overview: "Specialized in building robust CI/CD pipelines and automation frameworks that accelerate development cycles while maintaining quality.",
      experience: "4+ years in DevOps practices and automation implementations",
      keyAreas: [
        "CI/CD Pipeline Design",
        "Infrastructure Automation",
        "Monitoring & Observability",
        "Configuration Management",
        "Release Management"
      ],
      tools: ["Jenkins", "GitLab CI", "Ansible", "Prometheus", "Grafana", "ELK Stack"],
      achievements: [
        "Reduced deployment time from hours to minutes",
        "Achieved 99.99% application availability",
        "Automated 90% of infrastructure provisioning processes"
      ]
    }
  },
  {
    icon: CommandLineIcon,
    title: "Programming",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
    description: "Full-stack development and scripting",
    level: "Expert",
    details: {
      overview: "Full-stack developer with expertise in modern frameworks and clean code practices, focusing on scalable and maintainable applications.",
      experience: "6+ years in software development across various domains",
      keyAreas: [
        "Frontend Development",
        "Backend API Design",
        "Database Architecture",
        "Mobile App Development",
        "Code Quality & Testing"
      ],
      tools: ["React", "Node.js", "Python", "TypeScript", "PostgreSQL", "MongoDB"],
      achievements: [
        "Built 20+ production applications serving 100K+ users",
        "Maintained 95%+ code coverage in critical systems",
        "Led development teams of 5-10 engineers"
      ]
    }
  },
  {
    icon: ChartBarIcon,
    title: "Business Analysis",
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-gradient-to-br from-orange-50 to-orange-100",
    description: "Requirements gathering and process optimization",
    level: "Advanced",
    details: {
      overview: "Strategic business analyst with expertise in digital transformation and process optimization, bridging technical and business requirements.",
      experience: "3+ years in business analysis and process improvement",
      keyAreas: [
        "Requirements Engineering",
        "Process Mapping & Optimization",
        "Stakeholder Management",
        "Data Analysis & Insights",
        "Digital Transformation"
      ],
      tools: ["Jira", "Confluence", "Tableau", "Power BI", "Lucidchart", "Miro"],
      achievements: [
        "Optimized business processes reducing operational costs by 30%",
        "Led digital transformation initiatives for 15+ departments",
        "Improved decision-making through data-driven insights"
      ]
    }
  },
  {
    icon: UserGroupIcon,
    title: "Leadership",
    color: "from-indigo-500 to-indigo-600",
    bgColor: "bg-gradient-to-br from-indigo-50 to-indigo-100",
    description: "Team management and stakeholder communication",
    level: "Expert",
    details: {
      overview: "Proven leader with experience managing cross-functional teams and driving organizational change in technology-focused environments.",
      experience: "5+ years in leadership roles across technology and business functions",
      keyAreas: [
        "Team Building & Development",
        "Strategic Planning",
        "Stakeholder Communication",
        "Change Management",
        "Performance Optimization"
      ],
      tools: ["Slack", "Microsoft Teams", "Asana", "Monday.com", "OKR Frameworks"],
      achievements: [
        "Led teams of 15+ professionals across multiple projects",
        "Achieved 95%+ team satisfaction scores consistently",
        "Delivered $2M+ projects on time and under budget"
      ]
    }
  }
];

const certifications = [
  {
    name: "AWS Certified",
    description: "Solutions Architect",
    status: "Certified"
  },
  {
    name: "CISSP",
    description: "Information Security",
    status: "In Progress"
  },
  {
    name: "CompTIA Security+",
    description: "Security Fundamentals",
    status: "Certified"
  },
  {
    name: "ITIL Foundation",
    description: "Service Management",
    status: "Certified"
  }
];

export const SkillsSection: React.FC = () => {
  const [selectedSkill, setSelectedSkill] = useState<typeof skillCategories[0] | null>(null);

  const SkillModal = () => {
    if (!selectedSkill) return null;

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedSkill(null)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`${selectedSkill.bgColor} p-8 rounded-t-3xl relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-64 h-64 opacity-20">
                <div className={`w-full h-full rounded-full bg-gradient-to-r ${selectedSkill.color}`}></div>
              </div>
              
              <div className="relative z-10 flex items-start justify-between">
                <div className="flex items-center space-x-6">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${selectedSkill.color} flex items-center justify-center shadow-xl`}>
                    <selectedSkill.icon className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedSkill.title}</h2>
                    <div className="flex items-center space-x-3">
                      <span className="px-4 py-2 bg-white rounded-full text-sm font-semibold text-gray-700 shadow-sm">
                        {selectedSkill.level}
                      </span>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon 
                            key={i} 
                            className={`w-5 h-5 ${
                              i < (selectedSkill.level === 'Expert' ? 5 : 4) 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSkill(null)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <XMarkIcon className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 space-y-8">
              {/* Overview */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Overview</h3>
                <p className="text-gray-600 leading-relaxed">{selectedSkill.details.overview}</p>
                <div className="mt-4 flex items-center space-x-2 text-sm text-gray-500">
                  <InformationCircleIcon className="w-4 h-4" />
                  <span>{selectedSkill.details.experience}</span>
                </div>
              </div>

              {/* Key Areas */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Areas of Expertise</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {selectedSkill.details.keyAreas.map((area, index) => (
                    <motion.div
                      key={area}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl"
                    >
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${selectedSkill.color}`}></div>
                      <span className="text-gray-700 font-medium">{area}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Tools & Technologies */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Tools & Technologies</h3>
                <div className="flex flex-wrap gap-3">
                  {selectedSkill.details.tools.map((tool, index) => (
                    <motion.span
                      key={tool}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className={`px-4 py-2 bg-gradient-to-r ${selectedSkill.color} text-white rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-shadow`}
                    >
                      {tool}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Key Achievements */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Achievements</h3>
                <div className="space-y-3">
                  {selectedSkill.details.achievements.map((achievement, index) => (
                    <motion.div
                      key={achievement}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{achievement}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <Section id="skills" className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-4xl lg:text-5xl text-gray-900 mb-6">
            Technical <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Expertise</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive skill set across cybersecurity, cloud technologies, and enterprise solutions
          </p>
          <div className="mt-4 text-sm text-gray-500">
            Click on any skill card to explore detailed expertise
          </div>
        </motion.div>

        {/* Featured Skill Categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {skillCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`group relative ${category.bgColor} rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 border border-white/50 overflow-hidden cursor-pointer transform hover:scale-105`}
                onClick={() => setSelectedSkill(category)}
              >
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
                  <div className={`w-full h-full rounded-full bg-gradient-to-r ${category.color}`}></div>
                </div>
                
                {/* Hover Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`}></div>
                
                <div className="relative z-10">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${category.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-heading text-xl text-gray-900 group-hover:text-gray-700 transition-colors">
                      {category.title}
                    </h3>
                    <span className="text-xs font-semibold px-3 py-1 bg-white/80 rounded-full text-gray-600 shadow-sm">
                      {category.level}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4 group-hover:text-gray-700 transition-colors">
                    {category.description}
                  </p>
                  
                  {/* Skill Level Indicator */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon 
                          key={i} 
                          className={`w-4 h-4 ${
                            i < (category.level === 'Expert' ? 5 : 4) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                    </div>
                    <div className="text-xs text-gray-500 group-hover:text-blue-600 transition-colors font-medium">
                      Click to explore →
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Development Skills */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h3 className="font-heading text-3xl text-gray-900 mb-4">Development</h3>
            <p className="text-gray-600">Modern technologies and frameworks</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Mobile App Development", level: "Expert", icon: "📱" },
              { name: "Web Development", level: "Expert", icon: "🌐" },
              { name: "React", level: "Expert", icon: "⚛️" },
              { name: "Node.js", level: "Advanced", icon: "🟢" },
              { name: "DevOps", level: "Intermediate", icon: "🔧" },
              { name: "QA Engineering", level: "Advanced", icon: "🧪" },
              { name: "Next.js", level: "Expert", icon: "▲" },
              { name: "Netlify", level: "Intermediate", icon: "🌍" }
            ].map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 transform hover:-translate-y-2"
              >
                <div className="text-center">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    {skill.icon}
                  </div>
                  <h4 className="font-semibold text-gray-800 text-sm mb-3">{skill.name}</h4>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    skill.level === 'Expert' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' :
                    skill.level === 'Advanced' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' :
                    'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white'
                  }`}>
                    {skill.level}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Security & Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h3 className="font-heading text-3xl text-gray-900 mb-4">Security & Analysis</h3>
            <p className="text-gray-600">Cybersecurity and business intelligence</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Cybersecurity", level: "Expert", icon: "🛡️" },
              { name: "Penetration Testing", level: "Advanced", icon: "🔍" },
              { name: "Security Analysis", level: "Expert", icon: "📊" },
              { name: "Vulnerability Assessment", level: "Advanced", icon: "🔐" },
              { name: "Risk Assessment", level: "Expert", icon: "⚠️" },
              { name: "Incident Response", level: "Advanced", icon: "🚨" }
            ].map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-red-200 transform hover:-translate-y-2"
              >
                <div className="text-center">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    {skill.icon}
                  </div>
                  <h4 className="font-semibold text-gray-800 text-sm mb-3">{skill.name}</h4>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    skill.level === 'Expert' ? 'bg-gradient-to-r from-red-500 to-red-600 text-white' :
                    skill.level === 'Advanced' ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white' :
                    'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white'
                  }`}>
                    {skill.level}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Business & Management */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h3 className="font-heading text-3xl text-gray-900 mb-4">Business & Management</h3>
            <p className="text-gray-600">Leadership and strategic planning</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Project Management", level: "Expert", icon: "📋" },
              { name: "Business Development", level: "Advanced", icon: "📈" },
              { name: "Leadership", level: "Expert", icon: "👥" },
              { name: "Strategic Planning", level: "Advanced", icon: "🎯" },
              { name: "Entrepreneurship", level: "Expert", icon: "🚀" }
            ].map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-200 transform hover:-translate-y-2"
              >
                <div className="text-center">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    {skill.icon}
                  </div>
                  <h4 className="font-semibold text-gray-800 text-sm mb-3">{skill.name}</h4>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    skill.level === 'Expert' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' :
                    skill.level === 'Advanced' ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white' :
                    'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white'
                  }`}>
                    {skill.level}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Industry Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-48 -translate-y-48"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 translate-y-48"></div>
          </div>
          
          <div className="relative z-10">
            <div className="text-center mb-12">
              <h3 className="font-heading text-3xl lg:text-4xl mb-4">
                Industry Certifications
              </h3>
              <p className="text-blue-100 text-lg max-w-3xl mx-auto">
                Continuously updating my skills with the latest industry certifications and best practices
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {certifications.map((cert, index) => (
                <motion.div
                  key={cert.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-lg font-bold">{cert.name}</div>
                    {cert.status === 'Certified' ? (
                      <CheckCircleIcon className="w-6 h-6 text-green-400" />
                    ) : (
                      <div className="w-6 h-6 border-2 border-yellow-400 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      </div>
                    )}
                  </div>
                  <p className="text-blue-100 text-sm mb-3">{cert.description}</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    cert.status === 'Certified' 
                      ? 'bg-green-500/20 text-green-300' 
                      : 'bg-yellow-500/20 text-yellow-300'
                  }`}>
                    {cert.status}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Skill Detail Modal */}
      <SkillModal />
    </Section>
  );
};
