import { NextRequest, NextResponse } from 'next/server';
import { OllamaEmbeddings } from "@langchain/ollama";
import { Chroma } from '@langchain/community/vectorstores/chroma';
import { DocumentInterface } from '@langchain/core/documents';

interface QueryBody {
  collection?: string;
  query?: string;
  limit?: number;
}

interface DocumentMetadata {
  [key: string]: string | number | boolean | null | DocumentMetadata;
}

interface QueryResult {
  collectionName: string;
  documentCount: number | undefined;
  queryResults?: {
    content: string;
    metadata: DocumentMetadata;
  }[];
  sampleDocuments?: {
    content: string;
    metadata: DocumentMetadata;
  }[];
}

// Define the ChromaCollection interface based on the actual structure
interface ChromaCollection {
  name: string;
  id: string;
  [key: string]: unknown;
}

export const GET = async (): Promise<NextResponse> => {
  try {
    // Import the ChromaClient directly to access native methods
    const { ChromaClient } = await import('chromadb');
    
    // Default ChromaDB URL if not specified in env
    const chromaUrl = process.env.CHROMADB_URL || 'http://localhost:8000';
    console.log("Connecting to ChromaDB at:", chromaUrl);
    
    const client = new ChromaClient({ path: chromaUrl });
    
    console.log("Attempting to fetch collections from ChromaDB...");
    
    // Get list of all collections using the native client
    const collections = await client.listCollections();
    
    console.log("Retrieved collections from ChromaDB:", JSON.stringify(collections));
    
    // Return the full collection objects directly
    return NextResponse.json({ 
      collections,
      message: "To query a specific collection, use POST with collection name and query"
    });
  } catch (error) {
    console.error("Error listing collections:", error);
    // More detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';
    console.error("Error details:", { message: errorMessage, stack: errorStack });
    
    return NextResponse.json({ 
      error: "Failed to list collections", 
      details: errorMessage,
      hint: "Make sure ChromaDB is running and accessible"
    }, { status: 500 });
  }
};

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  let body: QueryBody;

  try {
    body = await req.json();
  } catch (error) {
    console.log("Error parsing request body:", error);
    return NextResponse.json({ error: "Invalid JSON in request body." }, { status: 400 });
  }

  const { collection, query, limit = 5 } = body;
  console.log("POST request with params:", { collection, query, limit });

  if (!collection) {
    return NextResponse.json(
      { error: "Collection name is required." },
      { status: 400 }
    );
  }

  try {
    const embeddings = new OllamaEmbeddings({ model: "nomic-embed-text" });
    
    // Default ChromaDB URL if not specified in env
    const chromaUrl = process.env.CHROMADB_URL || 'http://localhost:8000';
    console.log("Connecting to ChromaDB at:", chromaUrl);
    
    // Connect to the specified collection
    console.log(`Attempting to connect to collection: ${collection}`);
    const vectorStore = await Chroma.fromExistingCollection(
      embeddings,
      { collectionName: collection, url: chromaUrl }
    );
    
    // Get collection info using the collection.count() method
    const count = await vectorStore.collection?.count();
    console.log(`Collection ${collection} contains ${count} documents`);
    
    const results: QueryResult = { collectionName: collection, documentCount: count };
    
    // If a query is provided, perform a similarity search
    if (query) {
      console.log(`Performing similarity search with query: "${query}", limit: ${limit}`);
      const queryResults = await vectorStore.similaritySearch(query, limit);
      console.log(`Search returned ${queryResults.length} results`);
      results.queryResults = queryResults.map(doc => ({
        content: doc.pageContent,
        metadata: doc.metadata as DocumentMetadata
      }));
    } else {
      console.log(`Retrieving ${limit} sample documents from collection`);
      // Otherwise just get a sample of documents
      const retriever = vectorStore.asRetriever({ k: limit });
      const sampleDocs = await retriever.invoke("sample documents");
      console.log(`Retrieved ${sampleDocs.length} sample documents`);
      results.sampleDocuments = sampleDocs.map((doc: DocumentInterface) => ({
        content: doc.pageContent,
        metadata: doc.metadata as DocumentMetadata
      }));
    }
    
    return NextResponse.json(results);
  } catch (error) {
    console.error("Error querying collection:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';
    console.error("Error details:", { message: errorMessage, stack: errorStack });
    
    return NextResponse.json(
      { 
        error: `Failed to query collection "${collection}"`, 
        details: errorMessage,
        hint: "Make sure ChromaDB is running and the collection exists"
      }, 
      { status: 500 }
    );
  }
};