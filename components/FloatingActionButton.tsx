"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Type, List, Code, ImageIcon, Heading1 } from "lucide-react";
import { useNotesStore } from "@/store/notesStore";
import { cn } from "@/lib/utils";

interface BlockType {
  id: string;
  type: "text" | "heading" | "list" | "code" | "image";
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const blockTypes: BlockType[] = [
  {
    id: "text",
    type: "text",
    label: "Text",
    icon: Type,
    description: "Basic text paragraph",
  },
  {
    id: "heading",
    type: "heading",
    label: "Heading",
    icon: Heading1,
    description: "Section heading",
  },
  {
    id: "list",
    type: "list",
    label: "List",
    icon: List,
    description: "Bulleted list",
  },
  {
    id: "code",
    type: "code",
    label: "Code",
    icon: Code,
    description: "Code block",
  },
  {
    id: "image",
    type: "image",
    label: "Image",
    icon: ImageIcon,
    description: "Image with caption",
  },
];

interface FloatingActionButtonProps {
  onAddBlock?: (type: BlockType["type"]) => void;
  className?: string;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onAddBlock,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { addBlock } = useNotesStore();

  const handleAddBlock = (type: BlockType["type"]) => {
    const defaultContent = {
      text: "Start typing...",
      heading: "New Heading",
      list: "• First item\n• Second item\n• Third item",
      code: "// Enter your code here",
      image: "https://via.placeholder.com/400x200",
    };

    const newBlock = {
      type,
      content: defaultContent[type],
      metadata: type === "heading" ? { level: 1 } : type === "code" ? { language: "javascript" } : undefined,
    };

    addBlock(newBlock);
    onAddBlock?.(type);
    setIsOpen(false);
  };

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className={cn("fixed bottom-8 right-8 z-50", className)}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="mb-4 space-y-2"
          >
            {blockTypes.map((blockType, index) => {
              const Icon = blockType.icon;
              return (
                <motion.button
                  key={blockType.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 24,
                    delay: index * 0.05,
                  }}
                  onClick={() => handleAddBlock(blockType.type)}
                  className={cn(
                    "flex items-center gap-3 w-full p-3 bg-white",
                    "border border-gray-200 rounded-lg shadow-lg",
                    "hover:shadow-xl hover:border-blue-300 hover:bg-blue-50",
                    "transition-all duration-200 group",
                    "min-w-48 text-left"
                  )}
                  title={`Add ${blockType.label}`}
                >
                  <div className="flex-shrink-0 p-2 bg-gray-100 rounded-md group-hover:bg-blue-100 transition-colors">
                    <Icon className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{blockType.label}</div>
                    <div className="text-xs text-gray-500">{blockType.description}</div>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB Button */}
      <motion.button
        onClick={toggleOpen}
        className={cn(
          "w-14 h-14 bg-blue-600 hover:bg-blue-700",
          "text-white rounded-full shadow-lg hover:shadow-xl",
          "flex items-center justify-center",
          "transition-all duration-200",
          "focus:outline-none focus:ring-4 focus:ring-blue-300"
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{ rotate: isOpen ? 45 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        title={isOpen ? "Close menu" : "Add new block"}
      >
        <Plus className="w-6 h-6" />
      </motion.button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/10 -z-10"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingActionButton;
