

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";

const GreenwoodAcademyPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [stage, setStage] = useState<'initial' | 'grades' | 'sections' | 'pdf'>('initial');
  const [grade, setGrade] = useState('');
  const [section, setSection] = useState('');

  const pdfData = {
    '8th': { 'ا': '/pdfs/8-a.pdf', 'ب': '/pdfs/8-b.pdf', 'ج': '/pdfs/8-c.pdf', 'د': '/pdfs/8-d.pdf', 'ه': '/pdfs/8-e.pdf' },
    '9th': { 'ا': '/pdfs/9-a.pdf', 'ب': '/pdfs/9-b.pdf', 'ج': '/pdfs/9-c.pdf', 'د': '/pdfs/9-d.pdf', 'ه': '/pdfs/9-e.pdf' },
    '10th': { 'ا': '/pdfs/10-a.pdf', 'ب': '/pdfs/10-b.pdf', 'ج': '/pdfs/10-c.pdf', 'د': '/pdfs/10-d.pdf', 'ه': '/pdfs/10-e.pdf' },
  };

  const grades = ['8th', '9th', '10th'];
  const sections = ['ا', 'ب', 'ج', 'د', 'ه'];

  const buttons = [
    { label: t('academy.students') || "Students", href: "#", action: 'students' },
    { label: t('academy.teachers') || "Teachers and Directors", href: "#" },
    { label: t('academy.books') || "School Books", href: "#" },
    { label: t('academy.labs') || "Labs", href: "/", action: 'labs' },
    { label: t('academy.platforms') || "Education Platforms", href: "#" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <>
  
      <div className="relative min-h-screen w-full overflow-hidden bg-black pt-0 z-50">
        {/* Animated Background Orbs like Landing */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl"
            animate={{ y: [0, 40, 0], x: [0, 30, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
            animate={{ y: [0, -40, 0], x: [0, -30, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
          <motion.div
            className="absolute top-1/3 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
        </div>

        {/* ── Header ── */}
        <motion.header
          className="relative z-10 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start gap-6">
              {/* Top-left logo placeholder */}
              <div className="flex flex-col gap-2">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-800/50 border-2 border-gray-600/50 rounded-xl p-2 flex items-center justify-center">
                  <img 
                    src="/school-logo.png" 
                    alt="School Logo" 
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
                <p className="text-xs text-gray-500 max-w-48">Add your school logo to public/school-logo.png</p>
              </div>

              {/* Language Switcher top-right */}
              <div className="ml-auto">
                <LanguageSwitcher />
              </div>

              {/* Right: Name and tagline boxes centered */}
              <div className="flex flex-col items-center gap-4 flex-1">
                {/* School name box */}
                <div className="border-2 border-cyan-500/40 bg-black/50 backdrop-blur-sm rounded-2xl px-8 py-3">
  <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent tracking-tight text-center">
                    {t('academy.schoolName') || "King AlHussain Secondary School for Boys"}
                  </h1>
                </div>

                {/* Tagline box */}
                <div className="border border-cyan-500/30 bg-black/30 backdrop-blur-sm rounded-xl px-6 py-2">
                  <p className="text-sm sm:text-base text-gray-300 text-center font-medium">
                    {t('academy.tagline') || "Empowering Minds, Nurturing Futures. Est. 1995"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        {/* ── Main Content ── */}
        <motion.main
          className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Two-column split */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start mb-16 lg:mb-20">
            {/* Left: Our Vision - Glass card */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="group relative rounded-3xl p-8 sm:p-10 lg:p-12 border border-cyan-500/30 bg-black/50 backdrop-blur-sm overflow-hidden hover:border-cyan-400/60 hover:shadow-2xl hover:shadow-cyan-500/40 transition-all duration-500"
            >
              {/* Glow accent */}
              <motion.div 
                className="absolute -inset-4 bg-gradient-to-br from-cyan-500/20 to-blue-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
              <div className="relative z-10 text-center">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-6 sm:mb-8">
                  {t('academy.ourVision.title') || "Our Vision"}
                </h2>
                <p className="text-gray-300 text-lg sm:text-xl lg:text-2xl leading-relaxed max-w-md mx-auto">
                  {t('academy.ourVision.text') || "To provide a creative and inclusive learning environment where every student can discover their unique potential"}
                </p>
              </div>
            </motion.div>

            {/* Right: Button Stack - Glass buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col gap-4 sm:gap-6"
            >
              {stage === 'initial' ? buttons.map((button, index) => (
                <motion.div
                  key={button.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (button.action === 'students') {
                        setStage('grades');
                      } else if (button.action === 'labs') {
                        navigate('/labs');
                      } else {
                        alert(`${button.label} - Coming soon!`);
                      }
                    }}
                    className="block w-full border-2 border-cyan-500/40 bg-black/60 backdrop-blur-sm rounded-2xl px-6 sm:px-8 py-5 sm:py-6
                               text-gray-200 font-bold text-lg sm:text-xl lg:text-2xl text-center transition-all duration-300 ease-out
                               hover:scale-[1.02] hover:border-cyan-400/80 hover:shadow-xl hover:shadow-cyan-500/30
                               hover:bg-cyan-500/10 hover:text-white active:scale-[0.98]"
                  >
                    {button.label}
                  </button>
                </motion.div>
              )) : null}
              {stage === 'grades' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <h3 className="text-2xl font-bold text-white mb-6 text-center">
                    {t('academy.selectGrade') || 'Select Grade'}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {grades.map((g) => (
                      <button
                        key={g}
                        onClick={() => {
                          setGrade(g);
                          setStage('sections');
                        }}
                        className="border-2 border-blue-500/50 bg-black/70 backdrop-blur-sm rounded-2xl px-6 py-4 text-white font-bold text-xl hover:scale-[1.02] hover:border-blue-400/80 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300"
                      >
                        {t(`academy.grade${g.toLowerCase()}`) || g}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setStage('initial')}
                    className="mt-6 w-full border border-gray-600 bg-gray-800 rounded-xl py-3 text-gray-300 hover:bg-gray-700 transition"
                  >
                    {t('academy.back') || 'Back'}
                  </button>
                </motion.div>
              )}
              {stage === 'sections' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <h3 className="text-2xl font-bold text-white mb-6 text-center">
                    {t('academy.selectSection') || 'Select Section'} - {grade}
                  </h3>
                  <div className="grid grid-cols-5 gap-3">
                    {sections.map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          setSection(s);
                          setStage('pdf');
                        }}
                        className="border-2 border-purple-500/50 bg-black/70 backdrop-blur-sm rounded-xl px-4 py-3 text-white font-bold text-lg hover:scale-105 hover:border-purple-400/80 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setStage('grades')}
                    className="mt-6 w-full border border-gray-600 bg-gray-800 rounded-xl py-3 text-gray-300 hover:bg-gray-700 transition"
                  >
                    {t('academy.back') || 'Back'}
                  </button>
                </motion.div>
              )}
              {stage === 'pdf' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <h3 className="text-2xl font-bold text-white mb-6">
                    {t('academy.loadingPdf', { grade, section }) || `Loading ${grade} ${section} Student List...`}
                  </h3>
                  <p className="text-gray-400 mb-8">PDF: {pdfData[grade as keyof typeof pdfData]?.[section as keyof typeof pdfData['8th']] || 'placeholder.pdf'}</p>
                  <div className="bg-gray-800 rounded-2xl p-8 min-h-64 flex items-center justify-center border-2 border-dashed border-gray-600">
                    <div className="text-center">
                      <p className="text-xl text-gray-300 mb-2">PDF Viewer Placeholder</p>
                      <p className="text-sm text-gray-500">Replace with <iframe src={pdfData[grade][section]} /></p>
                    </div>
                  </div>
                  <button
                    onClick={() => setStage('sections')}
                    className="mt-8 w-full border border-gray-600 bg-gray-800 rounded-xl py-3 text-gray-300 hover:bg-gray-700 transition"
                  >
                    {t('academy.back') || 'Back'}
                  </button>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Education Platforms Callout - Glass */}
          <motion.div
            variants={itemVariants}
            className="relative rounded-3xl p-6 sm:p-8 lg:p-10 border border-purple-500/30 bg-black/40 backdrop-blur-sm hover:border-purple-400/60 hover:shadow-2xl hover:shadow-purple-500/40 transition-all duration-500 mx-auto max-w-2xl"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
              <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent whitespace-nowrap">
                Education Platforms
              </h3>
              <ArrowRight className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-400 flex-shrink-0" strokeWidth={2.5} />
              <p className="text-gray-300 text-base sm:text-lg">
                Access our integrated learning management system →
              </p>
            </div>
          </motion.div>
        </motion.main>
      </div>
    </>
  );
};

export default GreenwoodAcademyPage;

