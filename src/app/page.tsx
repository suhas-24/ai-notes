export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <div className="animate-fade-in">
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-primary-900">
            AI Notes
          </h1>
          <p className="mb-8 text-xl text-primary-700">
            AI-powered, Gemini API-driven, next-gen Notion/Superlist-style note-taking app
          </p>
          <div className="space-y-4">
            <div className="rounded-lg bg-white/50 p-6 shadow-sm backdrop-blur-sm">
              <h2 className="mb-3 text-lg font-semibold text-primary-800">
                🚀 Project Setup Complete
              </h2>
              <p className="text-primary-600">
                Next.js 15 with TypeScript, TailwindCSS, and Gemini AI integration is ready!
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg bg-white/30 p-4 backdrop-blur-sm">
                <h3 className="font-semibold text-primary-800">⚡ Next.js 15</h3>
                <p className="text-sm text-primary-600">App directory structure</p>
              </div>
              <div className="rounded-lg bg-white/30 p-4 backdrop-blur-sm">
                <h3 className="font-semibold text-primary-800">🎨 TailwindCSS</h3>
                <p className="text-sm text-primary-600">Utility-first styling</p>
              </div>
              <div className="rounded-lg bg-white/30 p-4 backdrop-blur-sm">
                <h3 className="font-semibold text-primary-800">🤖 Gemini AI</h3>
                <p className="text-sm text-primary-600">Ready for integration</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
