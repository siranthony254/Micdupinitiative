interface ProgressBarProps {
  progress: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function ProgressBar({ progress, size = 'md', className = '' }: ProgressBarProps) {
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2', 
    lg: 'h-3'
  }

  return (
    <div className={`w-full bg-gray-700 rounded-full ${sizeClasses[size]} ${className}`}>
      <div 
        className="bg-amber-500 rounded-full transition-all duration-300"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      ></div>
    </div>
  )
}
