# 🤖 AI Notes

[![Next.js](https://img.shields.io/badge/Next.js-14.0-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Gemini API](https://img.shields.io/badge/Gemini%20API-2.5%20Flash-orange?logo=google&logoColor=white)](https://ai.google.dev/)
[![Vercel](https://img.shields.io/badge/Vercel-Ready-black?logo=vercel&logoColor=white)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> AI-powered, Gemini API-driven, next-gen Notion/Superlist-style note-taking app with speech-to-text, drag-and-drop, and real-time AI summarization.

## ✨ Features

- 🎯 **AI-Powered Summarization** - Powered by Google's Gemini 2.5 Flash API
- 🗣️ **Speech-to-Text** - Web Speech API integration for voice notes
- 🎙️ **Text-to-Speech** - AI-generated content read aloud
- 🎨 **Drag & Drop Interface** - Intuitive block-based note organization
- 📱 **Responsive Design** - Mobile-first, works on all devices
- 📝 **Markdown Support** - Live preview and editing
- 🔄 **Real-time Updates** - Instant synchronization with Zustand state management
- 🎨 **Modern UI** - Clean, minimal design with Tailwind CSS

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0+ 
- npm, yarn, or pnpm
- Google Gemini API key

### 1. Clone the Repository

```bash
git clone https://github.com/suhas-24/ai-notes.git
cd ai-notes
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Get Your Gemini API Key

1. Visit [Google AI Studio](https://ai.google.dev/)
2. Click "Get API Key"
3. Create a new project or select existing
4. Generate API key for Gemini 2.5 Flash
5. Copy the key to your `.env.local` file

### 5. Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
ai-notes/
├── api/                    # API routes
│   └── gemini/            # Gemini API integration
├── blocks/                # Note block components
│   └── MarkdownBlock/     # Markdown block with AI features
├── components/            # Reusable UI components
│   ├── PromptBar/         # AI prompt input with speech features
│   ├── NoteEditor/        # Main note editing interface
│   └── ui/                # Base UI components
├── lib/                   # Utility functions
│   ├── gemini.ts          # Gemini API client
│   └── utils.ts           # Helper functions
├── src/app/               # Next.js app directory
│   ├── page.tsx           # Home page
│   └── layout.tsx         # Root layout
├── store/                 # Zustand state management
│   └── notesStore.ts      # Notes state store
└── types/                 # TypeScript type definitions
```

## 🔧 Core Technologies

### Frontend Stack
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - Lightweight state management
- **Framer Motion** - Animation library

### AI & APIs
- **Google Gemini 2.5 Flash** - AI text generation and summarization
- **Web Speech API** - Browser-native speech recognition
- **Speech Synthesis API** - Text-to-speech functionality

### Key Dependencies
```json
{
  "@google/generative-ai": "^0.21.0",
  "zustand": "^4.4.7",
  "framer-motion": "^10.16.16",
  "react-markdown": "^9.0.1",
  "lucide-react": "^0.294.0"
}
```

## 🤖 Gemini 2.5 Flash API Integration

### API Configuration

The Gemini API is configured in `lib/gemini.ts`:

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

export async function generateSummary(text: string) {
  const result = await model.generateContent([
    'Summarize this text concisely:',
    text
  ]);
  return result.response.text();
}
```

### API Response Format

The API returns structured responses:

```typescript
interface GeminiResponse {
  text: string;           // Generated content
  finishReason: string;   // Completion status
  safetyRatings: Array<{  // Content safety ratings
    category: string;
    probability: string;
  }>;
}
```

### Usage Examples

```typescript
// Summarize note content
const summary = await fetch('/api/gemini/summarize', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: noteContent })
});

// Generate content from prompt
const response = await fetch('/api/gemini/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt: userPrompt })
});
```

## 🎨 UI Components Overview

### PromptBar (`components/PromptBar/`)
- Speech-to-text input
- AI prompt processing
- Text-to-speech output
- Responsive design

### NoteEditor (`components/NoteEditor/`)
- Drag-and-drop interface
- Block-based editing
- Real-time preview
- AI integration

### MarkdownBlock (`blocks/MarkdownBlock/`)
- Live markdown preview
- AI summarization
- Syntax highlighting
- Export functionality

## 🎯 Key Features Walkthrough

### 1. Creating Notes
1. Click the floating action button (+)
2. Choose note type (text, markdown, etc.)
3. Start typing or use voice input
4. AI automatically suggests improvements

### 2. AI Summarization
1. Select text content
2. Click "Summarize with AI" button
3. Gemini 2.5 Flash generates concise summary
4. Summary appears in dedicated block

### 3. Speech Features
1. **Voice Input**: Click microphone icon in prompt bar
2. **Text-to-Speech**: Click speaker icon on any text block
3. **Voice Commands**: Say "summarize" or "expand" for AI actions

### 4. Drag & Drop
1. Hover over note blocks to see drag handles
2. Drag blocks to reorder
3. Drop zones highlight during drag
4. Changes save automatically

## 🚀 Deployment Guide

### Deploy to Vercel (Recommended)

1. **Connect Repository**
   ```bash
   npx vercel
   ```

2. **Set Environment Variables**
   - Go to Vercel Dashboard
   - Select your project
   - Settings → Environment Variables
   - Add `GEMINI_API_KEY`

3. **Deploy**
   ```bash
   git push origin main
   ```
   Auto-deploys on every push to main branch.

### Alternative Deployment Options

#### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

#### Netlify
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "out"

[build.environment]
  GEMINI_API_KEY = "your_key_here"
```

## 🔗 API Endpoints

| Endpoint | Method | Description |
|----------|--------|--------------|
| `/api/gemini/summarize` | POST | Summarize text content |
| `/api/gemini/generate` | POST | Generate content from prompt |
| `/api/notes` | GET | Fetch all notes |
| `/api/notes` | POST | Create new note |
| `/api/notes/[id]` | PUT | Update note |
| `/api/notes/[id]` | DELETE | Delete note |

## 🛠️ Development

### Code Structure

```typescript
// Store management (store/notesStore.ts)
interface NotesStore {
  notes: Note[];
  addNote: (note: Note) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
}

// Component structure
export default function NoteEditor() {
  const { notes, addNote } = useNotesStore();
  // Component logic...
}
```

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
npm run type-check # Run TypeScript checks
```

### Environment Variables

```env
# Required
GEMINI_API_KEY=your_gemini_api_key

# Optional
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Google Gemini API](https://ai.google.dev/) for AI capabilities
- [Next.js](https://nextjs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Zustand](https://github.com/pmndrs/zustand) for state management
- [Vercel](https://vercel.com/) for deployment platform

## 📞 Support

For support, email [your-email@example.com](mailto:your-email@example.com) or create an issue on GitHub.

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/suhas-24">suhas-24</a></p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>
