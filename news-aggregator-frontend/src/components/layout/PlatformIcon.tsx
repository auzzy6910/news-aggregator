import { Platform } from '../../types';

const platformConfig: Record<Platform, { label: string; color: string; bgColor: string }> = {
  twitter: { label: 'X', color: '#1DA1F2', bgColor: 'rgba(29, 161, 242, 0.15)' },
  tiktok: { label: 'TT', color: '#ff0050', bgColor: 'rgba(255, 0, 80, 0.15)' },
  instagram: { label: 'IG', color: '#E4405F', bgColor: 'rgba(228, 64, 95, 0.15)' },
  facebook: { label: 'FB', color: '#1877F2', bgColor: 'rgba(24, 119, 242, 0.15)' },
  reddit: { label: 'R', color: '#FF4500', bgColor: 'rgba(255, 69, 0, 0.15)' },
  web: { label: 'W', color: '#4CAF50', bgColor: 'rgba(76, 175, 80, 0.15)' },
};

interface PlatformIconProps {
  platform: Platform;
  size?: 'sm' | 'md' | 'lg';
}

export default function PlatformIcon({ platform, size = 'md' }: PlatformIconProps) {
  const config = platformConfig[platform];
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-lg flex items-center justify-center font-bold transition-transform hover:scale-110`}
      style={{ backgroundColor: config.bgColor, color: config.color }}
      title={`Trending on ${platform.charAt(0).toUpperCase() + platform.slice(1)}`}
    >
      {config.label}
    </div>
  );
}
