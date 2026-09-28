/**
 * Portfolio Data Matrix for Digonta Das
 * Strictly curated from Digonta_CV.pdf and verified GitHub repositories.
 */

export const PERSONAL_INFO = {
  name: "Digonta Das",
  title: "AI Engineer | Computer Vision Engineer | Web Developer",
  email: "digontadas0171@gmail.com",
  phone: "+8801790029046",
  location: "Dhaka, Bangladesh",
  birthday: "2002-07-03", // July 3, 2002
  currentAge: 24,
  lifespanExpectancy: 75,
  education: {
    institution: "BRAC University",
    degree: "B.Sc. in Computer Science and Engineering",
    gpa: "3.6 / 4.0",
    graduation: "Expected Jan 2027",
    roadmap: "Pursuing Master's Degree in AI & Distributed Systems (2027 / 2028)",
    coursework: [
      "Artificial Intelligence",
      "Computer Vision",
      "Image Processing",
      "Computer Graphics",
      "Linear Algebra",
      "Operating Systems",
      "Computer Architecture"
    ]
  },
  socials: {
    github: "https://github.com/DigontaDas",
    linkedin: "https://www.linkedin.com/in/digonta-das-836117241",
    portfolio: "https://digonta-das.vercel.app",
    cvFile: "/Digonta_CV.pdf"
  }
};

export const SKILLS_CATALOG = [
  // Deep Learning & Machine Learning
  { id: "pytorch", name: "PyTorch", category: "ML/DL", icon: "" },
  { id: "tensorflow", name: "TensorFlow", category: "ML/DL", icon: "" },
  { id: "cnn3d", name: "3D CNN", category: "ML/DL", icon: "" },
  { id: "unet", name: "U-Net", category: "ML/DL", icon: "" },
  { id: "resnet", name: "ResNet", category: "ML/DL", icon: "" },
  { id: "mobilenet", name: "MobileNetV2", category: "ML/DL", icon: "" },
  { id: "xgboost", name: "XGBoost", category: "ML/DL", icon: "" },
  { id: "onnx", name: "ONNX Runtime", category: "ML/DL", icon: "" },
  
  // Computer Vision & NLP
  { id: "segmentation", name: "Segmentation", category: "CV", icon: "" },
  { id: "hu_norm", name: "HU Normalization", category: "CV", icon: "" },
  { id: "volumetric", name: "Volumetric Analysis", category: "CV", icon: "" },
  { id: "rag", name: "RAG Architecture", category: "NLP", icon: "" },
  { id: "transformers", name: "Sentence Transformers", category: "NLP", icon: "" },
  { id: "llms", name: "LLM APIs (Groq/Gemini/Whisper)", category: "NLP", icon: "" },
  
  // Backend & Databases
  { id: "fastapi", name: "FastAPI", category: "Backend", icon: "" },
  { id: "nodejs", name: "Node.js", category: "Backend", icon: "" },
  { id: "express", name: "Express.js", category: "Backend", icon: "" },
  { id: "docker", name: "Docker", category: "Infra", icon: "" },
  { id: "github_actions", name: "GitHub Actions", category: "Infra", icon: "" },
  { id: "postgresql", name: "PostgreSQL", category: "Database", icon: "" },
  { id: "supabase", name: "Supabase", category: "Database", icon: "" },
  { id: "chromadb", name: "ChromaDB", category: "Database", icon: "" },
  { id: "sqlite", name: "SQLite (Outbox Sync)", category: "Database", icon: "" },
  
  // Frontend & Mobile
  { id: "react", name: "React", category: "Frontend", icon: "" },
  { id: "react_native", name: "React Native (Expo)", category: "Mobile", icon: "" },
  { id: "nextjs", name: "Next.js", category: "Frontend", icon: "" },
  { id: "tailwind", name: "Tailwind CSS", category: "Frontend", icon: "" },
  
  // Core Languages
  { id: "python", name: "Python", category: "Languages", icon: "" },
  { id: "javascript", name: "JavaScript", category: "Languages", icon: "" },
  { id: "c_lang", name: "C", category: "Languages", icon: "" },
  { id: "kotlin", name: "Kotlin", category: "Languages", icon: "" }
];

