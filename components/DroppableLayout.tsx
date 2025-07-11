"use client";

import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";
import { motion, AnimatePresence } from "framer-motion";
import { useNotesStore } from "@/store/notesStore";
import { DraggableBlock } from "./DraggableBlock";
import { FloatingActionButton } from "./FloatingActionButton";
import { PromptBar } from "./PromptBar";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface DroppableLayoutProps {
  className?: string;
  children?: React.ReactNode;
}

export const DroppableLayout: React.FC<DroppableLayoutProps> = ({
  className,
  children,
}) => {
  const { blocks, reorderBlocks, selectBlock, selectedBlockId, deleteBlock } = useNotesStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggedBlock, setDraggedBlock] = useState<any>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Minimum distance to activate drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    
    const block = blocks.find((b) => b.id === active.id);
    setDraggedBlock(block);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = blocks.findIndex((block) => block.id === active.id);
      const newIndex = blocks.findIndex((block) => block.id === over?.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        reorderBlocks(oldIndex, newIndex);
      }
    }

    setActiveId(null);
    setDraggedBlock(null);
  };

  const handleBlockSelect = (id: string) => {
    selectBlock(selectedBlockId === id ? null : id);
  };

  const handleBlockDelete = (id: string) => {
    deleteBlock(id);
  };

  const handleBlockEdit = (id: string) => {
    // TODO: Implement edit functionality
    console.log("Edit block:", id);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
    <div className={cn("min-h-screen bg-gray-50", className)}>
      {/* Header with PromptBar */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <PromptBar />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
          >
            <SortableContext
              items={blocks.map((block) => block.id)}
              strategy={verticalListSortingStrategy}
            >
              <motion.div
                className="space-y-4 pl-8 relative"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <AnimatePresence mode="popLayout">
                  {blocks.length === 0 ? (
                    <motion.div
                      key="empty-state"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="text-center py-12"
                    >
                      <div className="text-gray-400 text-lg mb-2">
                        📝 Your canvas awaits
                      </div>
                      <p className="text-gray-500 text-sm">
                        Click the + button to add your first block, or use the prompt bar above
                      </p>
                    </motion.div>
                  ) : (
                    blocks.map((block, index) => (
                      <motion.div
                        key={block.id}
                        variants={itemVariants}
                        layout
                        className="relative"
                      >
                        <DraggableBlock
                          block={block}
                          index={index}
                          isSelected={selectedBlockId === block.id}
                          onSelect={handleBlockSelect}
                          onDelete={handleBlockDelete}
                          onEdit={handleBlockEdit}
                          isDragging={activeId === block.id}
                        />
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </motion.div>
            </SortableContext>

            {/* Drag Overlay */}
            <DragOverlay adjustScale={false}>
              {draggedBlock && (
                <div className="rotate-3 opacity-90">
                  <DraggableBlock
                    block={draggedBlock}
                    index={0}
                    isSelected={false}
                    isDragging={true}
                  />
                </div>
              )}
            </DragOverlay>
          </DndContext>

          {/* Additional children content */}
          {children}
        </div>

        {/* Floating Action Button */}
        <FloatingActionButton
          onAddBlock={(type) => {
            console.log("Adding block of type:", type);
          }}
        />
      </main>

      {/* Responsive Grid Background Pattern */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30" />
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        />
      </div>
    </div>
  );
};

export default DroppableLayout;
