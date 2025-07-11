"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNotesStore } from "@/store/notesStore";

interface PromptBarProps {
  onSubmit?: (prompt: string) => void;
}

export const PromptBar: React.FC<PromptBarProps> = ({ onSubmit }) => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { addBlock } = useNotesStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate content");
      }

      const data = await response.json();
      
      data.blocks.forEach((block: any) => {
        addBlock(block);
      });

      setPrompt("");
      onSubmit?.(prompt);
    } catch (error) {
      console.error("Error generating content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto p-4"
    >
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex gap-2 items-center p-3 bg-white border border-gray-200 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask AI to help you with notes, ideas, or content..."
            className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
            disabled={isLoading}
          />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={isLoading ? "loading" : "idle"}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                type="submit"
                size="sm"
                disabled={!prompt.trim() || isLoading}
                className="h-8 w-8 p-0"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </motion.div>
          </AnimatePresence>
        </div>
        
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 text-sm text-gray-500 flex items-center gap-2"
            >
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>AI is generating your content...</span>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </motion.div>
  );
};

export default PromptBar;