export const PROJECTS_MATRIX = [
  // --- WEST WING: Medical AI & Computer Vision Lab ---
  {
    id: "project-1",
    wing: "West Wing (Medical AI Lab)",
    stationNumber: 1,
    title: "Efficient 3D Tiled CNN Architecture",
    badge: "Undergraduate Thesis (Team Lead)",
    tagline: "Volumetric CT Segmentation for Coronary Artery Stenosis Detection",
    description: "End-to-end 3D CNN segmentation pipeline evaluated on 121 MRI and 160 CT scans (3.5 GB/scan) self-collected from Ibrahim Cardiac & Bangladesh Medical hospitals, benchmarked against ImageCAS.",
    highlights: [
      "Designed volumetric tiling for memory-efficient processing of heavy 3.5 GB CT scans.",
      "Engineered Hounsfield Unit (HU) clipping/normalization and Hybrid Combo Loss (Dice + BCE) to completely resolve empty-mask collapse.",
      "Generates clinician-ready structured cardiac risk metrics and stenosis severity scores."
    ],
    skills: ["python", "pytorch", "cnn3d", "segmentation", "hu_norm", "volumetric"],
    repoUrl: "https://github.com/DigontaDas/Efficient-3D-Tiled-CNN-Architecture.git",
    demoUrl: null,
    status: "Research / Ongoing"
  },
  {
    id: "project-8",
    wing: "West Wing (Medical AI Lab)",
    stationNumber: 2,
    title: "Hybrid Model on Efficient SE-Net",
    badge: "Computer Vision Research",
    tagline: "Cross-Vendor Cardiac MRI Segmentation with Squeeze-and-Excitation",
    description: "Lightweight hybrid MobileNetV2 + Squeeze-and-Excitation attention architecture at only 2.2M parameters for cross-vendor cardiac MRI segmentation.",
    highlights: [
      "Compact parameter footprint (2.2M params) allowing fast edge clinical inference.",
      "Zero-shot cross-vendor evaluation: DSC 0.8712 on ACDC, DSC 0.7512 on unseen M&Ms dataset.",
      "Achieved a narrow generalization gap of only 0.12 across disparate clinical scanners."
    ],
    skills: ["python", "pytorch", "mobilenet", "segmentation"],
    repoUrl: "https://github.com/DigontaDas/Hybrid-Model-on-Efficient-SE-Net.git",
    demoUrl: null,
    status: "Published Codebase"
  },
  {
    id: "project-9",
    wing: "West Wing (Medical AI Lab)",
    stationNumber: 3,
    title: "Brain Tumor Classification & Segmentation",
    badge: "Medical Imaging",
    tagline: "Multi-Modal MRI Neural Diagnosis & Boundary Delineation",
    description: "Comprehensive deep learning pipeline engineered to detect, classify, and segment brain tumors across multi-modal MRI scans with high anatomical fidelity.",
    highlights: [
      "Combines classification CNNs with modified U-Net segmentation architectures.",
      "Processes multi-parametric MRI sequences with custom contrast normalization.",
      "Automates tumor volume calculation for pre-operative neurosurgical planning."
    ],
    skills: ["python", "tensorflow", "unet", "segmentation", "volumetric"],
    repoUrl: "https://github.com/DigontaDas/Brain-Tumor-Classification-Segmentation-Project.git",
    demoUrl: null,
    status: "Complete"
  },
  {
    id: "project-6",
    wing: "West Wing (Medical AI Lab)",
    stationNumber: 4,
    title: "Skin Disease AI",
    badge: "Clinical Dermatology",
    tagline: "Automated Dermatological Lesion Classifier",
    description: "Deep convolutional neural network for multi-class dermatological condition classification, addressing subtle inter-class visual similarities.",
    highlights: [
      "Trained on comprehensive dermoscopic datasets with specialized data augmentation.",
      "High sensitivity detection for malignant melanoma and pigmented lesions.",
      "Lightweight model architecture suitable for point-of-care teledermatology."
    ],
    skills: ["python", "pytorch", "resnet", "segmentation"],
    repoUrl: "https://github.com/DigontaDas/Skin_Disease_AI.git",
    demoUrl: null,
    status: "Complete"
  },
  {
    id: "project-5",
    wing: "West Wing (Medical AI Lab)",
    stationNumber: 5,
    title: "OT Pre-Surgical Safety Gate",
    badge: "Clinical Systems",
    tagline: "Automated Operating Theater Patient Verification & Protocol Guard",
    description: "Mission-critical safety automation system enforcing pre-surgical checks, surgical site verification, and patient consent protocol integrity.",
    highlights: [
      "Rigid protocol state machine preventing pre-incision surgical checklist bypass.",
      "Real-time clinician verification audit trails with immutable event logs.",
      "Containerized deployment built with FastAPI and local SQLite database."
    ],
    skills: ["python", "fastapi", "sqlite", "docker"],
    repoUrl: "https://github.com/DigontaDas/OT-Pre-Surgical-Safety-Gate",
    demoUrl: null,
    status: "Complete"
  },

  // --- EAST WING: AI Systems, Healthcare & Full-Stack Platform Studio ---
  {
    id: "project-3",
    wing: "East Wing (Systems Studio)",
    stationNumber: 6,
    title: "MaSheba AI",
    badge: "Infinity AI BuildFest 2026 Finalist",
    tagline: "Offline-First Maternal Health AI Platform for Rural Communities",
    description: "Offline-first maternal health platform targeting 3M+ expecting mothers and 60K+ Community Health Workers in rural Bangladesh with zero internet dependency.",
    highlights: [
      "Team Lead of 5; XGBoost risk model exported to ONNX (1 MB) running in <200ms on Android 8+.",
      "Outbox-first SQLite sync stress-tested at 50 concurrent events with 100% deduplication.",
      "Cascading Bangla AI triage chat (Groq -> Gemini -> Offline fallback) with 6-stage safety filter.",
      "Next.js administrative dashboard backed by Supabase + pgvector."
    ],
    skills: ["react_native", "fastapi", "onnx", "xgboost", "supabase", "sqlite", "kotlin"],
    repoUrl: "https://github.com/DigontaDas/MaSheba--AI.git",
    demoUrl: null,
    status: "Award Finalist"
  },
  {
    id: "project-10",
    wing: "East Wing (Systems Studio)",
    stationNumber: 7,
    title: "REMEDY",
    badge: "Healthcare Platform",
    tagline: "Smart Healthcare Triage & Clinical Recommendation Engine",
    description: "Intelligent medical diagnosis advisory platform that translates user symptom descriptions into prioritized triage levels and recommended clinical actions.",
    highlights: [
      "Multi-variable symptom severity scoring with contraindication warnings.",
      "FastAPI microservices architecture containerized with Docker.",
      "Integrated medical knowledge graph and pharmaceutical reference indexing."
    ],
    skills: ["python", "fastapi", "postgresql", "docker"],
    repoUrl: "https://github.com/DigontaDas/REMEDY.git",
    demoUrl: null,
    status: "Complete"
  },
  {
    id: "project-4",
    wing: "East Wing (Systems Studio)",
    stationNumber: 8,
    title: "Clarity",
    badge: "Fintech & Supply Chain",
    tagline: "B2B Supply Chain Finance Platform & Invoice Marketplace",
    description: "Enterprise B2B supply chain financing portal with an invoice marketplace, digital payment locks, real-time discounting calculations, and KYB business verification.",
    highlights: [
      "Engineered Express.js routes with locking mechanisms to prevent duplicated transactions.",
      "Real-time discount rate calculator and ERP system data structures for enterprise clients.",
      "Architected secure KYB (Know Your Business) verification vault for corporate compliance.",
      "Supabase real-time synchronization powering interactive vendor dashboards."
    ],
    skills: ["postgresql", "express", "react", "nodejs", "supabase", "javascript"],
    repoUrl: "https://github.com/DigontaDas/Clarity.git",
    demoUrl: null,
    status: "Production Architecture"
  },
  {
    id: "project-7",
    wing: "East Wing (Systems Studio)",
    stationNumber: 9,
    title: "Movie Recommendation AI",
    badge: "GenAI & RAG Pipeline",
    tagline: "Zero-Cost Semantic RAG Engine with ChromaDB & Local LLaMA",
    description: "Full Retrieval-Augmented Generation (RAG) system operating over 3,000+ movies using vector search and local LLM re-ranking with zero API costs.",
    highlights: [
      "ChromaDB vector database indexed with Sentence Transformers embeddings.",
      "LLM re-ranking powered by Ollama (LLaMA) for context-aware personalized query matching.",
      "Modular FastAPI backend coupled with a responsive React/Vite web application."
    ],
    skills: ["chromadb", "transformers", "rag", "fastapi", "react", "python"],
    repoUrl: "https://github.com/DigontaDas/Movie-Recommendation-AI.git",
    demoUrl: null,
    status: "Complete"
  },
  {
    id: "project-2",
    wing: "East Wing (Systems Studio)",
    stationNumber: 10,
    title: "Dhaka Tesla Pool",
    badge: "Distributed Backend Engine",
    tagline: "High-Throughput EV Ride-Pooling & Fleet Optimization Engine",
    description: "Distributed backend ride-matching and route-clustering engine designed for dense urban electric vehicle pooling.",
    highlights: [
      "Dynamic passenger pairing algorithms optimizing travel detours and vehicle capacity.",
      "Battery state-of-charge routing heuristics to manage charging station dwell times.",
      "Concurrent request handling using asynchronous FastAPI workers and PostgreSQL."
    ],
    skills: ["python", "fastapi", "postgresql", "docker"],
    repoUrl: "https://github.com/DigontaDas/Dhaka-Tesla-Pool.git",
    demoUrl: null,
    status: "Complete"
  }
];

