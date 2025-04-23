import { NextRequest, NextResponse } from 'next/server';
import { OllamaEmbeddings } from "@langchain/ollama";
import { Chroma } from '@langchain/community/vectorstores/chroma';

interface QueryBody {
  collection?: string;
  query?: string;
  limit?: number;
}

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  try {
    // Initialize Chroma client properly
    const embeddings = new OllamaEmbeddings({ model: "nomic-embed-text" });
    
    // Import the ChromaClient directly to access native methods
    const { ChromaClient } = await import('chromadb');
    const client = new ChromaClient();
    
    // Get list of all collections using the native client
    const collections = await client.listCollections();
    
    return NextResponse.json({ 
      collections: collections.map((col) => col.name),
      message: "To query a specific collection, use POST with collection name and query"
    });
  } catch (error) {
    console.error("Error listing collections:", error);
    return NextResponse.json({ error: "Failed to list collections" }, { status: 500 });
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

  if (!collection) {
    return NextResponse.json(
      { error: "Collection name is required." },
      { status: 400 }
    );
  }

  try {
    const embeddings = new OllamaEmbeddings({ model: "nomic-embed-text" });
    
    // Connect to the specified collection
    const vectorStore = await Chroma.fromExistingCollection(
      embeddings,
      { collectionName: collection }
    );
    
    // Get collection info
    const count = await vectorStore.collectionSize();
    
    let results: any = { collectionName: collection, documentCount: count };
    
    // If a query is provided, perform a similarity search
    if (query) {
      const queryResults = await vectorStore.similaritySearch(query, limit);
      results.queryResults = queryResults.map(doc => ({
        content: doc.pageContent,
        metadata: doc.metadata
      }));
    } else {
      // Otherwise just get a sample of documents
      // This is specific to the Chroma implementation you're using
      // and might need adaptation
      const retriever = vectorStore.asRetriever({ k: limit });
      const sampleDocs = await retriever.invoke("sample documents");
      results.sampleDocuments = sampleDocs.map((doc: any) => ({
        content: doc.pageContent,
        metadata: doc.metadata
      }));
    }
    
    return NextResponse.json(results);
  } catch (error) {
    console.error("Error querying collection:", error);
    return NextResponse.json(
      { error: `Failed to query collection "${collection}": ${(error as Error).message}` }, 
      { status: 500 }
    );
  }
};