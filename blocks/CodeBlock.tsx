"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Editor } from "@monaco-editor/react";
import { Copy, Play, Download, Edit3, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  initialCode?: string;
  language?: string;
  editable?: boolean;
  onCodeChange?: (code: string) => void;
  onLanguageChange?: (language: string) => void;
  className?: string;
}

const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "json", label: "JSON" },
  { value: "markdown", label: "Markdown" },
  { value: "sql", label: "SQL" },
  { value: "bash", label: "Bash" },
];

export const CodeBlock: React.FC<CodeBlockProps> = ({
  initialCode = "",
  language = "javascript",
  editable = false,
  onCodeChange,
  onLanguageChange,
  className
}) => {
  const [code, setCode] = useState(initialCode);
  const [isEditing, setIsEditing] = useState(editable);
  const [copied, setCopied] = useState(false);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
      onCodeChange?.(value);
    }
  };

  const handleLanguageChange = (newLanguage: string) => {
    onLanguageChange?.(newLanguage);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${language}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const runCode = () => {
    // For demonstration - in a real app, you'd want a secure code execution environment
    if (language === 'javascript') {
      try {
        const result = eval(code);
        console.log('Code result:', result);
      } catch (error) {
        console.error('Code execution error:', error);
      }
    }
  };

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
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="text-sm text-gray-500">
            {code.split('\n').length} lines
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? <Save className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
          </Button>
          
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
            onClick={downloadCode}
          >
            <Download className="h-4 w-4" />
          </Button>
          
          {language === 'javascript' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={runCode}
            >
              <Play className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="relative">
        <Editor
          height="300px"
          language={language}
          value={code}
          onChange={handleCodeChange}
          onMount={handleEditorDidMount}
          options={{
            readOnly: !isEditing,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollbar: {
              horizontal: 'auto',
              vertical: 'auto'
            },
            theme: 'vs-light',
            automaticLayout: true,
            wordWrap: 'on',
            contextmenu: true,
            selectOnLineNumbers: true
          }}
        />
      </div>
      
      {/* Footer */}
      <div className="px-3 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
        {isEditing ? "Click save to finish editing" : "Click edit to modify code"}
      </div>
    </motion.div>
  );
};

export default CodeBlock;
