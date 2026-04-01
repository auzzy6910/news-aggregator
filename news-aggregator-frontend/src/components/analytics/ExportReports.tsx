import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Table, CheckCircle2 } from 'lucide-react';
import { mockNews } from '../../data/mockData';

type ExportFormat = 'csv' | 'pdf';

export default function ExportReports() {
  const [format, setFormat] = useState<ExportFormat>('csv');
  const [exported, setExported] = useState(false);
  const [selectedFields, setSelectedFields] = useState<string[]>([
    'title', 'platform', 'category', 'trendScore', 'likes', 'shares', 'comments', 'sentiment',
  ]);

  const allFields = [
    { id: 'title', label: 'Title' },
    { id: 'platform', label: 'Platform' },
    { id: 'category', label: 'Category' },
    { id: 'trendScore', label: 'Trend Score' },
    { id: 'likes', label: 'Likes' },
    { id: 'shares', label: 'Shares' },
    { id: 'comments', label: 'Comments' },
    { id: 'velocity', label: 'Velocity' },
    { id: 'sentiment', label: 'Sentiment' },
    { id: 'sentimentScore', label: 'Sentiment Score' },
    { id: 'author', label: 'Author' },
    { id: 'publishedAt', label: 'Published Date' },
    { id: 'location', label: 'Location' },
    { id: 'status', label: 'Status' },
    { id: 'hashtags', label: 'Hashtags' },
  ];

  const toggleField = (id: string) => {
    setSelectedFields((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleExport = () => {
    if (format === 'csv') {
      const headers = selectedFields.join(',');
      const rows = mockNews.map((item) =>
        selectedFields.map((field) => {
          switch (field) {
            case 'likes': return item.metrics.likes;
            case 'shares': return item.metrics.shares;
            case 'comments': return item.metrics.comments;
            case 'velocity': return item.metrics.velocity;
            case 'location': return `${item.location.region} ${item.location.country}`;
            case 'hashtags': return item.hashtags.join('; ');
            case 'title': return item.title;
            case 'platform': return item.platform;
            case 'category': return item.category;
            case 'trendScore': return item.trendScore;
            case 'sentiment': return item.sentiment ?? '';
            case 'sentimentScore': return item.sentimentScore ?? '';
            case 'author': return item.author;
            case 'publishedAt': return item.publishedAt;
            case 'status': return item.status;
            default: return '';
          }
        }).join(',')
      ).join('\n');

      const csv = `${headers}\n${rows}`;
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'trendpulse-report.csv';
      a.click();
      URL.revokeObjectURL(url);
    } else {
      // Generate a simple text-based PDF-like report
      const content = mockNews.map((item) =>
        `${item.title}\nPlatform: ${item.platform} | Score: ${item.trendScore} | Sentiment: ${item.sentiment}\nLikes: ${item.metrics.likes} | Shares: ${item.metrics.shares} | Comments: ${item.metrics.comments}\n---`
      ).join('\n');

      const blob = new Blob([`TrendPulse Report\n${'='.repeat(50)}\n\n${content}`], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'trendpulse-report.txt';
      a.click();
      URL.revokeObjectURL(url);
    }

    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <Download className="w-5 h-5 text-white" />
          </div>
          Export Reports
        </h2>
        <p className="text-sm text-slate-400 mt-1">Download trend data as CSV or text reports</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Format Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6"
        >
          <h3 className="text-base font-semibold text-white mb-4">Export Format</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setFormat('csv')}
              className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                format === 'csv'
                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                  : 'bg-slate-800/30 border-slate-700/30 text-slate-400 hover:bg-slate-800/50'
              }`}
            >
              <Table className="w-8 h-8" />
              <span className="text-sm font-medium">CSV</span>
              <span className="text-xs opacity-60">Spreadsheet format</span>
            </button>
            <button
              onClick={() => setFormat('pdf')}
              className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                format === 'pdf'
                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                  : 'bg-slate-800/30 border-slate-700/30 text-slate-400 hover:bg-slate-800/50'
              }`}
            >
              <FileText className="w-8 h-8" />
              <span className="text-sm font-medium">Text Report</span>
              <span className="text-xs opacity-60">Readable format</span>
            </button>
          </div>

          <div className="mt-6">
            <p className="text-sm text-slate-400 mb-2">Data to export: {mockNews.length} trends</p>
            <motion.button
              onClick={handleExport}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white transition-all"
              style={{ background: exported ? '#10b981' : 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {exported ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Downloaded!
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Export {format === 'csv' ? 'CSV' : 'Report'}
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Field Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6"
        >
          <h3 className="text-base font-semibold text-white mb-4">Select Fields</h3>
          <div className="space-y-2">
            {allFields.map((field) => (
              <label key={field.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/30 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={selectedFields.includes(field.id)}
                  onChange={() => toggleField(field.id)}
                  className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500/20 accent-blue-500"
                />
                <span className="text-sm text-slate-300">{field.label}</span>
              </label>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl p-6"
      >
        <h3 className="text-base font-semibold text-white mb-4">Preview</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-800/60">
                {selectedFields.map((field) => (
                  <th key={field} className="text-left py-2 px-3 text-slate-400 font-medium capitalize">{field}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockNews.slice(0, 5).map((item) => (
                <tr key={item.id} className="border-b border-slate-800/30">
                  {selectedFields.map((field) => (
                    <td key={field} className="py-2 px-3 text-slate-300 truncate max-w-32">
                      {field === 'likes' ? item.metrics.likes.toLocaleString() :
                       field === 'shares' ? item.metrics.shares.toLocaleString() :
                       field === 'comments' ? item.metrics.comments.toLocaleString() :
                       field === 'velocity' ? item.metrics.velocity :
                       field === 'location' ? `${item.location.region}` :
                       field === 'hashtags' ? item.hashtags.slice(0, 2).join(', ') :
                       field === 'title' ? item.title :
                       field === 'platform' ? item.platform :
                       field === 'category' ? item.category :
                       field === 'trendScore' ? item.trendScore :
                       field === 'sentiment' ? (item.sentiment ?? '') :
                       field === 'sentimentScore' ? (item.sentimentScore ?? '') :
                       field === 'author' ? item.author :
                       field === 'publishedAt' ? item.publishedAt :
                       field === 'status' ? item.status : ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
