"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, Mic, MicOff, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNotesStore } from "@/store/notesStore";
import { cn } from "@/lib/utils";

interface PromptBarProps {
  onSubmit?: (prompt: string) => void;
  enableSpeech?: boolean;
}

// Speech-to-text hook
const useSpeechToText = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setIsSupported(true);
        recognitionRef.current = new SpeechRecognition();
        const recognition = recognitionRef.current;

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
          let finalTranscript = '';
          let interimTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          setTranscript(finalTranscript || interimTranscript);
        };

        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current && isSupported) {
      setTranscript("");
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isSupported) {
      setIsListening(false);
      recognitionRef.current.stop();
    }
  };

  const resetTranscript = () => {
    setTranscript("");
  };

  return {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    resetTranscript
  };
};

export const PromptBar: React.FC<PromptBarProps> = ({ 
  onSubmit, 
  enableSpeech = true 
}) => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { addBlock } = useNotesStore();
  const {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    resetTranscript
  } = useSpeechToText();

  // Update prompt when transcript changes
  useEffect(() => {
    if (transcript) {
      setPrompt(transcript);
    }
  }, [transcript]);

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
      
      if (data.blocks && Array.isArray(data.blocks)) {
        data.blocks.forEach((block: any) => {
          addBlock(block);
        });
      }

      setPrompt("");
      resetTranscript();
      onSubmit?.(prompt);
    } catch (error) {
      console.error("Error generating content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window && text.trim()) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
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
          
          {/* Speech-to-text button */}
          {enableSpeech && isSupported && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleMicClick}
              className={cn(
                "h-8 w-8 p-0",
                isListening && "text-red-500 bg-red-50"
              )}
              disabled={isLoading}
            >
              {isListening ? (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  <MicOff className="h-4 w-4" />
                </motion.div>
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
          )}
          
          {/* Text-to-speech button */}
          {prompt.trim() && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => speakText(prompt)}
              className="h-8 w-8 p-0"
              disabled={isLoading}
            >
              <Volume2 className="h-4 w-4" />
            </Button>
          )}
          
          <AnimatePresence mode="wait">
            <motion.div
              key={isLoading ? 'loading' : 'send'}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                type="submit"
                size="sm"
                className="h-8 w-8 p-0"
                disabled={!prompt.trim() || isLoading}
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
        
        {/* Status indicators */}
        <AnimatePresence>
          {isListening && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 text-sm text-red-600 flex items-center gap-2"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="w-2 h-2 bg-red-500 rounded-full"
              />
              Listening... Speak now
            </motion.div>
          )}
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 text-sm text-gray-500 flex items-center gap-2"
            >
              <Loader2 className="h-3 w-3 animate-spin" />
              AI is generating your content...
            </motion.div>
          )}
          
          {!isSupported && enableSpeech && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 text-xs text-gray-400"
            >
              Speech recognition not supported in this browser
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </motion.div>
  );
};

export default PromptBar;
