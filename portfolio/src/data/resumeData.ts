// Resume data structured for the portfolio site

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  highlights: string[];
  skills: string[];
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'language' | 'framework' | 'cloud' | 'database' | 'specialty';
  proficiency: number; // 0-100
}

export interface Education {
  degree: string;
  field: string;
  school: string;
  years: string;
}

export interface ProfileData {
  name: string;
  title: string;
  yearsExperience: string;
  phone: string;
  email: string;
  location: string;
  languages: string[];
  summary: string;
}

export interface Reference {
  id: string;
  name: string;
  role: string; // Their role/title, e.g., "Software Developer in Test"
  affiliation: string; // Company where you worked together
  phone?: string;
  email?: string;
  linkedIn?: string;
  photo?: string;
  text: string;
}

export const profile: ProfileData = {
  name: "Ryan Moe",
  title: "Principle Engineer",
  yearsExperience: "9+ Years",
  phone: "801-671-9512",
  email: "ryanallenmoe@gmail.com",
  location: "Highland, UT",
  languages: ["English", "Japanese"],
  summary: `Principle Engineer with over 9 years of experience building secure, scalable systems. 
  Specializing in end-to-end application development, AI integration, post-quantum encryption, 
  and test automation. Proven track record of delivering HIPAA-compliant solutions, 
  architecting CI/CD pipelines, and achieving significant cost reductions through intelligent automation.`
};

export const education: Education = {
  degree: "Bachelor of Science",
  field: "Computer Engineering",
  school: "Brigham Young University",
  years: "2016 - 2019"
};

export const experiences: Experience[] = [
  {
    id: "visyfy",
    title: "Principle Engineer",
    company: "Visyfy",
    location: "Remote",
    startDate: "2024",
    endDate: "Present",
    highlights: [
      "Built end-to-end, a HIPAA-compliant, quantum-resistant, encrypted social networking platform utilizing patented security architecture for long-term quantum resilience",
      "Developed and tested AI Paralegal agent that performed as a personal injury law paralegal. Capabilities included client communication, document management, scheduling, and medical coordination"
    ],
    skills: ["JavaScript", "React", "React Native", "iOS", "Mobile Dev", "Firebase", "Postgres", "NoSQL", "Post-quantum Encryption", "AI Integration", "Backend Systems", "Azure"],
    description: "Leading the development of a cutting-edge social networking platform with military-grade encryption and AI-powered legal assistance tools."
  },
  {
    id: "vivint",
    title: "Senior Automation Engineer",
    company: "Vivint",
    location: "Lehi, UT",
    startDate: "2023",
    endDate: "2026",
    highlights: [
      "Collaborated and architected the migration of CI/CD automation pipeline to a custom-built test scheduler, resulting in a 30% improvement in regression test performance",
      "Developed a firmware version handler solution for test setup, which allowed tests to bypass irrelevant OTA dependencies. Resulting 20% improvement in automation test success rates"
    ],
    skills: ["Python", "CI/CD", "Test Automation", "Docker", "Backend Systems", "Embedded Systems", "GCP", "AWS", "Firebase"],
    description: "Architecting and optimizing test automation infrastructure for smart home IoT systems."
  },
  {
    id: "optilogic",
    title: "Senior SDET",
    company: "Optilogic",
    location: "American Fork, UT",
    startDate: "2022",
    endDate: "2023",
    highlights: [
      "Designed and implemented test automation with a notification system for a PaaS product, causing a shift from reactive, manual QA to proactive, autonomous QA, resulting 240% faster bug discovery",
      "Achieved a 99.6% reduction in monthly automation resource spending by re-architecting the automation system to utilize self-hosted runners"
    ],
    skills: ["JavaScript", "TypeScript", "Python", "PyTest", "Playwright", "Test Automation", "Azure", "Postgres"],
    description: "Transformed QA processes through intelligent automation and significant cost optimization."
  },
  {
    id: "prior",
    title: "Software Engineer",
    company: "Northrop Grumman | Raytheon | Smarter AI | Dyno Nobel",
    location: "Various",
    startDate: "2017",
    endDate: "2022",
    highlights: [
      "Worked in embedded systems and full-stack development, hardening fundamental skills in programming languages, frameworks, cloud services, platform architectures, and version control"
    ],
    skills: ["C/C++", "Python", "JavaScript", "Embedded Systems", "Backend Systems", "AWS", "Docker"],
    description: "Built foundational engineering expertise across defense, AI, and industrial sectors."
  }
];

