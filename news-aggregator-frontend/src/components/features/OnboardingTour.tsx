import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';

interface TourStep {
  title: string;
  description: string;
  target: string;
}

const tourSteps: TourStep[] = [
  { title: 'Welcome to TrendPulse!', description: 'Your real-time trend aggregation platform. Let us show you around the key features.', target: 'dashboard' },
  { title: 'Dashboard', description: 'View all trending topics across multiple platforms with real-time engagement metrics and trend scores.', target: 'dashboard' },
  { title: 'Predictions', description: 'AI-powered trend prediction engine analyzes content velocity to predict what will trend next.', target: 'predictions' },
  { title: 'Analytics', description: 'Deep dive into performance metrics with per-post analytics, engagement charts, and platform breakdowns.', target: 'analytics' },
  { title: 'Content Studio', description: 'Use AI to recreate trending content with customizable brand voice, tone, and length settings.', target: 'content' },
  { title: 'Social Hub', description: 'Manage connected social accounts, set up auto-posting rules, and monitor your posting queue.', target: 'social' },
  { title: 'Bookmarks', description: 'Save interesting trends for later by clicking the bookmark icon on any trend card.', target: 'bookmarks' },
  { title: 'Dark/Light Mode', description: 'Toggle between dark and light themes using the theme switch in the header.', target: 'theme' },
  { title: 'Keyboard Shortcuts', description: 'Press "?" at any time to view available keyboard shortcuts for quick navigation.', target: 'shortcuts' },
  { title: 'You\'re all set!', description: 'Start exploring trends and creating content. You can restart this tour anytime from Settings.', target: 'dashboard' },
];

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (tab: string) => void;
}

export default function OnboardingTour({ isOpen, onClose, onNavigate }: OnboardingTourProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (isOpen) setStep(0);
  }, [isOpen]);

  const currentStep = tourSteps[step];
  const isLast = step === tourSteps.length - 1;
  const isFirst = step === 0;

  const handleNext = () => {
    if (isLast) {
      localStorage.setItem('trendpulse-onboarding-done', 'true');
      onClose();
    } else {
      setStep(step + 1);
      if (onNavigate && tourSteps[step + 1]) {
        onNavigate(tourSteps[step + 1].target);
      }
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      setStep(step - 1);
      if (onNavigate && tourSteps[step - 1]) {
        onNavigate(tourSteps[step - 1].target);
      }
    }
  };

  const handleSkip = () => {
    localStorage.setItem('trendpulse-onboarding-done', 'true');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[100]"
            onClick={handleSkip}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-md"
          >
            <div className="glass-card rounded-2xl p-6 border border-slate-700/50 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <span className="text-xs text-slate-400">Step {step + 1} of {tourSteps.length}</span>
                </div>
                <button onClick={handleSkip} className="text-slate-400 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Progress bar */}
              <div className="h-1 bg-slate-800 rounded-full mb-6 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)' }}
                  animate={{ width: `${((step + 1) / tourSteps.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="text-xl font-bold text-white mb-2">{currentStep.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{currentStep.description}</p>
                </motion.div>
              </AnimatePresence>

              {/* Actions */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-800/60">
                <button onClick={handleSkip} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                  Skip tour
                </button>
                <div className="flex items-center gap-2">
                  {!isFirst && (
                    <motion.button
                      onClick={handlePrev}
                      className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800/50 transition-colors"
                      whileTap={{ scale: 0.95 }}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Back
                    </motion.button>
                  )}
                  <motion.button
                    onClick={handleNext}
                    className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold text-white"
                    style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLast ? 'Get Started' : 'Next'}
                    {!isLast && <ChevronRight className="w-4 h-4" />}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
