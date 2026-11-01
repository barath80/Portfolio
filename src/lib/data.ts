export const profile = {
  name: "Sunkireddy Barath",
  email: "sunkireddybarath07@gmail.com",
  phone: "8438784178",
  location: "Chennai, Tamil Nadu, India",
  linkedin: "https://www.linkedin.com/in/sunkireddy-barath-71b071340",
  github: "https://github.com/barath80",
  resume: "/Sunkireddy_Barath_Resume.pdf",
  roles: ["SDE", "Machine Learning", "Generative AI", "Agentic AI"],
  education: {
    school: "Chennai Institute of Technology",
    degree: "B.E. Computer Science and Engineering",
    years: "2024 – 2028",
    cgpa: "8.78 / 10",
  },
};

export type Experience = {
  company: string;
  role: string;
  period: string;
  place: string;
  points: string[];
};

export const experience: Experience[] = [
  {
    company: "Bold Analytics",
    role: "Data Analyst Intern",
    period: "May 2026 – Jul 2026",
    place: "Maharashtra, India",
    points: [
      "Normalized and deduplicated 600K+ government records into a 3NF PostgreSQL schema, exposed via a secure, scalable REST API.",
      "Built a 12-year financial model covering 100% of Nifty 100 companies, combining feature engineering with Power BI dashboards.",
    ],
  },
  {
    company: "L2M Labs",
    role: "Software Engineer Intern",
    period: "Jan 2026 – Mar 2026",
    place: "Chennai, India",
    points: [
      "Designed a concurrency-safe registration backend with transaction locking and row-level checks across 10+ academic departments.",
      "Built REST API integrations and department-wise data management features supporting real-time, high-volume student registration.",
    ],
  },
  {
    company: "KaizenSpark Tech",
    role: "Full Stack Development Intern",
    period: "Jun 2025 – Jul 2025",
    place: "Chennai, India",
    points: [
      "Built responsive, production-grade frontend interfaces and successfully launched the company's official website live for public use.",
      "Improved deployment reliability through Git-based workflows, structured debugging, and staged release management across sprints.",
    ],
  },
];

export type Project = {
  id: string;
  name: string;
  tagline: string;
  repo: string;
  stack: string[];
  tags: string[];
  headline: { value: string; label: string }[];
  points: string[];
};

export const projects: Project[] = [
  {
    id: "01",
    name: "UrbanTrace AI",
    tags: ["Computer Vision", "Machine Learning"],
    tagline: "ANPR Tracking and City Traffic Analytics",
    repo: "https://github.com/barath80/UrbanTrace-AI",
    stack: ["YOLO11m", "ByteTrack", "ONNX", "OpenCV", "FastAPI", "PostGIS"],
    headline: [
      { value: "92.2%", label: "character accuracy" },
      { value: "18.2", label: "fps per camera" },
      { value: "110→28", label: "tracker IDs → vehicles" },
    ],
    points: [
      "Built a YOLO11m, ByteTrack and CCT-OCR pipeline on ONNX Runtime reaching 92.2% character accuracy at 18.2 fps per camera.",
      "Reconstructed cross-camera vehicle trajectories with PostGIS and GraphHopper routing; dedupe cut 110 tracker IDs to 28 vehicles.",
    ],
  },
  {
    id: "02",
    name: "AgriSmart",
    tags: ["Machine Learning", "Computer Vision"],
    tagline: "AI/ML-Powered Smart Agriculture Platform",
    repo: "https://github.com/barath80/AgriSmart",
    stack: ["FastAPI", "XGBoost", "MobileNetV3", "ONNX", "React Native"],
    headline: [
      { value: "93%", label: "accuracy · 22 crops" },
      { value: "0.91", label: "R² · yield model" },
      { value: "98.1%", label: "unseen accuracy" },
    ],
    points: [
      "Built XGBoost crop and yield models: 93% accuracy over 22 crops, R-squared 0.91 and MAE 1.51 t/ha across 10,429 records.",
      "Deployed MobileNetV3 ONNX disease and pest models (38 classes, 98.1% unseen accuracy); subject gate cut false accepts 33% to 2%.",
    ],
  },
  {
    id: "03",
    name: "SentinelOps AI",
    tags: ["Machine Learning", "Backend"],
    tagline: "Cloud Incident Detection and Recovery",
    repo: "https://github.com/barath80/SentinelOps-AI",
    stack: ["FastAPI", "PostgreSQL", "Scikit-learn", "Next.js", "Docker", "Render", "Neon"],
    headline: [
      { value: "99%", label: "correct root cause" },
      { value: "72%→0%", label: "false recovery claims" },
      { value: "8", label: "cause engine" },
    ],
    points: [
      "Built an 8-cause root-cause engine with read-only falsification tests, naming the correct cause 99% across 20 benchmark seeds.",
      "Shipped recovery contracts with rehearsal and SLO verification on Render, Vercel and Neon; cut false recovery claims 72% to 0%.",
    ],
  },
  {
    id: "04",
    name: "Contexta",
    tags: ["Agentic AI", "Generative AI", "Backend"],
    tagline: "Autonomous AI Threat Intelligence Platform",
    repo: "https://github.com/barath80/Contexta",
    stack: ["FastAPI", "Next.js", "PostgreSQL", "Gemini", "NetworkX", "Redis", "Docker"],
    headline: [
      { value: "5", label: "Gemini agents" },
      { value: "6-factor", label: "BWVS risk score" },
      { value: "Ed25519", label: "signed ledger" },
    ],
    points: [
      "Built 5 role-specific Gemini agents reasoning over SHA-256 hashed evidence packs, with deterministic consensus streamed via SSE.",
      "Engineered a 6-factor BWVS risk score from CVSS, KEV, EPSS and 7-day decay, sealed in an Ed25519 signed hash-chain ledger.",
    ],
  },
  {
    id: "05",
    name: "VERITAS",
    tags: ["Generative AI", "Machine Learning"],
    tagline: "Verified Evolving Reality and Intelligence Tracking",
    repo: "https://github.com/barath80/VERITAS",
    stack: ["PyTorch", "FastAPI", "RAG", "BM25", "Kafka", "SQLite", "React"],
    headline: [
      { value: "1.00", label: "vs 0.11 basic RAG" },
      { value: "14M", label: "params from scratch" },
      { value: "50/50", label: "audit · 12/12 refusals" },
    ],
    points: [
      "Built a bitemporal RAG pipeline with BM25-dense fusion and reranking, scoring 1.00 on TemporalEvidenceBench vs 0.11 basic RAG.",
      "Trained a 14M-parameter transformer from scratch (RoPE, GQA, SwiGLU, RMSNorm); audit 50/50 correct with 12/12 refusals.",
    ],
  },
];