export const skills: Skill[] = [
  { id: "javascript", name: "JavaScript", category: "language", proficiency: 97 },
  { id: "typescript", name: "TypeScript", category: "language", proficiency: 95 },
  { id: "python", name: "Python", category: "language", proficiency: 89 },
  { id: "cpp", name: "C/C++", category: "language", proficiency: 75 },
  { id: "react", name: "React", category: "framework", proficiency: 93 },
  { id: "react-native", name: "React Native", category: "framework", proficiency: 88 },
  { id: "azure", name: "Azure", category: "cloud", proficiency: 82 },
  { id: "gcp", name: "GCP", category: "cloud", proficiency: 80 },
  { id: "aws", name: "AWS", category: "cloud", proficiency: 76 },
  { id: "firebase", name: "Firebase", category: "cloud", proficiency: 85 },
  { id: "docker", name: "Docker", category: "specialty", proficiency: 85 },
  { id: "postgres", name: "Postgres", category: "database", proficiency: 85 },
  { id: "nosql", name: "NoSQL", category: "database", proficiency: 82 },
  { id: "encryption", name: "Post-quantum Encryption", category: "specialty", proficiency: 88 },
  { id: "test-automation", name: "Test Automation", category: "specialty", proficiency: 92 },
  { id: "ai-integration", name: "AI Integration", category: "specialty", proficiency: 90 },
  { id: "backend", name: "Backend Systems", category: "specialty", proficiency: 91 },
  { id: "mobile", name: "Mobile Dev", category: "specialty", proficiency: 85 },
  { id: "ios", name: "iOS", category: "specialty", proficiency: 80 },
  { id: "cicd", name: "CI/CD", category: "specialty", proficiency: 88 },
  { id: "pytest", name: "PyTest", category: "framework", proficiency: 90 },
  { id: "playwright", name: "Playwright", category: "framework", proficiency: 88 },
  { id: "embedded", name: "Embedded Systems", category: "specialty", proficiency: 70 }
];

// AI Knowledge Base - detailed information for the AI agent
export const aiKnowledgeBase = {
  personalityTraits: [
    "Problem solver who tackles complex challenges with innovative solutions",
    "Strong communicator who bridges technical and business requirements",
    "Continuous learner staying current with emerging technologies",
    "Team player who mentors and elevates those around them"
  ],
  
  keyAccomplishments: [
    {
      title: "99.6% Cost Reduction",
      description: "Re-architected automation system at Optilogic using self-hosted runners, nearly eliminating monthly cloud spending while improving performance.",
      skills: ["AWS", "GCP", "Test Automation", "Backend Systems"]
    },
    {
      title: "Quantum-Resistant Security Platform",
      description: "Built a HIPAA-compliant social networking platform with patented post-quantum encryption, preparing for the future of cybersecurity.",
      skills: ["Post-quantum Encryption", "HIPAA Compliance", "TypeScript", "React", "Azure"]
    },
    {
      title: "AI Paralegal Development",
      description: "Created an AI agent capable of handling client communication, document management, scheduling, and medical coordination for personal injury law firms.",
      skills: ["AI Integration", "Python", "Backend Systems"]
    },
    {
      title: "240% Faster Bug Discovery",
      description: "Implemented proactive, autonomous QA system replacing reactive manual testing, dramatically accelerating the development feedback loop.",
      skills: ["Test Automation", "JavaScript", "Python"]
    },
    {
      title: "30% Regression Test Improvement",
      description: "Migrated CI/CD pipeline to custom test scheduler at Vivint, significantly improving test performance and reliability.",
      skills: ["CI/CD", "Python", "Docker", "Test Automation"]
    }
  ],
  
  careerNarrative: `Ryan's career demonstrates a consistent pattern of identifying inefficiencies and 
  implementing transformative solutions. Starting in defense and industrial sectors, he built a solid 
  foundation in embedded systems and full-stack development. This experience taught him to write 
  robust, reliable code for critical systems.
  
  His move into automation engineering allowed him to combine his software skills with a passion for 
  optimization. At Optilogic, he achieved what many thought impossible—a 99.6% reduction in automation 
  costs while actually improving system performance. This wasn't just clever cost-cutting; it was a 
  fundamental reimagining of how automation infrastructure should work.
  
  At Vivint, he continued this pattern, architecting CI/CD improvements that delivered measurable 
  performance gains. His current role at Visyfy represents the culmination of his technical evolution—
  working at the cutting edge of security (post-quantum encryption) and AI integration (the Paralegal 
  agent), while ensuring real-world compliance requirements like HIPAA are met.
  
  What sets Ryan apart is his ability to see both the forest and the trees. He can dive deep into 
  implementation details while never losing sight of business impact. His bilingual abilities 
  (English and Japanese) reflect a broader pattern of bridging different worlds—whether languages, 
  technical domains, or team perspectives.`,

  interviewAnswers: {
    whyHire: `Ryan brings a rare combination: deep technical expertise in modern technologies (TypeScript, 
    Python, cloud platforms, AI) combined with a proven track record of delivering massive business 
    impact. His 99.6% cost reduction and 240% improvement in bug discovery speed aren't just numbers—
    they represent a mindset of continuous optimization and innovation.`,
    
    strengths: `His greatest strengths are systems thinking and the ability to execute. He doesn't just 
    identify problems—he builds elegant solutions that scale. His work on post-quantum encryption shows 
    he's thinking years ahead, while his automation work shows he can deliver immediate, measurable value.`,
    
    workStyle: `Ryan thrives in environments where he can own problems end-to-end. He's collaborative 
    but autonomous, able to work remotely or in-office with equal effectiveness. He's a natural mentor 
    who elevates team capabilities while delivering his own high-quality work.`
  }
};