export const CERTIFICATES_MATRIX = [
  {
    id: "cert-infinity",
    gemType: "Diamond",
    gemColor: "#4deeea",
    title: "Infinity AI BuildFest 2026 – Finalist",
    issuer: "Team DareDevil",
    date: "2026",
    summary: "Recognized as Finalist for MaSheba AI, an offline-first maternal health platform delivering AI diagnostics to 3M+ rural mothers and 60K+ CHWs.",
    image: "/assets/certificates/infinity-ai-buildfest.jpg",
    pdf: null
  },
  {
    id: "cert-edupro",
    gemType: "Emerald",
    gemColor: "#74ee15",
    title: "Edupro Global Green Talent Awards 2026",
    issuer: "University of Leeds, UK & EduPro",
    date: "May – June 2026",
    summary: "Round 1 Qualifier & Round 2 Participant (Team Jagotic Moho) honoring innovation, sustainable technology, and computational creativity.",
    image: "/assets/certificates/edupro-round1.jpg",
    imageRound2: "/assets/certificates/edupro-round2.jpg",
    pdf: null
  },
  {
    id: "cert-datacamp",
    gemType: "Sapphire",
    gemColor: "#00b4d8",
    title: "DataCamp Certified Associate Data Scientist",
    issuer: "DataCamp",
    date: "Verified",
    summary: "Professional certification demonstrating applied mastery in Python statistical analysis, machine learning algorithms, and data modeling.",
    image: null,
    pdf: "/assets/certificates/datacamp.pdf"
  },
  {
    id: "cert-academic",
    gemType: "Amethyst",
    gemColor: "#bf55ec",
    title: "BRAC University Honors & Master's 2027/28",
    issuer: "BRAC University",
    date: "Expected Jan 2027",
    summary: "B.Sc. in Computer Science and Engineering with a 3.6/4.0 GPA. Preparing for Master's admissions in AI and High-Performance Systems for 2027/2028.",
    image: null,
    pdf: null
  }
];
