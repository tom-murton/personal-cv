import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Enhanced skeleton component for more attractive loading states
interface LoadingSkeletonProps {
  variant?: 'card' | 'text' | 'image' | 'button' | 'avatar';
  width?: string | number;
  height?: string | number;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  className?: string;
  animate?: boolean;
  shimmer?: boolean;
}

// Composable group for creating content placeholders
interface SkeletonGroupProps {
  children: React.ReactNode;
  className?: string;
}

// Text line with configurable width for text placeholders
interface TextLineProps extends Omit<LoadingSkeletonProps, 'variant'> {
  widthPercent?: number;
}

// Paragraph component for multiple text lines
interface ParagraphProps {
  lines?: number;
  className?: string;
  lastLineWidth?: number;
}

// Card placeholder for article/content cards
interface CardProps extends Omit<LoadingSkeletonProps, 'variant'> {
  withImage?: boolean;
  imageHeight?: string | number;
}

// Type definition for the component with subcomponents
interface LoadingSkeletonComponent extends React.FC<LoadingSkeletonProps> {
  Group: React.FC<SkeletonGroupProps>;
  TextLine: React.FC<TextLineProps>;
  Paragraph: React.FC<ParagraphProps>;
  Card: React.FC<CardProps>;
}

// Main skeleton implementation
const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'text',
  width,
  height,
  rounded = 'md',
  className = '',
  animate = true,
  shimmer = true,
}) => {
  // Map variants to default dimensions - memoized to avoid recreation
  const variantMap = React.useMemo(() => ({
    text: { width: '100%', height: '1rem' },
    card: { width: '100%', height: '8rem' },
    image: { width: '100%', height: '12rem' },
    button: { width: '8rem', height: '2.5rem' },
    avatar: { width: '3rem', height: '3rem' },
  }), []);

  // Map rounded values - memoized to avoid recreation
  const roundedMap = React.useMemo(() => ({
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  }), []);

  // Final dimensions
  const finalWidth = width || variantMap[variant].width;
  const finalHeight = height || variantMap[variant].height;

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        roundedMap[rounded],
        animate ? 'animate-pulse' : '',
        className
      )}
      style={{
        width: finalWidth,
        height: finalHeight,
      }}
    >
      {/* Base skeleton */}
      <div className="absolute inset-0 bg-muted/30" />

      {/* Shimmer effect overlay */}
      {shimmer && (
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
            backgroundSize: '200% 100%',
          }}
          animate={{
            backgroundPosition: ['100% 0%', '-100% 0%'],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}
    </div>
  );
};

// Group component implementation
const Group: React.FC<SkeletonGroupProps> = ({ children, className = '' }) => {
  return <div className={cn('space-y-3', className)}>{children}</div>;
};

// TextLine component implementation
const TextLine: React.FC<TextLineProps> = ({ widthPercent = 100, ...props }) => {
  return <LoadingSkeleton variant="text" width={`${widthPercent}%`} {...props} />;
};

// Paragraph component implementation
const Paragraph: React.FC<ParagraphProps> = ({ 
  lines = 3, 
  className = '', 
  lastLineWidth = 70 
}) => {
  // Memoize the lines array to prevent recreation on every render
  const lineIndices = React.useMemo(() => 
    Array.from({ length: lines - 1 }).map((_, i) => i),
    [lines]
  );
  
  return (
    <div className={cn('space-y-2', className)}>
      {lineIndices.map((i) => (
        <TextLine key={i} />
      ))}
      {lines > 0 && <TextLine widthPercent={lastLineWidth} />}
    </div>
  );
};

// Card component implementation
const Card: React.FC<CardProps> = ({ 
  withImage = true, 
  imageHeight = '8rem',
  className = '',
  ...props 
}) => {
  return (
    <div className={cn('space-y-3 rounded-lg border border-border p-4', className)}>
      {withImage && (
        <LoadingSkeleton 
          variant="image" 
          height={imageHeight} 
          rounded="md" 
          className="mb-4"
          {...props}
        />
      )}
      <TextLine widthPercent={40} height="1.5rem" className="mb-2" {...props} />
      <Paragraph lines={2} {...props} />
    </div>
  );
};

// Create memoized versions of all components
const MemoizedLoadingSkeleton = React.memo(LoadingSkeleton);
const MemoizedGroup = React.memo(Group);
const MemoizedTextLine = React.memo(TextLine);
const MemoizedParagraph = React.memo(Paragraph);
const MemoizedCard = React.memo(Card);

// Attach display names for debugging
MemoizedLoadingSkeleton.displayName = 'LoadingSkeleton';
MemoizedGroup.displayName = 'SkeletonGroup';
MemoizedTextLine.displayName = 'SkeletonTextLine';
MemoizedParagraph.displayName = 'SkeletonParagraph';
MemoizedCard.displayName = 'SkeletonCard';

// Create the composite component
const SkeletonComponent = MemoizedLoadingSkeleton as unknown as LoadingSkeletonComponent;
SkeletonComponent.Group = MemoizedGroup;
SkeletonComponent.TextLine = MemoizedTextLine;
SkeletonComponent.Paragraph = MemoizedParagraph;
SkeletonComponent.Card = MemoizedCard;

export default SkeletonComponent; 