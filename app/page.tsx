'use client'

import React, { useState, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from 'rehype-raw';

const Home: React.FC = () => {
  const [youtubeLink, setYoutubeLink] = useState<string>("https://www.youtube.com/watch?v=c5LqYrs3ads");
  const [prompt, setPrompt] = useState<string>("Get the recipe from the video with all the steps");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleGenerateWithAI = async (): Promise<void> => {
    if (!youtubeLink.trim() || !prompt.trim()) {
      setErrorMessage("Both fields are required.");
      return;
    }

    setErrorMessage(null);
    setLoading(true);
    setAiResponse(null); // Clear existing recipe when generating a new one

    try {
      const response = await fetch("http://localhost:3000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ youtubeLink, prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.error || "Something went wrong.");
        setLoading(false);
        return;
      }

      const data = await response.json();
      setAiResponse(data.response);
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Failed to generate AI response.");
    } finally {
      setLoading(false);
    }
  };

  const downloadRecipe = useCallback((): void => {
    if (!aiResponse) return;

    const filename = `recipe-${new Date().toISOString().slice(0, 10)}.md`;
    const blob = new Blob([aiResponse], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [aiResponse]);

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left column - Form - 4 columns */}
        <div className="md:col-span-4 bg-[#f1ede1] border-[#dcd7c9] border p-6 rounded-lg shadow-md ml-4 md:ml-8">
          <h2 className="text-xl font-caveat font-bold mb-6 text-[#9c4a1a] border-b pb-2 border-[#dcd7c9]">
            Recipe Lab
          </h2>

          <div className="space-y-5">
            <div>
              <label htmlFor="youtube-link" className="block text-sm font-medium text-[#5a3e2b] mb-1">
                YouTube Link
              </label>
              <input
                id="youtube-link"
                type="url"
                placeholder="Enter YouTube link"
                value={youtubeLink}
                onChange={(e) => setYoutubeLink(e.target.value)}
                className="w-full p-3 border border-[#dcd7c9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#c17d56] focus:border-[#c17d56] bg-[#f8f5e6] transition"
              />
            </div>

            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-[#5a3e2b] mb-1">
                Prompt
              </label>
              <textarea
                id="prompt"
                placeholder="Enter your prompt here"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full p-3 border border-[#dcd7c9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#c17d56] focus:border-[#c17d56] bg-[#f8f5e6] transition"
                rows={8}
              />
            </div>

            <button
              onClick={handleGenerateWithAI}
              className="w-full py-3 bg-[#9c4a1a] text-[#f8f5e6] rounded-md hover:bg-[#7a3a14] focus:outline-none focus:ring-2 focus:ring-[#c17d56] focus:ring-offset-2 transition transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Cooking...</span>
                </div>
              ) : (
                "Create Recipe"
              )}
            </button>

            {errorMessage && (
              <div className="text-[#9c4a1a] text-sm font-medium bg-[#f8efe6] p-3 rounded-md border border-[#c17d56] flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {errorMessage}
              </div>
            )}
          </div>
        </div>

        {/* Right column - Recipe Output - 8 columns */}
        <div className="md:col-span-8 border-[#dcd7c9] border p-6 rounded-lg shadow-md bg-[#f1ede1]">
          <div className="flex justify-between items-center mb-4 border-b pb-2 border-[#dcd7c9]">
            <h2 className="text-xl font-caveat font-bold text-[#9c4a1a]">
              Recipe Notebook
            </h2>
            {aiResponse && (
              <button
                onClick={downloadRecipe}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-[#9c4a1a] bg-[#f1ede1] hover:bg-[#e5dfd0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c17d56] transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Save Recipe
              </button>
            )}
          </div>

          <div className="h-[calc(100vh-14rem)] overflow-y-auto px-2">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="w-16 h-16 border-t-4 border-[#9c4a1a] border-solid rounded-full animate-spin"></div>
                <p className="mt-4 text-[#9c4a1a] font-caveat text-xl">Simmering your recipe...</p>
              </div>
            ) : aiResponse ? (
              <div className="markdown-content prose prose-stone max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                  {aiResponse}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-[#5a3e2b]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3 text-[#c17d56]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-center font-caveat text-xl">Your culinary masterpiece will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
