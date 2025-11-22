import type { LucideIcon } from 'lucide-react';

interface IconWithBackgroundProps {
  icon: LucideIcon;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  bgColor?: string;
  className?: string;
}

export function IconWithBackground({
  icon: Icon,
  size = 'md',
  color = 'text-primary',
  bgColor = 'bg-primary/10',
  className = ''
}: IconWithBackgroundProps) {
  const sizeClasses = {
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-12 w-12'
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full ${bgColor} ${className}`}>
      <Icon className={`${iconSizes[size]} ${color}`} aria-hidden="true" />
    </div>
  );
}