export interface PersonalInfo {
  name: string;
  jobTitle: string;
  avatar: string;
  intro: string;
  email: string;
  linkedin: string;
  github: string;
  instagram?: string;
  youtube?: string;
}

export interface Skill {
  category: string;
  items: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  technologies: string[];
  image: string;
  liveUrl?: string;
  githubUrl?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  responsibilities: string[];
  achievements?: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  position: string;
  company: string;
  content: string;
  avatar?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  location: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date?: string;
  description?: string;
}

// Data portfolio Hylmi Rafif Rabbani
export const personalInfo: PersonalInfo = {
  name: "Hylmi Rafif Rabbani",
  jobTitle: "IT & Business Expert",
  avatar: "/avatarhylmi.jpg",
  intro: "Experienced professional with expertise in integrating IT solutions with business strategies. Skilled in application development, cybersecurity, and systems analysis, with a proven ability to enhance operational efficiency and support business decision-making through technology.",
  email: "hylmi.rabbani@binus.ac.id",
  linkedin: "https://www.linkedin.com/in/hylmiirafif/",
  github: "https://github.com/Hylmii",
  instagram: "https://www.instagram.com/hirafmy/",
  youtube: "https://www.youtube.com/@hylmiirafif"
};

export const aboutMe = {
  bio: "Technology and cybersecurity professional with a strong background in leadership, innovation, and digital project management. Currently serving as CEO at Nextzenith Ventures MiRoom, focusing on strategic growth and technological advancement. Demonstrated entrepreneurial drive by founding Kedai Mas Yo and Cafe & Angkringan Bawah Kabel, while serving as Investor Ambassador for Indonesia Stock Exchange's Sharia Capital Market. Experienced through strategic roles at major companies including comprehensive internships at PT Pertamina Gas Negara Tbk and Traveloka, as well as cybersecurity and business development positions at PT Altimeda Cipta Visitama and Google. Equipped with solid academic foundations in cybersecurity and digital technology from BINUS University and Purwadhika Digital Technology School, combining technical expertise with business acumen to deliver secure, scalable, and transformative technology solutions.",
  coreSkills: ["Leadership & Management", "Cybersecurity Analysis", "Business Development", "Project Management", "Entrepreneurship"],
  values: ["Innovation", "Security-First Approach", "Continuous Learning", "Strategic Thinking"]
};

export const skills: Skill[] = [
  {
    category: "Development",
    items: ["Mobile App Development", "Web Development", "React", "Node.js", "DevOps", "QA Engineering"]
  },
  {
    category: "Security & Analysis",
    items: ["Cybersecurity", "Penetration Testing", "Security Analysis", "Linux Command", "Risk Assessment"]
  },
  {
    category: "Business & Management",
    items: ["Project Management", "Business Development", "Leadership", "Strategic Planning", "Entrepreneurship"]
  }
];

export const projects: Project[] = [
  {
    id: "project-1",
    title: "Nextzenith Ventures MiRoom Leadership",
    description: "Strategic leadership and technological advancement at a ventures company focused on innovation and growth.",
    situation: "Nextzenith Ventures MiRoom needed strategic leadership to drive technological advancement and business growth in a competitive market.",
    task: "Lead the company's strategic direction, oversee technological initiatives, and ensure sustainable growth while maintaining innovation focus.",
    action: "Implemented strategic planning frameworks, established technology roadmaps, coordinated cross-functional teams, and developed partnerships to drive business growth.",
    result: "Successfully established CEO role, achieved strategic business objectives, and positioned the company for continued technological advancement and market expansion.",
    technologies: ["Strategic Planning", "Business Development", "Technology Management", "Leadership"],
    image: "/placeholder-project.svg"
  },
  {
    id: "project-2",
    title: "Indonesia Stock Exchange - Sharia Capital Market Initiatives",
    description: "Led investor education and awareness programs for Sharia-compliant investment opportunities in Indonesia's capital market.",
    situation: "Indonesia Stock Exchange needed to increase awareness and adoption of Sharia-compliant investment products among Indonesian investors.",
    task: "Develop and execute comprehensive investor education programs, build relationships with potential investors, and promote Islamic finance principles.",
    action: "Conducted educational workshops, created investor awareness campaigns, built strategic partnerships with financial institutions, and developed comprehensive training materials for Sharia investments.",
    result: "Successfully increased investor awareness by 150%, conducted 25+ educational sessions, and built a network of 500+ Sharia-compliant investors during the ambassador tenure.",
    technologies: ["Financial Education", "Investor Relations", "Islamic Finance", "Market Development"],
    image: "/placeholder-project.svg"
  },
  {
    id: "project-3",
    title: "Enterprise IT Transformation at PT Pertamina Gas Negara",
    description: "Comprehensive IT infrastructure modernization and digital transformation initiative for Indonesia's largest gas distribution company.",
    situation: "PT Pertamina Gas Negara required modernization of legacy IT systems to improve operational efficiency and support business growth.",
    task: "Support digital transformation projects, assist in IT infrastructure optimization, and implement cybersecurity improvements across the organization.",
    action: "Collaborated with IT teams on system upgrades, participated in cloud migration projects, implemented security protocols, and optimized operational processes through technology solutions.",
    result: "Contributed to 40% improvement in system performance, successful migration of critical applications to modern infrastructure, and enhanced security posture across the organization.",
    technologies: ["IT Infrastructure", "Cloud Migration", "Cybersecurity", "System Optimization"],
    image: "/placeholder-project.svg"
  }
];

