'use client'

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // For GitHub-flavored Markdown (optional)

const Home: React.FC = () => {
  const [youtubeLink, setYoutubeLink] = useState<string>("https://www.youtube.com/watch?v=c5LqYrs3ads");
  const [prompt, setPrompt] = useState<string>("Get the recipe and ingredients from the video");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleGenerateWithAI = async (): Promise<void> => {
    if (!youtubeLink.trim() || !prompt.trim()) {
      setErrorMessage("Both fields are required.");
      return;
    }

    setErrorMessage(null); // Clear any previous error messages
    setLoading(true);

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

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 p-4 md:p-8">
      <section className="max-w-3xl mx-auto space-y-6">
        <header>
          <h1 className="text-2xl md:text-4xl font-bold text-center">Recipes with AI</h1>
        </header>

        <div className="space-y-4">
          <label htmlFor="youtube-link" className="block text-lg font-bold">
            YouTube Link
          </label>
          <input
            id="youtube-link"
            type="url"
            placeholder="Enter YouTube link"
            value={youtubeLink}
            onChange={(e) => setYoutubeLink(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-4">
          <label htmlFor="prompt" className="block text-lg font-bold">
            Prompt
          </label>
          <textarea
            id="prompt"
            placeholder="Enter your prompt here"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
          <button
            onClick={handleGenerateWithAI}
            className="w-full md:w-auto px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate with AI"}
          </button>
        </div>

        {errorMessage && (
          <div className="text-red-600 text-sm font-medium">
            {errorMessage}
          </div>
        )}

        {aiResponse && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">AI Response</h2>
            <div className="p-4 bg-gray-100 border border-gray-300 rounded-md">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{aiResponse || ""}</ReactMarkdown>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default Home;
