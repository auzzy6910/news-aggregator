import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { GripVertical, X, Plus, LayoutGrid } from 'lucide-react';
import StatsBar from '../dashboard/StatsBar';
import TrendChart from '../dashboard/TrendChart';

interface Widget {
  id: string;
  title: string;
  type: 'stats' | 'chart' | 'placeholder';
  visible: boolean;
}

const defaultWidgets: Widget[] = [
  { id: 'stats', title: 'Stats Overview', type: 'stats', visible: true },
  { id: 'chart', title: 'Trend Chart', type: 'chart', visible: true },
  { id: 'engagement', title: 'Engagement Summary', type: 'placeholder', visible: true },
  { id: 'platforms', title: 'Platform Breakdown', type: 'placeholder', visible: true },
];

export default function DragDropDashboard() {
  const [widgets, setWidgets] = useState<Widget[]>(() => {
    const saved = localStorage.getItem('trendpulse-widgets');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* use default */ }
    }
    return defaultWidgets;
  });
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const saveWidgets = useCallback((newWidgets: Widget[]) => {
    setWidgets(newWidgets);
    localStorage.setItem('trendpulse-widgets', JSON.stringify(newWidgets));
  }, []);

  const handleDragStart = (id: string) => {
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) return;

    const newWidgets = [...widgets];
    const dragIdx = newWidgets.findIndex((w) => w.id === draggedId);
    const targetIdx = newWidgets.findIndex((w) => w.id === targetId);
    if (dragIdx === -1 || targetIdx === -1) return;

    const [dragged] = newWidgets.splice(dragIdx, 1);
    newWidgets.splice(targetIdx, 0, dragged);
    saveWidgets(newWidgets);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
  };

  const toggleWidget = (id: string) => {
    const newWidgets = widgets.map((w) =>
      w.id === id ? { ...w, visible: !w.visible } : w
    );
    saveWidgets(newWidgets);
  };

  const resetLayout = () => {
    saveWidgets(defaultWidgets);
  };

  const renderWidget = (widget: Widget) => {
    switch (widget.type) {
      case 'stats':
        return <StatsBar />;
      case 'chart':
        return <TrendChart />;
      case 'placeholder':
        return (
          <div className="glass-card rounded-2xl p-6">
            <h4 className="text-sm font-semibold text-white mb-3">{widget.title}</h4>
            <div className="h-32 rounded-xl bg-slate-800/30 border border-dashed border-slate-700/50 flex items-center justify-center">
              <p className="text-sm text-slate-500">Widget content</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const visibleWidgets = widgets.filter((w) => w.visible);
  const hiddenWidgets = widgets.filter((w) => !w.visible);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-slate-400">Drag widgets to reorder</span>
        </div>
        <div className="flex items-center gap-2">
          {hiddenWidgets.length > 0 && (
            <div className="relative">
              <motion.button
                onClick={() => setShowAddMenu(!showAddMenu)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 bg-slate-800/50 border border-slate-700/50 hover:text-white transition-all"
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-3 h-3" />
                Add Widget
              </motion.button>
              {showAddMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-48 glass-card rounded-xl border border-slate-700/50 shadow-xl z-20 overflow-hidden"
                >
                  {hiddenWidgets.map((w) => (
                    <button
                      key={w.id}
                      onClick={() => { toggleWidget(w.id); setShowAddMenu(false); }}
                      className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-800/50 transition-colors"
                    >
                      {w.title}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          )}
          <motion.button
            onClick={resetLayout}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 bg-slate-800/50 border border-slate-700/50 hover:text-white transition-all"
            whileTap={{ scale: 0.95 }}
          >
            Reset Layout
          </motion.button>
        </div>
      </div>

      {/* Draggable widgets */}
      <div className="space-y-4">
        {visibleWidgets.map((widget) => (
          <motion.div
            key={widget.id}
            draggable
            onDragStart={() => handleDragStart(widget.id)}
            onDragOver={(e) => handleDragOver(e as unknown as React.DragEvent, widget.id)}
            onDragEnd={handleDragEnd}
            layout
            className={`relative group ${draggedId === widget.id ? 'opacity-50' : ''}`}
          >
            {/* Drag handle and close */}
            <div className="absolute -top-2 right-2 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="p-1 rounded bg-slate-800/80 border border-slate-700/50 cursor-grab active:cursor-grabbing text-slate-400">
                <GripVertical className="w-3 h-3" />
              </div>
              <button
                onClick={() => toggleWidget(widget.id)}
                className="p-1 rounded bg-slate-800/80 border border-slate-700/50 text-slate-400 hover:text-red-400 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            {renderWidget(widget)}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
