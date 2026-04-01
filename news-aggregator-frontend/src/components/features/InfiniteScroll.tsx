import { useState, useEffect, useRef, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface InfiniteScrollProps {
  children: ReactNode[];
  pageSize?: number;
}

export default function InfiniteScroll({ children, pageSize = 6 }: InfiniteScrollProps) {
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const hasMore = visibleCount < children.length;

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setLoading(true);
          // Simulate loading delay for smooth UX
          setTimeout(() => {
            setVisibleCount((prev) => Math.min(prev + pageSize, children.length));
            setLoading(false);
          }, 500);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loading, pageSize, children.length]);

  // Reset when children change
  useEffect(() => {
    setVisibleCount(pageSize);
  }, [children.length, pageSize]);

  const visibleChildren = children.slice(0, visibleCount);

  return (
    <>
      {visibleChildren}
      {hasMore && (
        <div ref={sentinelRef} className="col-span-full flex justify-center py-6">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-slate-400"
            >
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading more trends...</span>
            </motion.div>
          ) : (
            <div className="h-4" />
          )}
        </div>
      )}
      {!hasMore && children.length > pageSize && (
        <div className="col-span-full text-center py-4">
          <p className="text-xs text-slate-500">All {children.length} trends loaded</p>
        </div>
      )}
    </>
  );
}
