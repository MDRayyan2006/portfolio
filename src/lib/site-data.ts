import heliox from "@/assets/proj-heliox.jpg";
import multiagent from "@/assets/proj-multiagent.jpg";
import mcp from "@/assets/proj-mcp.jpg";
import badgeverse from "@/assets/proj-badgeverse.jpg";
import hobbyAnime from "@/assets/hobby-anime.png";
import hobbyBadminton from "@/assets/hobby-badminton.png";
import hobbyChess from "@/assets/hobby-chess.png";
import hobbyCoffee from "@/assets/hobby-coffee.png";

export const projects = [
  {
    name: "HelioX",
    slug: "heliox",
    tagline: "Multi-Agent RAG System",
    description: "An advanced multi-agent Retrieval Augmented Generation system that combines FAISS vector search with LangChain orchestration for intelligent document analysis and question answering.",
    stack: ["RAG", "FAISS", "LangChain"],
    img: heliox,
    github: "https://github.com/MDRayyan2006",
    demo: "#",
  },
  {
    name: "Multi-Agent System",
    slug: "multi-agent",
    tagline: "Collaboration System",
    description: "A sophisticated multi-agent collaboration system built with LangGraph that enables multiple AI agents to work together, leveraging Groq for fast inference and Tavily for real-time web search.",
    stack: ["LangGraph", "Groq", "Tavily"],
    img: multiagent,
    github: "https://github.com/MDRayyan2006",
    demo: "#",
  },
  {
    name: "MCP Chat",
    slug: "mcp-chat",
    tagline: "MCP Server & LLM Client",
    description: "A Model Context Protocol server and LLM client that integrates with GitHub API, enabling AI-powered code analysis and repository interaction through a conversational interface.",
    stack: ["MCP", "Groq", "GitHub API"],
    img: mcp,
    github: "https://github.com/MDRayyan2006",
    demo: "#",
  },
  {
    name: "BadgeVerse",
    slug: "badgeverse",
    tagline: "Real-Time Chat App",
    description: "A full-stack real-time chat application with badge gamification, built with React, Socket.IO for instant messaging, and MongoDB for persistent data storage.",
    stack: ["React", "Socket.IO", "MongoDB"],
    img: badgeverse,
    github: "https://github.com/MDRayyan2006",
    demo: "#",
  },
];

export const popularSkills = [
  { name: "Python", level: 7 },
  { name: "LangChain", level: 7 },
  { name: "LangGraph", level: 6 },
  { name: "RAG", level: 7 },
  { name: "FastAPI", level: 6 },
  { name: "React", level: 6 },
  { name: "MongoDB", level: 6 },
  { name: "Docker", level: 5 },
];

export const timeline = [
  { year: "2026", title: "Research Intern, AI/ML @ NIT Warangal", desc: "Developed and optimized AI/ML solutions, contributing to a BERT-based cyber threat detection model for accurate threat classification and analysis." },
  { year: "2025", title: "Smart India Hackathon (SIH)", desc: "Built & demonstrated a working prototype within 36 hours." },
  { year: "2025", title: "Quantum Valley Hackathon", desc: "Competed against 100+ teams and built an AI-assisted solution end-to-end." },
  { year: "2024", title: "100+ LeetCode Problems", desc: "Solved across DSA, DP, Graphs & more." },
  { year: "2023 — Now", title: "5+ Projects Built", desc: "Independently built and shipped 5+ full-stack and AI/ML projects." },
];

export const hobbies = [
  { name: "Anime", slug: "anime", desc: "Stories that teach resilience.", img: hobbyAnime },
  { name: "Badminton", slug: "badminton", desc: "Focus, reflexes and energy.", img: hobbyBadminton },
  { name: "Chess", slug: "chess", desc: "Strategy, patience & thinking ahead.", img: hobbyChess },
  { name: "Coffee", slug: "coffee", desc: "Fuel for late-night building.", img: hobbyCoffee },
];

export const contact = {
  email: "rayyanmohammed0505@gmail.com",
  linkedin: "linkedin.com/in/rayyan-mohammed55",
  linkedinUrl: "https://linkedin.com/in/rayyan-mohammed55",
  github: "github.com/MDRayyan2006",
  githubUrl: "https://github.com/MDRayyan2006",
  location: "Visakhapatnam, India",
};