export const experiences: Experience[] = [
  {
    id: "exp-1",
    company: "Nextzenith Ventures MiRoom",
    position: "CEO",
    startDate: "May 2024",
    endDate: "Present",
    responsibilities: [
      "Leading strategic growth and technological advancement initiatives",
      "Overseeing company operations and strategic direction",
      "Managing stakeholder relationships and business development",
      "Driving innovation and digital transformation across the organization",
      "Directing strategic business operations and technology initiatives",
      "Managing cross-functional teams and project portfolios"
    ],
    achievements: [
      "Successfully grew company operations by 300%",
      "Implemented strategic technology solutions for business growth",
      "Established key partnerships in the venture capital ecosystem",
      "Led digital transformation initiatives across the organization"
    ]
  },
  {
    id: "exp-2",
    company: "Kedai Mas Yo",
    position: "Founder",
    startDate: "Jun 2024",
    endDate: "Present",
    responsibilities: [
      "Founded and established business operations from ground up",
      "Developed business strategy and operational framework",
      "Managed all aspects of business including finance, marketing, and operations",
      "Built and led a team of dedicated staff members"
    ],
    achievements: [
      "Successfully launched profitable food & beverage business",
      "Established strong local customer base in Depok",
      "Implemented efficient operational systems and processes"
    ]
  },
  {
    id: "exp-3",
    company: "Indonesia Stock Exchange",
    position: "Investor Ambassador, Sharia Capital Market",
    startDate: "Apr 2024",
    endDate: "Apr 2025",
    responsibilities: [
      "Promoting Sharia-compliant investment opportunities",
      "Educating investors about Islamic finance principles",
      "Conducting investor education sessions and workshops",
      "Building relationships with potential investors and partners"
    ],
    achievements: [
      "Increased investor awareness of Sharia capital market",
      "Successfully conducted multiple educational workshops",
      "Built strong network of Sharia-compliant investors"
    ]
  },
  {
    id: "exp-4",
    company: "Cafe & Angkringan Bawah Kabel",
    position: "Founder",
    startDate: "May 2023",
    endDate: "May 2024",
    responsibilities: [
      "Founded and operated traditional Indonesian cafe business",
      "Managed daily operations, staff, and customer service",
      "Developed unique menu offerings and customer experience",
      "Handled business development and expansion planning"
    ],
    achievements: [
      "Successfully operated profitable cafe for 1 year",
      "Built loyal customer base in local community",
      "Implemented sustainable business practices"
    ]
  },
  {
    id: "exp-5",
    company: "PT Pertamina Gas Negara",
    position: "IT Intern",
    startDate: "Feb 2024",
    endDate: "Feb 2025",
    responsibilities: [
      "Supported IT infrastructure and system maintenance",
      "Assisted in digital transformation projects",
      "Collaborated with IT team on cybersecurity initiatives",
      "Participated in system optimization and automation projects"
    ],
    achievements: [
      "Completed comprehensive 1-year internship program",
      "Contributed to IT system optimization projects",
      "Gained extensive experience in enterprise IT operations"
    ]
  },
  {
    id: "exp-6",
    company: "Traveloka",
    position: "Project Intern",
    startDate: "Oct 2023",
    endDate: "Jun 2024",
    responsibilities: [
      "Managed project timelines and deliverables for tech initiatives",
      "Coordinated with cross-functional teams across product development",
      "Supported agile development processes and sprint planning",
      "Analyzed project metrics and provided improvement recommendations"
    ],
    achievements: [
      "Successfully completed 9-month internship program",
      "Delivered multiple project milestones ahead of schedule",
      "Gained valuable experience in Southeast Asia's leading travel platform"
    ]
  },
  {
    id: "exp-7",
    company: "PT Altimeda Cipta Visitama",
    position: "Cyber Security Analyst",
    startDate: "Oct 2022",
    endDate: "May 2023",
    responsibilities: [
      "Conducted comprehensive cybersecurity risk assessments",
      "Implemented security monitoring and incident response procedures",
      "Analyzed security threats and vulnerability assessments",
      "Developed security protocols and compliance documentation"
    ],
    achievements: [
      "Enhanced company's overall cybersecurity posture by 40%",
      "Successfully identified and mitigated critical security vulnerabilities",
      "Implemented robust security monitoring systems"
    ]
  },
  {
    id: "exp-8",
    company: "PT Altimeda Cipta Visitama",
    position: "Business Development",
    startDate: "Oct 2022",
    endDate: "May 2023",
    responsibilities: [
      "Developed and executed business development strategies",
      "Identified new market opportunities and partnership potential",
      "Managed client relationships and business growth initiatives",
      "Conducted market research and competitive analysis"
    ],
    achievements: [
      "Successfully expanded business partnerships by 60%",
      "Generated new revenue streams through strategic partnerships",
      "Built strong network of industry contacts and clients"
    ]
  },
  {
    id: "exp-9",
    company: "Bina Nusantara University",
    position: "Research Assistant",
    startDate: "Sep 2022",
    endDate: "Jan 2023",
    responsibilities: [
      "Assisted faculty members with academic research projects",
      "Conducted literature reviews and data analysis",
      "Supported research methodology development and implementation",
      "Prepared research documentation and presentations"
    ],
    achievements: [
      "Contributed to published academic research papers",
      "Developed strong research and analytical skills",
      "Gained experience in academic research methodology"
    ]
  },
  {
    id: "exp-10",
    company: "Google",
    position: "Security Analyst",
    startDate: "Apr 2020",
    endDate: "Jul 2022",
    responsibilities: [
      "Analyzed security threats and vulnerabilities across global infrastructure",
      "Implemented security monitoring and incident response procedures",
      "Collaborated with international security teams on threat intelligence",
      "Conducted security assessments and penetration testing"
    ],
    achievements: [
      "Worked with global security team for 2+ years during early career",
      "Contributed to major security initiatives and threat detection systems",
      "Gained extensive experience in enterprise-level cybersecurity operations"
    ]
  }
];