export const projectFilters = ["All", "Computer Vision", "Machine Learning", "Generative AI", "Agentic AI", "Backend"];

export const skills: { group: string; items: string[] }[] = [
  { group: "Programming Languages", items: ["C", "C++", "Python", "Java", "JavaScript", "TypeScript", "SQL"] },
  { group: "Machine Learning and AI", items: ["NumPy", "Pandas", "Scikit-learn", "TensorFlow", "PyTorch", "Keras", "XGBoost", "OpenCV", "YOLO", "ONNX", "OCR"] },
  { group: "Generative and Agentic AI", items: ["LLMs", "Transformers", "RAG", "LangChain", "LangGraph", "Prompt Engineering", "Multi-Agent Systems"] },
  { group: "Backend and Database", items: ["Node.js", "Express.js", "Flask", "FastAPI", "REST APIs", "MySQL", "MongoDB", "PostgreSQL", "Redis", "SQLAlchemy"] },
  { group: "Frontend and Design", items: ["HTML", "CSS", "React.js", "Next.js", "Angular.js", "Bootstrap", "Tailwind CSS", "Gradio", "Streamlit", "Canva", "Figma"] },
  { group: "DevOps, Cloud and Testing", items: ["Git", "GitHub", "Docker", "Jenkins", "Kubernetes", "Linux (Ubuntu)", "CI/CD", "AWS (EC2, S3)", "Render", "Pytest"] },
  { group: "CS Fundamentals", items: ["Data Structures and Algorithms", "Operating Systems", "Computer Networks", "DBMS", "OOPs", "System Design", "Agile"] },
];

export const competitive = [
  {
    platform: "LeetCode",
    handle: "barath80",
    url: "https://leetcode.com/u/barath80/",
    big: "1815",
    bigLabel: "max rating",
    text: "Top 10%, 1000+ problems solved, with a 500+ day streak of consistent daily practice.",
  },
  {
    platform: "CodeChef",
    handle: "barath80",
    url: "https://www.codechef.com/users/barath80",
    big: "1183",
    bigLabel: "max rating",
    text: "222+ problems solved, earning Bronze & Gold Badges through regular contests.",
  },
  {
    platform: "CodeForces",
    handle: "sunkireddybarath07",
    url: "https://codeforces.com/profile/sunkireddybarath07",
    big: "706",
    bigLabel: "max rating",
    text: "An active contest participant building strong problem-solving speed and logic.",
  },
];

export const achievements = [
  { date: "Feb 2026", title: "BeachHack National Hackathon'26", result: "2nd Runner-Up", detail: "Christ University · Built Contexta", prize: "Rs. 20,000" },
  { date: "Jan 2026", title: "QIE International Blockchain Hackathon'26", result: "Winner", detail: "Built NeuroCred, an on-chain credit passport", prize: "$2500 USD" },
  { date: "Nov 2025", title: "Hack Karnataka (GDG)'25", result: "Finalist", detail: "Developed AgriSmart AI · Top 2 track ranking among 3,000+ teams nationwide", prize: "Top 2 track" },
  { date: "Nov 2025", title: "Cardano Hackathon Asia IBW Edition'25", result: "Winner", detail: "Built Lendora AI, a DeFi platform · 5,000+ teams", prize: "$2000" },
];

export const navItems = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "achievements", label: "Wins" },
  { id: "contact", label: "Contact" },
];
