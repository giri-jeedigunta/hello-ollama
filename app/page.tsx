'use client'

import React, { useState, useCallback } from "react";
import { RecipeExtractionPrompt } from "./constants";
import { LeftColumn } from "./components/LeftColumn";
import { RightColumn } from "./components/RightColumn";
import { Footer } from "./components/Footer";

/**
 * Extracts content from within the body tags of an HTML string
 */
const extractBodyContent = (htmlString: string): string => {
  try {
    // If it doesn't contain <body> tags, return as is
    if (!htmlString.includes("<body")) {
      return htmlString;
    }

    const bodyMatch = htmlString.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    return bodyMatch?.[1]?.trim() ?? htmlString;
  } catch (error) {
    console.error("Error extracting body content:", error);
    return htmlString;
  }
};

const Home: React.FC = () => {
  const [youtubeLink, setYoutubeLink] = useState<string>("https://www.youtube.com/watch?v=m5wbKFcLrJQ");
  const [prompt, setPrompt] = useState<string>(RecipeExtractionPrompt.trim());
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

    try {
      const content = extractBodyContent(aiResponse);
      const filename = `recipe-${new Date().toISOString().slice(0, 10)}.md`;
      const blob = new Blob([content], { type: 'text/html' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();

      // Cleanup
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading recipe:", error);
      setErrorMessage("Failed to download recipe.");
    }
  }, [aiResponse]);

  return (
    <main className="min-h-screen p-4 md:p-8 flex flex-col">
      <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 flex-grow">
        {/* Left column - Form */}
        <LeftColumn
          youtubeLink={youtubeLink}
          setYoutubeLink={setYoutubeLink}
          prompt={prompt}
          setPrompt={setPrompt}
          errorMessage={errorMessage}
          loading={loading}
          handleGenerateWithAI={handleGenerateWithAI}
        />

        {/* Right column - Recipe Output */}
        <RightColumn
          aiResponse={aiResponse}
          loading={loading}
          downloadRecipe={downloadRecipe}
        />
      </div>

      <Footer />
    </main>
  );
};

export default Home;