export const testimonials: Testimonial[] = [
  {
    id: "test-1",
    name: "Professional Colleague",
    position: "Senior Manager",
    company: "Tech Industry",
    content: "Hylmi demonstrates exceptional leadership skills and technical expertise. His ability to bridge technology and business makes him a valuable asset to any organization.",
    avatar: "/placeholder-testimonial.svg"
  },
 
  {
    id: "test-3",
    name: "Industry Mentor",
    position: "Cybersecurity Expert",
    company: "Security Consulting",
    content: "Hylmi's dedication to cybersecurity and continuous learning is impressive. His analytical skills and attention to detail make him an excellent security professional.",
    avatar: "/placeholder-testimonial.svg"
  }
];

export const education: Education[] = [
  {
    id: "edu-1",
    institution: "Purwadhika Digital Technology School",
    degree: "Advanced Certificate",
    field: "Web & App Development",
    startDate: "Jun 2025",
    endDate: "Nov 2025",
    location: "Jakarta, Indonesia"
  },
  {
    id: "edu-2",
    institution: "BINUS University",
    degree: "Bachelor of Technology",
    field: "Computer and Information Systems Security",
    startDate: "Aug 2021",
    endDate: "Jun 2025",
    location: "Jakarta, Indonesia"
  },
  {
    id: "edu-3",
    institution: "Harvard Business School",
    degree: "Certificate",
    field: "Business Administration and Management",
    startDate: "Oct 2022",
    endDate: "Dec 2022",
    location: "Online"
  },
  {
    id: "edu-4",
    institution: "Binus Business School",
    degree: "Mini MBA",
    field: "Accounting and Business/Management",
    startDate: "Sep 2022",
    endDate: "Dec 2022",
    location: "Jakarta, Indonesia"
  }
];

export const certifications: Certification[] = [
  {
    id: "cert-1",
    name: "Fundamental Command Linux",
    issuer: "Technology Training Institute",
    description: "Comprehensive training in Linux command line operations and system administration"
  },
  {
    id: "cert-2",
    name: "Fundamental Penetration Testing",
    issuer: "Cybersecurity Training Institute",
    description: "Essential skills in penetration testing methodologies and tools"
  },
  {
    id: "cert-3",
    name: "Fundamental Cyber Security",
    issuer: "Security Training Institute",
    description: "Core cybersecurity principles and best practices"
  },
  {
    id: "cert-4",
    name: "Certificate of Course Completion: AI for Software Engineer",
    issuer: "AI Training Institute",
    description: "Application of artificial intelligence in software engineering practices"
  }
];

export const languages = [
  { name: "Indonesian", level: "Native or Bilingual" },
  { name: "English", level: "Full Professional" },
  { name: "Arabic", level: "Limited Working" }
];
