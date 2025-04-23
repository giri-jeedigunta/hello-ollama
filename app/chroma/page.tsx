'use client'

import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

type Collection = string;
type QueryResult = {
    content: string;
    metadata: Record<string, any>;
};
type ChromaResponse = {
    collectionName: string;
    documentCount: number;
    queryResults?: QueryResult[];
    sampleDocuments?: QueryResult[];
};

const ChromaPage: React.FC = () => {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [selectedCollection, setSelectedCollection] = useState<string>("");
    const [query, setQuery] = useState<string>("");
    const [limit, setLimit] = useState<number>(5);
    const [results, setResults] = useState<ChromaResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch collections when the page loads
    useEffect(() => {
        const fetchCollections = async (): Promise<void> => {
            try {
                setLoading(true);
                const response = await fetch('/api/query-chroma');
                const data = await response.json();

                if (response.ok) {
                    setCollections(data.collections || []);
                } else {
                    setError(data.error || "Failed to fetch collections");
                }
            } catch (err) {
                setError("An error occurred while fetching collections");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCollections();
    }, []);

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();

        if (!selectedCollection) {
            setError("Please select a collection");
            return;
        }

        setError(null);
        setLoading(true);

        try {
            const response = await fetch('/api/query-chroma', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    collection: selectedCollection,
                    query: query.trim() || undefined, // Only send if not empty
                    limit
                })
            });

            const data = await response.json();

            if (response.ok) {
                setResults(data);
            } else {
                setError(data.error || "Failed to query collection");
            }
        } catch (err) {
            setError("An error occurred while querying the collection");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen p-8 bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800">
            <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Left column - Query Form */}
                <div className="md:col-span-4 bg-white shadow-md p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-6 text-emerald-600 border-b pb-2">
                        Query Database
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="collection" className="block text-sm font-medium text-gray-700 mb-1">
                                Collection
                            </label>
                            <select
                                id="collection"
                                value={selectedCollection}
                                onChange={(e) => setSelectedCollection(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                                disabled={loading || collections.length === 0}
                            >
                                <option value="">Select a collection</option>
                                {collections.map((collection) => (
                                    <option key={collection} value={collection}>
                                        {collection}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-1">
                                Query (optional)
                            </label>
                            <textarea
                                id="query"
                                placeholder="Enter your search query here"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                                rows={5}
                                disabled={loading}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Leave empty to retrieve sample documents
                            </p>
                        </div>

                        <div>
                            <label htmlFor="limit" className="block text-sm font-medium text-gray-700 mb-1">
                                Result Limit
                            </label>
                            <input
                                id="limit"
                                type="number"
                                min={1}
                                max={50}
                                value={limit}
                                onChange={(e) => setLimit(parseInt(e.target.value))}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                            disabled={loading || !selectedCollection}
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Processing...</span>
                                </div>
                            ) : (
                                "Query Database"
                            )}
                        </button>

                        {error && (
                            <div className="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-md border border-red-200 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                {error}
                            </div>
                        )}
                    </form>
                </div>

                {/* Right column - Results */}
                <div className="md:col-span-8 bg-gray-100 shadow-md p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-6 text-emerald-600 border-b pb-2">
                        Search Results
                    </h2>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="w-16 h-16 border-t-4 border-emerald-500 border-solid rounded-full animate-spin"></div>
                            <p className="mt-4 text-gray-600">Loading results...</p>
                        </div>
                    ) : results ? (
                        <div className="space-y-4">
                            <div className="bg-white rounded-lg p-4 shadow-sm">
                                <h3 className="text-lg font-semibold text-emerald-700">Collection Information</h3>
                                <p className="mt-2 text-gray-700">
                                    <span className="font-medium">Collection:</span> {results.collectionName}
                                </p>
                                <p className="text-gray-700">
                                    <span className="font-medium">Document Count:</span> {results.documentCount}
                                </p>
                            </div>

                            {(results.queryResults || results.sampleDocuments) && (
                                <div className="space-y-4 mt-4">
                                    <h3 className="text-lg font-semibold text-emerald-700">
                                        {query.trim() ? "Query Results" : "Sample Documents"}
                                    </h3>

                                    {(results.queryResults || results.sampleDocuments || []).map((result, index) => (
                                        <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                                            <div className="mb-2 pb-2 border-b border-gray-200">
                                                <h4 className="font-medium text-emerald-600">Document {index + 1}</h4>
                                            </div>
                                            <div className="prose prose-sm max-w-none">
                                                <ReactMarkdown key={`content-${index}`}>{result.content || 'No content available'}</ReactMarkdown>
                                            </div>
                                            {Object.keys(result.metadata).length > 0 && (
                                                <div className="mt-3 pt-3 border-t border-gray-200">
                                                    <h5 className="text-sm font-medium text-gray-700 mb-1">Metadata</h5>
                                                    <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                                                        {JSON.stringify(result.metadata, null, 2)}
                                                    </pre>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="text-center">Select a collection and run a query to see results</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default ChromaPage;