export const references: Reference[] = [
  {
    id: "micah-kelly",
    name: "Micah Kelly",
    role: "Staff Software Engineer in Test",
    affiliation: "Vivint",
    photo: "/micah-profile.jpeg",
    phone: "(801) 989-9323",
    text: `I'm happy to recommend Ryan Moe, a Senior Software Engineer in Test whom I had the pleasure of working with closely.

Ryan is a thoughtful, intelligent, and highly communicative engineer. We collaborated across multiple initiatives, regularly discussing strategy, planning work, and aligning on execution. When challenges arose—as they inevitably do in complex technical environments—Ryan was always open to sharing ideas, working through problems collaboratively, and finding practical solutions.

His code was consistently clean, well-structured, and clearly thought out. One of Ryan's strongest qualities is how he receives feedback: he is never defensive, listens carefully, and is quick to make adjustments after discussion. When he disagreed with a suggestion, he approached it constructively—offering reasonable alternatives and then implementing changes quickly and effectively once a path was agreed upon.

Ryan also excelled at automating difficult and complex tests. He regularly built sophisticated fixtures and environments to ensure test execution was reliable and repeatable, even under challenging conditions. His work significantly improved the robustness and confidence of our test coverage.

Because of these qualities, Ryan was one of my favorite engineers to work with. I would confidently and happily recommend him for any key technical role, especially those requiring strong collaboration, sound judgment, and deep technical skill.`
  },
  {
    id: "hayden-randall",
    name: "Hayden Randall",
    role: "Software Developer in Test",
    affiliation: "Vivint",
    photo: "/hayden-profile.jpeg",
    phone: "(480) 625-6584",
    email: "haydenjrandall@gmail.com",
    text: `I'm writing to recommend my former coworker, Ryan Moe. I had the chance to work closely with Ryan, and he was consistently one of the most reliable people on our team.

Ryan was always willing to help, no matter how busy he was. If he didn't know the answer to something, he would take the initiative to find someone who did and make sure the issue was resolved. That level of effort really stood out and made him a go-to resource for the team.

He was also one of our subject matter experts, and people regularly went to him for guidance. Ryan approached problems calmly and logically, and he delivered his work on time and with a high level of quality.

On top of his technical skills, Ryan was just a great person to work with. He communicated clearly, stayed dependable under pressure, and made the work environment better.

I have no hesitation recommending Ryan. Any team would benefit from having someone like him.`
  },
  {
    id: "jeremy-blair",
    name: "Jeremy Blair",
    role: "Principal Engineer",
    affiliation: "Optilogic",
    photo: "/jeremy-blair-profile.jpeg",
    phone: "801-350-1712",
    email: "jeremykblair@hotmail.com",
    text: `I am pleased to write an employment letter of recommendation for Ryan Moe. I had the opportunity of working closely with Ryan for a period of about 9 months. During this time, I came to gain an appreciation for his ability to think in depth and at a higher level. There were several situations where Ryan uncovered problems within an application that were outside the scope of what he was asked to test. The reason he found those issues is because he asked questions that were deeper than the surface level information he was provided. He thinks like the engineer he is and knows how to solve problems.

Ryan is friendly and communicates well. He is a great team player and is someone who understands code, regardless of the technology being used or the complexity of the algorithms he is reviewing.

Ryan would make a great member of any technology team. He is a great developer and tester. I have no reservations about recommending him for any development related role. It was an honor and pleasure to work with him, and I hope our career paths cross again someday.`
  },
  {
    id: "wyatt-penrod",
    name: "Wyatt Penrod",
    role: "Director of QA",
    affiliation: "Vivint",
    photo: "/vivint-logo.png",
    text: `Ryan is the fastest hire to value that I've ever had.`
  },
];
