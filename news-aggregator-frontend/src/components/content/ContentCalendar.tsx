import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { mockCalendarEvents } from '../../data/mockData';
import PlatformIcon from '../layout/PlatformIcon';

const statusColors: Record<string, { bg: string; text: string }> = {
  posted: { bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  scheduled: { bg: 'bg-amber-500/10', text: 'text-amber-400' },
  draft: { bg: 'bg-slate-500/10', text: 'text-slate-400' },
};

export default function ContentCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 1)); // April 2026

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const days = useMemo(() => {
    const result: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) result.push(null);
    for (let i = 1; i <= daysInMonth; i++) result.push(i);
    return result;
  }, [firstDay, daysInMonth]);

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return mockCalendarEvents.filter((e) => e.date === dateStr);
  };

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          Content Calendar
        </h2>
        <p className="text-sm text-slate-400 mt-1">Visual calendar view for scheduled and posted content</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-6"
      >
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-6">
          <motion.button onClick={prevMonth} className="p-2 rounded-lg hover:bg-slate-800/50 text-slate-400 hover:text-white transition-colors" whileTap={{ scale: 0.95 }}>
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
          <h3 className="text-lg font-semibold text-white">{monthName}</h3>
          <motion.button onClick={nextMonth} className="p-2 rounded-lg hover:bg-slate-800/50 text-slate-400 hover:text-white transition-colors" whileTap={{ scale: 0.95 }}>
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-xs text-slate-500 font-medium py-2">{day}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="min-h-24 rounded-lg" />;
            }

            const events = getEventsForDay(day);
            const isToday = day === 1 && month === 3 && year === 2026;

            return (
              <div
                key={day}
                className={`min-h-24 rounded-lg p-2 border transition-colors ${
                  isToday
                    ? 'border-blue-500/30 bg-blue-500/5'
                    : 'border-slate-800/30 hover:bg-slate-800/20'
                }`}
              >
                <span className={`text-xs font-medium ${isToday ? 'text-blue-400' : 'text-slate-400'}`}>{day}</span>
                <div className="mt-1 space-y-1">
                  {events.map((event) => {
                    const colors = statusColors[event.status];
                    return (
                      <div
                        key={event.id}
                        className={`${colors.bg} ${colors.text} text-xs px-1.5 py-0.5 rounded truncate flex items-center gap-1`}
                      >
                        <PlatformIcon platform={event.platform} size="sm" />
                        <span className="truncate">{event.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-800/60">
          {Object.entries(statusColors).map(([status, colors]) => (
            <div key={status} className="flex items-center gap-1.5 text-xs">
              <span className={`w-2.5 h-2.5 rounded-full ${colors.bg} border ${colors.text.replace('text-', 'border-')}`} />
              <span className="text-slate-400 capitalize">{status}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Upcoming events list */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl p-6"
      >
        <h3 className="text-base font-semibold text-white mb-4">Upcoming Events</h3>
        <div className="space-y-2">
          {mockCalendarEvents
            .filter((e) => e.status !== 'posted')
            .map((event) => {
              const colors = statusColors[event.status];
              return (
                <div key={event.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/30">
                  <PlatformIcon platform={event.platform} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{event.title}</p>
                    <p className="text-xs text-slate-400">{event.date}</p>
                  </div>
                  <span className={`${colors.bg} ${colors.text} text-xs font-medium px-2 py-1 rounded-md capitalize`}>
                    {event.status}
                  </span>
                </div>
              );
            })}
        </div>
      </motion.div>
    </div>
  );
}
