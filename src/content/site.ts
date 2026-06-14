export interface TimelineItem {
  id: string;
  year: string;
  stage: string;
  title: string;
  description: string;
  accomplishments: string[];
  tags: string[];
}

export interface SkillNode {
  id: string;
  label: string;
  category: "frontend" | "backend" | "ai" | "trading" | "devops";
  val: number; // size/importance weight
}

export interface SkillLink {
  source: string;
  target: string;
}

export const siteConfig = {
  name: "Samuel Musa",
  title: "Software Engineer & AI Developer",
  tagline: "\n\nBuilding robust backend systems, data pipelines, and AI-assisted automation workflows.",
  avatar: "/avatar.png",
  email: "musasamuel147@gmail.com",
  github: "https://github.com/GODMODE25",
  telegram: "https://t.me/GODMODE25",
  telegramHandle: "@GODMODE25",
  twitter: "https://twitter.com/",
  linkedin: "https://linkedin.com/in/GODMODE26",
  resumeUrl: "/resume.pdf",

  blogPosts: [
    {
      slug: "why-i-built-arbitrage-scanner",
      title: "How I Built a Low-Latency EVM Arbitrage Scanner",
      summary: "An engineering breakdown of an asynchronous DEX/CEX arbitrage scanner using Python and CCXT to process market discrepancies.",
      publishedAt: "2026-05-28",
      readTime: "6 min read",
      tags: ["Crypto", "Python", "Trading", "Asynchronous"],
    },
    {
      slug: "building-student-performance-tracker",
      title: "Architecting a Multi-Role Educational Platform in Flask",
      summary: "An engineering dive into structuring robust relational databases and role-based access control (RBAC) for the Student Performance Tracker.",
      publishedAt: "2026-06-10",
      readTime: "7 min read",
      tags: ["Python", "Flask", "PostgreSQL", "Full-Stack"],
    },
    {
      slug: "prompt-engineering-workflows",
      title: "Harnessing LLMs for Workflow Automation: A Prompt Engineering Guide",
      summary: "Exploring how to transform unstructured inputs into reliable, structured outputs using AI APIs like Claude, Gemini, and Perplexity.",
      publishedAt: "2026-06-12",
      readTime: "8 min read",
      tags: ["AI", "Automation", "Prompt Engineering", "Python"],
    },
  ],

  rotatingRoles: [
    "Software Engineer",
    "AI Workflow Developer",
    "Data Scientist",
    "Web Developer",
    "Quantitative Developer",
    "Systems Designer"
  ],

  systemStatus: {
    location: "Nigeria",
    status: "Operational",
    currentFocus: "Prompt Engineering & High-Performance Automation",
    latencyTarget: "20ms",
    uptimeStart: "2026-05-10T08:00:00Z", // Uptime reference point
    systemHealth: 99.98,
    activeProcess: "indexing_github_contributions",
  },

  aboutNarrative: "I am a Computer Engineer specializing in web development, automation, AI-assisted workflows, and data science. My experience ranges from building full-stack applications with React and Flask, to engineering high-performance algorithmic trading systems, and leveraging LLMs (Claude, Perplexity, Gemini) to transform unstructured data into structured automation pipelines.",

  timeline: [
    {
      id: "curiosity",
      year: "2006 - 2017",
      stage: "Foundations",
      title: "Early Certifications & Hardware",
      description: "Gained foundational knowledge in web development and hardware maintenance at the Prof. Iya Abubakar Community Resource Center, eventually securing a Cisco Certified Network Associate (CCNA) certification.",
      accomplishments: [
        "Earned Web Development and Hardware Maintenance Certifications (2006)",
        "Obtained CCNA from the University of Jos (2017)",
        "Built early interest in systems and networking"
      ],
      tags: ["HTML", "Hardware", "Networking", "CCNA"]
    },
    {
      id: "learning",
      year: "2021 - 2023",
      stage: "Data & Freelance",
      title: "Data Science & Scripting",
      description: "Worked as a Freelance Software Developer and Data Analyst. Collected, cleaned, and transformed datasets, building automated Python scripts to reduce manual data processing workflows.",
      accomplishments: [
        "Built Customer Churn Prediction Models using Scikit-learn",
        "Developed interactive Sales Analytics Dashboards with Power BI",
        "Performed exploratory data analysis and statistical validation"
      ],
      tags: ["Python", "Pandas", "Scikit-learn", "Power BI", "SQL"]
    },
    {
      id: "building",
      year: "2023 - Present",
      stage: "Full-Stack",
      title: "Software Engineering & Trading Bots",
      description: "Engineered multi-role platforms and high-performance algorithmic trading systems across crypto and forex markets.",
      accomplishments: [
        "Deployed 'Student Performance Tracker' with Flask and PostgreSQL",
        "Built async market scanners and triangular arbitrage bots using CCXT",
        "Created desktop tools for financial calculations using Tkinter"
      ],
      tags: ["React", "Flask", "PostgreSQL", "MQL4/5", "CCXT"]
    },
    {
      id: "engineering",
      year: "2024 - 2025",
      stage: "AI & Graduation",
      title: "AI Workflows & University",
      description: "Focusing heavily on LLM prompt engineering, AI evaluation, and structured output generation. Wrapping up a Bachelor of Engineering in Computer & Communication Engineering.",
      accomplishments: [
        "Earned AI Engineering and Data Science certifications",
        "Expected graduation: B.Eng from Abubakar Tafawa Balewa University (Sept 2025)",
        "Designed reliable prompt structures to automate information processing"
      ],
      tags: ["AI Prompting", "Claude", "Gemini", "Computer Engineering"]
    }
  ] as TimelineItem[],

  skillsGraph: {
    nodes: [
      // Core Categories
      { id: "frontend", label: "Frontend Core", category: "frontend", val: 32 },
      { id: "backend", label: "Backend Systems", category: "backend", val: 32 },
      { id: "ai", label: "AI & Data Science", category: "ai", val: 32 },
      { id: "trading", label: "Quantitative Trading", category: "trading", val: 32 },
      { id: "devops", label: "Tools & Infrastructure", category: "devops", val: 32 },

      // Frontend Technologies
      { id: "react", label: "React / Next.js", category: "frontend", val: 20 },
      { id: "typescript", label: "TypeScript / JS", category: "frontend", val: 18 },
      { id: "tailwind", label: "Tailwind CSS", category: "frontend", val: 14 },
      { id: "htmlcss", label: "HTML5 / CSS3", category: "frontend", val: 14 },

      // Backend Technologies
      { id: "python", label: "Python", category: "backend", val: 24 },
      { id: "flask", label: "Flask / APIs", category: "backend", val: 18 },
      { id: "postgres", label: "PostgreSQL / SQL", category: "backend", val: 16 },
      { id: "node", label: "Node.js", category: "backend", val: 14 },

      // AI Technologies
      { id: "prompt", label: "Prompt Engineering", category: "ai", val: 22 },
      { id: "pandas", label: "Pandas / NumPy", category: "ai", val: 16 },
      { id: "sklearn", label: "Scikit-Learn", category: "ai", val: 16 },
      { id: "scraping", label: "Web Scraping", category: "ai", val: 14 },

      // Trading Technologies
      { id: "mql", label: "MQL4 / MQL5", category: "trading", val: 20 },
      { id: "ccxt", label: "CCXT Async Bots", category: "trading", val: 18 },
      { id: "arbitrage", label: "Arbitrage Scanners", category: "trading", val: 14 },

      // DevOps Technologies
      { id: "docker", label: "Docker", category: "devops", val: 16 },
      { id: "git", label: "Git / GitHub", category: "devops", val: 20 },
      { id: "linux", label: "Linux / CLI", category: "devops", val: 16 },
      { id: "cloud", label: "AWS / GCP", category: "devops", val: 14 }
    ] as SkillNode[],

    links: [
      // Frontend links
      { source: "frontend", target: "react" },
      { source: "frontend", target: "typescript" },
      { source: "frontend", target: "tailwind" },
      { source: "frontend", target: "htmlcss" },
      { source: "react", target: "typescript" },

      // Backend links
      { source: "backend", target: "python" },
      { source: "backend", target: "flask" },
      { source: "backend", target: "postgres" },
      { source: "backend", target: "node" },
      { source: "python", target: "flask" }, 

      // AI links
      { source: "ai", target: "prompt" },
      { source: "ai", target: "pandas" },
      { source: "ai", target: "sklearn" },
      { source: "ai", target: "scraping" },
      { source: "pandas", target: "python" }, 
      { source: "scraping", target: "python" },

      // Trading links
      { source: "trading", target: "mql" },
      { source: "trading", target: "ccxt" },
      { source: "trading", target: "arbitrage" },
      { source: "ccxt", target: "python" }, 
      { source: "arbitrage", target: "python" },

      // DevOps links
      { source: "devops", target: "docker" },
      { source: "devops", target: "git" },
      { source: "devops", target: "linux" },
      { source: "devops", target: "cloud" },
      { source: "linux", target: "docker" },

      // Cross layer connections
      { source: "backend", target: "devops" },
      { source: "ai", target: "backend" },
      { source: "trading", target: "backend" }
    ] as SkillLink[]
  }
};
