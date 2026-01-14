import { motion } from 'framer-motion';
import { Mail, Linkedin, MapPin, Binary, Briefcase, GraduationCap, Code2, Globe2, Bike } from 'lucide-react';

const App = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const experience = [
    {
      company: "RockFi",
      role: "Staff Engineer",
      period: "novembre 2024 - Present",
      description: "Building a new private management experience. Interconnecting with key partners to design future-proof, scalable private banking solutions leveraging AI and innovative technologies.",
      tech: ["Strategic Vision", "Technical Expertise", "AI Integration"]
    },
    {
      company: "Forest Admin",
      role: "Both Software Engineering Manager and Staff Software Engineer",
      period: "juin 2024 - novembre 2024",
      description: "Managing engineering teams and aligning technical roadmaps with business goals.",
      tech: ["Management", "Roadmap Planning"]
    },
    {
      company: "Forest Admin",
      role: "Staff Software Engineer",
      period: "janvier 2024 - novembre 2024",
      description: "Leadership and development role in a company helping enterprises accelerate business by building internal tools.",
      tech: ["Node.js", "TypeScript", "Internal Tools"]
    },
    {
      company: "Forest Admin",
      role: "Senior Software Engineer",
      period: "janvier 2023 - janvier 2024",
      description: "Deep dive into complex technical challenges for building internal tool platforms.",
      tech: ["PostgreSQL", "Redis", "AWS"]
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-300 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0c]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">MP.</span>
          <div className="flex gap-8 text-sm font-medium">
            <a href="#about" className="hover:text-indigo-400 transition-colors">About</a>
            <a href="#experience" className="hover:text-indigo-400 transition-colors">Experience</a>
            <a href="#skills" className="hover:text-indigo-400 transition-colors">Skills</a>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 pt-32 pb-20">
        {/* Hero Section */}
        <motion.section 
          {...fadeIn}
          className="mb-32"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Available for strategic projects
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
            Morgan Perre
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mb-8 leading-relaxed">
            Staff Engineer @ <span className="text-indigo-400 font-semibold">RockFi</span>. 
            Crafting high-performance, scalable solutions at the intersection of strategy and technical excellence.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="mailto:morgan.perre@gmail.com" className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20">
              <Mail className="w-4 h-4" /> Say Hello
            </a>
            <a href="https://www.linkedin.com/in/morgan-perre-15295782" target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold border border-white/10 transition-all flex items-center gap-2">
              <Linkedin className="w-4 h-4" /> LinkedIn
            </a>
          </div>
        </motion.section>

        {/* Info Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32" id="about">
          <motion.div 
            whileHover={{ y: -5 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
          >
            <MapPin className="w-6 h-6 text-indigo-400 mb-4" />
            <h3 className="text-white font-semibold mb-2">Location</h3>
            <p className="text-sm text-slate-400">La Chapelle d'Aurec, Auvergne-Rhône-Alpes, France</p>
          </motion.div>
          <motion.div 
            whileHover={{ y: -5 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
          >
            <Binary className="w-6 h-6 text-blue-400 mb-4" />
            <h3 className="text-white font-semibold mb-2">Focus</h3>
            <p className="text-sm text-slate-400">Software Architecture & Solution Design</p>
          </motion.div>
          <motion.div 
            whileHover={{ y: -5 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
          >
            <Globe2 className="w-6 h-6 text-cyan-400 mb-4" />
            <h3 className="text-white font-semibold mb-2">Languages</h3>
            <p className="text-sm text-slate-400">Native French, Full Prof. English, Elementary IT, PT, ES</p>
          </motion.div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="mb-32">
          <div className="flex items-center gap-4 mb-12">
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <Briefcase className="w-6 h-6 text-indigo-400" />
            </div>
            <h2 className="text-3xl font-bold text-white">Experience</h2>
          </div>

          <div className="space-y-12">
            {experience.map((exp, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative pl-8 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-px before:bg-indigo-500/20"
              >
                <div className="absolute left-[-4px] top-2 w-2 h-2 rounded-full bg-indigo-500" />
                <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
                  <h3 className="text-xl font-bold text-white">{exp.role}</h3>
                  <span className="text-sm font-medium px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400">
                    {exp.period}
                  </span>
                </div>
                <div className="text-indigo-400 font-medium mb-4">{exp.company}</div>
                <p className="text-slate-400 leading-relaxed mb-6 max-w-3xl">
                  {exp.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {exp.tech.map((t, i) => (
                    <span key={i} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-slate-300">
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="mb-32">
          <div className="flex items-center gap-4 mb-12">
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <Code2 className="w-6 h-6 text-blue-400" />
            </div>
            <h2 className="text-3xl font-bold text-white">Skills</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
              <h3 className="text-white font-bold mb-6 flex items-center gap-2 text-lg">
                Core Competencies
              </h3>
              <div className="flex flex-wrap gap-3">
                {["Software Industry", "Software Design", "Solution Architecture", "Team Leadership", "NLP", "3D Reconstruction"].map((skill) => (
                  <span key={skill} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm hover:border-indigo-400/40 hover:bg-indigo-500/5 transition-all cursor-default">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
              <h3 className="text-white font-bold mb-6 flex items-center gap-2 text-lg">
                Technical Stack
              </h3>
              <div className="flex flex-wrap gap-3">
                {["Node.js", "TypeScript", "PostgreSQL", "Redis", "Express", "Koa", "Fastify", "GraphQL", "Ember.js", "Docker", "AWS", "GitHub Actions"].map((skill) => (
                  <span key={skill} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm hover:border-blue-400/40 hover:bg-blue-500/5 transition-all cursor-default">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Education & Hobbies */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                <GraduationCap className="w-6 h-6 text-cyan-400" />
              </div>
              <h2 className="text-3xl font-bold text-white">Education</h2>
            </div>
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-cyan-400 font-bold mb-1">ISIMA Clermont-Ferrand</div>
                <div className="text-white font-medium mb-1">Diplôme d'ingénieur, Informatique</div>
                <div className="text-xs text-slate-500">2014 - 2017</div>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-cyan-400 font-bold mb-1">IUT Imagerie Le Puy en Velay</div>
                <div className="text-white font-medium mb-1">DUT Info & Imagerie Numérique</div>
                <div className="text-xs text-slate-500">2012 - 2014</div>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <Bike className="w-6 h-6 text-emerald-400" />
              </div>
              <h2 className="text-3xl font-bold text-white">Interests</h2>
            </div>
            <div className="p-8 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 h-full">
              <p className="text-slate-300 text-lg leading-relaxed italic">
                "Outside of building high-scale software, I love exploring the outdoors. You'll find me doing Trails and Mountain biking during the weekends."
              </p>
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-white/5 py-12">
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap items-center justify-between gap-8">
          <div>
            <div className="text-white font-bold text-xl mb-2">Morgan Perre</div>
            <p className="text-sm text-slate-500">© 2026 Crafted with precision & style.</p>
          </div>
          <div className="flex gap-6">
            <a href="mailto:morgan.perre@gmail.com" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
              <Mail className="w-4 h-4" /> Email
            </a>
            <a href="https://www.linkedin.com/in/morgan-perre-15295782" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
              <Linkedin className="w-4 h-4" /> LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
