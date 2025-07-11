"use client";

import React, { useState, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { Eye, Edit3, Save, Copy, Download, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface MarkdownBlockProps {
  initialContent?: string;
  editable?: boolean;
  onContentChange?: (content: string) => void;
  onSummarize?: (content: string) => void;
  className?: string;
}

// Simple markdown parser for basic formatting
const parseMarkdown = (text: string): string => {
  return text
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mb-2 text-gray-800">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mb-3 text-gray-800">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4 text-gray-900">$1</h1>')
    
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    
    // Italic
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    
    // Code inline
    .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
    
    // Code blocks
    .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4"><code class="text-sm font-mono">$1</code></pre>')
    
    // Links
    .replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>')
    
    // Lists
    .replace(/^\s*\* (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/^\s*- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    
    // Line breaks
    .replace(/\n/g, '<br />');
};

export const MarkdownBlock: React.FC<MarkdownBlockProps> = ({
  initialContent = "",
  editable = true,
  onContentChange,
  onSummarize,
  className
}) => {
  const [content, setContent] = useState(initialContent);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const renderedMarkdown = useMemo(() => {
    return parseMarkdown(content);
  }, [content]);

  const handleContentChange = (value: string) => {
    setContent(value);
    onContentChange?.(value);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy content:', err);
    }
  };

  const downloadMarkdown = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSummarize = () => {
    if (content.trim()) {
      onSummarize?.(content);
    }
  };

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  React.useEffect(() => {
    adjustTextareaHeight();
  }, [content]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Markdown</span>
          <div className="text-xs text-gray-500">
            {content.length} characters
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onSummarize && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSummarize}
              disabled={!content.trim()}
            >
              <Sparkles className="h-4 w-4" />
              <span className="ml-1">AI Summary</span>
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
          >
            <Copy className="h-4 w-4" />
            {copied && <span className="ml-1 text-xs">Copied!</span>}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={downloadMarkdown}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "edit" | "preview")}>
        <TabsList className="w-full rounded-none border-b">
          <TabsTrigger value="edit" className="flex items-center gap-2">
            <Edit3 className="h-4 w-4" />
            Edit
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="m-0">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => {
                handleContentChange(e.target.value);
                adjustTextareaHeight();
              }}
              placeholder="Type your markdown here...\n\n# Heading 1\n## Heading 2\n\n**Bold text**\n*Italic text*\n\n- List item\n- Another item\n\n```\nCode block\n```\n\n[Link](https://example.com)"
              className="w-full min-h-[300px] p-4 resize-none border-0 focus:outline-none focus:ring-0 font-mono text-sm leading-relaxed"
              style={{ overflow: 'hidden' }}
              readOnly={!editable}
            />
          </div>
        </TabsContent>

        <TabsContent value="preview" className="m-0">
          <div className="min-h-[300px] p-4">
            {content.trim() ? (
              <div 
                className="prose prose-sm max-w-none leading-relaxed"
                dangerouslySetInnerHTML={{ __html: renderedMarkdown }}
              />
            ) : (
              <div className="text-gray-500 italic text-center py-12">
                Nothing to preview yet. Switch to Edit mode to add content.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Footer */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex justify-between items-center">
        <span>
          {activeTab === "edit" ? "Markdown editor" : "Live preview"}
        </span>
        <span>
          {content.split('\n').length} lines
        </span>
      </div>
    </motion.div>
  );
};

export default MarkdownBlock;
