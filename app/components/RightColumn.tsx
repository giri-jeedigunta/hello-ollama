import { type FC } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

/**
 * Props for the RightColumn component
 */
type RightColumnProps = {
    aiResponse: string | null;
    loading: boolean;
    downloadRecipe: () => void;
};

/**
 * RightColumn component for displaying recipe output
 */
export const RightColumn: FC<RightColumnProps> = ({
    aiResponse,
    loading,
    downloadRecipe,
}) => {
    return (
        <div className="md:col-span-8 border-[#dcd7c9] border p-6 rounded-lg shadow-md bg-[#f1ede1]">
            <div className="flex justify-between items-center mb-4 border-b pb-2 border-[#dcd7c9]">
                <h2 className="text-xl font-bold text-[#9c4a1a]">
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
                        <p className="mt-4 text-[#9c4a1a] text-xl">Simmering your recipe...</p>
                    </div>
                ) : aiResponse ? (
                    <article className="prose prose-slate max-w-none 
                        prose-headings:text-[#9c4a1a] prose-headings:mt-6 prose-headings:mb-4
                        prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-2
                        prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 
                        prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                        prose-p:my-4 prose-p:leading-relaxed
                        prose-a:text-[#c17d56] prose-a:no-underline prose-a:border-b prose-a:border-[#c17d56] hover:prose-a:bg-[#f7f5ef]
                        prose-strong:text-[#5a3e2b] prose-strong:font-bold
                        prose-hr:border-[#dcd7c9] prose-hr:my-8
                        prose-ol:my-6 prose-ol:pl-6 prose-ol:space-y-2
                        prose-ul:my-6 prose-ul:pl-6 prose-ul:space-y-2
                        prose-li:my-2 prose-li:marker:text-[#9c4a1a]
                        prose-blockquote:border-l-4 prose-blockquote:border-l-[#c17d56] prose-blockquote:bg-[#f7f5ef] prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:my-6 prose-blockquote:italic
                        prose-img:rounded-lg prose-img:my-8
                        prose-code:text-[#9c4a1a] prose-code:bg-[#f7f5ef] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                        prose-pre:bg-[#f7f5ef] prose-pre:border prose-pre:border-[#dcd7c9] prose-pre:p-4 prose-pre:my-6 prose-pre:rounded-lg
                        prose-table:border-separate prose-table:border-spacing-0 prose-table:overflow-hidden">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw]}
                            components={{
                                // Add extra spacing between list items
                                li: ({ ...props }) => <li className="mb-2" {...props} />,
                                // Ensure proper spacing for tables with subtle borders
                                table: ({ ...props }) => <table className="my-8 border-collapse w-full shadow-sm rounded-lg overflow-hidden" {...props} />,
                                th: ({ ...props }) => <th className="border border-[#e6e0d1] bg-[#f7f5ef] p-3 text-[#9c4a1a] font-semibold text-left" {...props} />,
                                td: ({ ...props }) => <td className="border border-[#e6e0d1] p-3 align-top" {...props} />,
                                // Support for translation flags
                                p: ({ ...props }) => {
                                    // Check if text starts with a country flag emoji pattern
                                    const children = props.children;
                                    const childrenArray = Array.isArray(children) ? children : [children];

                                    // Check if first child is a string and starts with a flag emoji (Unicode range for flags)
                                    const firstChild = childrenArray[0];
                                    const flagRegex = /^[\uD83C][\uDDE6-\uDDFF][\uD83C][\uDDE6-\uDDFF]/;

                                    if (typeof firstChild === 'string' && flagRegex.test(firstChild)) {
                                        // If it has a flag, add special styling
                                        return (
                                            <p className="my-4 leading-relaxed bg-[#f7f5ef] p-3 rounded-lg border-l-4 border-[#c17d56]" {...props} />
                                        );
                                    }

                                    // Otherwise return normal paragraph
                                    return <p className="my-4 leading-relaxed" {...props} />;
                                }
                            }}
                        >
                            {aiResponse}
                        </ReactMarkdown>
                    </article>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-[#5a3e2b]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3 text-[#c17d56]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-center text-xl">Your culinary masterpiece will appear here</p>
                    </div>
                )}
            </div>
        </div>
    );
};
