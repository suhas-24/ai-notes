"use client";

import React from "react";
import { motion } from "framer-motion";
import { Block } from "@/store/notesStore";
import { cn } from "@/lib/utils";

interface BlockRendererProps {
  block: Block;
  isSelected?: boolean;
  onSelect?: () => void;
  className?: string;
}

const blockVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  },
  exit: { 
    opacity: 0, 
    x: -100,
    transition: {
      duration: 0.2
    }
  }
};

export const BlockRenderer: React.FC<BlockRendererProps> = ({ 
  block, 
  isSelected = false, 
  onSelect,
  className 
}) => {
  const handleClick = () => {
    onSelect?.();
  };

  const renderContent = () => {
    switch (block.type) {
      case 'heading':
        const HeadingTag = `h${block.metadata?.level || 1}` as keyof JSX.IntrinsicElements;
        const headingClasses = {
          1: "text-3xl font-bold text-gray-900",
          2: "text-2xl font-semibold text-gray-800",
          3: "text-xl font-semibold text-gray-700",
          4: "text-lg font-medium text-gray-700",
          5: "text-base font-medium text-gray-600",
          6: "text-sm font-medium text-gray-600"
        };
        
        return (
          <HeadingTag 
            className={headingClasses[block.metadata?.level as keyof typeof headingClasses] || headingClasses[1]}
          >
            {block.content}
          </HeadingTag>
        );

      case 'list':
        const items = block.content.split('\n').filter(item => item.trim());
        return (
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {items.map((item, index) => (
              <li key={index} className="leading-relaxed">
                {item.replace(/^[•\-\*]\s*/, '')}
              </li>
            ))}
          </ul>
        );

      case 'code':
        return (
          <div className="relative">
            {block.metadata?.language && (
              <div className="absolute top-2 right-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {block.metadata.language}
              </div>
            )}
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <code className="text-sm font-mono">
                {block.content}
              </code>
            </pre>
          </div>
        );

      case 'image':
        return (
          <div className="text-center">
            <img 
              src={block.metadata?.url || block.content} 
              alt={block.metadata?.alt || 'Generated image'}
              className="max-w-full h-auto rounded-lg shadow-md mx-auto"
            />
            {block.metadata?.alt && (
              <p className="text-sm text-gray-500 mt-2 italic">
                {block.metadata.alt}
              </p>
            )}
          </div>
        );

      case 'text':
      default:
        return (
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {block.content}
          </p>
        );
    }
  };

  return (
    <motion.div
      variants={blockVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      onClick={handleClick}
      className={cn(
        "group relative p-4 rounded-lg border transition-all duration-200 cursor-pointer",
        isSelected 
          ? "border-blue-500 bg-blue-50 shadow-md" 
          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm",
        className
      )}
    >
      {/* Selection indicator */}
      {isSelected && (
        <motion.div 
          className="absolute -left-1 top-0 bottom-0 w-1 bg-blue-500 rounded-r"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
      
      {/* Block type indicator */}
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          <div className={cn(
            "w-2 h-2 rounded-full transition-colors",
            {
              'bg-blue-500': block.type === 'heading',
              'bg-green-500': block.type === 'text',
              'bg-yellow-500': block.type === 'list',
              'bg-purple-500': block.type === 'code',
              'bg-pink-500': block.type === 'image',
            }
          )} />
        </div>
        
        <div className="flex-1 min-w-0">
          {renderContent()}
        </div>
      </div>
      
      {/* Metadata footer */}
      <div className="mt-3 pt-2 border-t border-gray-100 text-xs text-gray-400 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="capitalize">{block.type} block</span>
        <time dateTime={block.updatedAt.toISOString()}>
          {new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }).format(new Date(block.updatedAt))}
        </time>
      </div>
    </motion.div>
  );
};

export default BlockRenderer;
