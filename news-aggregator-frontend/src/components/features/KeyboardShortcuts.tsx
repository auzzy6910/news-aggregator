import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, X } from 'lucide-react';

const shortcuts = [
  { keys: ['1'], description: 'Go to Dashboard' },
  { keys: ['2'], description: 'Go to Predictions' },
  { keys: ['3'], description: 'Go to Analytics' },
  { keys: ['4'], description: 'Go to Calendar' },
  { keys: ['5'], description: 'Go to Social Hub' },
  { keys: ['6'], description: 'Go to Bookmarks' },
  { keys: ['?'], description: 'Show keyboard shortcuts' },
  { keys: ['Esc'], description: 'Close dialogs' },
  { keys: ['/'], description: 'Focus search bar' },
  { keys: ['t'], description: 'Toggle theme' },
  { keys: ['n'], description: 'Toggle notifications' },
];

interface KeyboardShortcutsProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
  onToggleTheme: () => void;
  onToggleNotifications: () => void;
}

export default function KeyboardShortcuts({
  isOpen,
  onClose,
  onNavigate,
  onToggleTheme,
  onToggleNotifications,
}: KeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        if (e.key === 'Escape') {
          (target as HTMLInputElement).blur();
        }
        return;
      }

      switch (e.key) {
        case '1': onNavigate('dashboard'); break;
        case '2': onNavigate('predictions'); break;
        case '3': onNavigate('analytics'); break;
        case '4': onNavigate('calendar'); break;
        case '5': onNavigate('social'); break;
        case '6': onNavigate('bookmarks'); break;
        case 't': onToggleTheme(); break;
        case 'n': onToggleNotifications(); break;
        case '/':
          e.preventDefault();
          document.querySelector<HTMLInputElement>('input[type="text"]')?.focus();
          break;
        case 'Escape': onClose(); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNavigate, onClose, onToggleTheme, onToggleNotifications]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[90]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[91] w-full max-w-md"
          >
            <div className="glass-card rounded-2xl p-6 border border-slate-700/50 shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Keyboard className="w-5 h-5 text-blue-400" />
                  <h3 className="text-lg font-bold text-white">Keyboard Shortcuts</h3>
                </div>
                <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                {shortcuts.map((shortcut) => (
                  <div key={shortcut.description} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-800/30">
                    <span className="text-sm text-slate-300">{shortcut.description}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key) => (
                        <kbd
                          key={key}
                          className="px-2 py-1 rounded-md bg-slate-800/80 border border-slate-600/50 text-xs font-mono text-slate-300 min-w-[28px] text-center"
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-xs text-slate-500 mt-4 text-center">
                Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800/80 border border-slate-600/50 text-slate-400 font-mono">?</kbd> anytime to show this dialog
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
