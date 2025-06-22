import { type FC, type ChangeEvent, type MouseEvent } from "react";

/**
 * Props for the LeftColumn component
 */
type LeftColumnProps = {
    youtubeLink: string;
    setYoutubeLink: (value: string) => void;
    prompt: string;
    setPrompt: (value: string) => void;
    errorMessage: string | null;
    loading: boolean;
    handleGenerateWithAI: () => Promise<void>;
};

/**
 * LeftColumn component for recipe input form
 */
export const LeftColumn: FC<LeftColumnProps> = ({
    youtubeLink,
    setYoutubeLink,
    prompt,
    setPrompt,
    errorMessage,
    loading,
    handleGenerateWithAI,
}) => {
    const handleYoutubeLinkChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setYoutubeLink(e.target.value);
    };

    const handlePromptChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
        setPrompt(e.target.value);
    };

    const handleSubmit = (e: MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        handleGenerateWithAI();
    };

    return (
        <div className="md:col-span-4 bg-[#f1ede1] border-[#dcd7c9] border p-6 rounded-lg shadow-md ml-4 md:ml-8">
            <h2 className="text-xl font-bold mb-6 text-[#9c4a1a] border-b pb-2 border-[#dcd7c9]">
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
                        onChange={handleYoutubeLinkChange}
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
                        onChange={handlePromptChange}
                        className="w-full p-3 border border-[#dcd7c9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#c17d56] focus:border-[#c17d56] bg-[#f8f5e6] transition"
                        rows={8}
                    />
                </div>

                <button
                    onClick={handleSubmit}
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
    );
};
