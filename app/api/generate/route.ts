import { NextRequest, NextResponse } from 'next/server';
import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOllama, OllamaEmbeddings } from "@langchain/ollama";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { Chroma } from '@langchain/community/vectorstores/chroma';

/**
 * Interface defining the expected request body structure
 */
interface RequestBody {
  youtubeLink: string;
  prompt: string;
}

// Helper function to extract YouTube video ID
/**
 * Extracts the YouTube video ID from various YouTube URL formats
 * 
 * @param {string} url - The YouTube URL to extract the video ID from
 * @returns {string} The extracted video ID or empty string if not found
 */
const extractYoutubeVideoId = (url: string): string => {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match?.[1] || '';
};

// Helper function to check if video already exists in ChromaDB
/**
 * Checks if a YouTube video already exists in ChromaDB
 *
 * @param {string} videoId - The YouTube video ID to check
 * @param {OllamaEmbeddings} embeddings - The embeddings instance to use for DB connection
 * @returns {Promise<Chroma | null>} The vector store if found, null otherwise
 */
const videoExistsInChromaDB = async (
  videoId: string, 
  embeddings: OllamaEmbeddings
): Promise<Chroma | null> => {
  try {
    // Try to connect to an existing collection with this video ID
    const collection = `youtube_${videoId}`;
    const vectorStore = await Chroma.fromExistingCollection(
      embeddings,
      { collectionName: collection }
    );
    
    // Check if the collection exists by getting a count of items
    if (vectorStore.collection) {
      const count = await vectorStore.collection.count();
      if (count > 0) {
        console.log(`Found existing collection '${collection}' with ${count} documents`);
        return vectorStore;
      }
    }
    return null;
  } catch (error) {
    console.log("Collection doesn't exist or other error:", error);
    return null;
  }
};

/**
 * POST API route handler for generating responses based on YouTube content
 * 
 * Processes a request containing a YouTube link and prompt, then:
 * 1. Extracts YouTube video content
 * 2. Stores content in ChromaDB if not already present
 * 3. Uses LLM to generate a response based on the content and prompt
 * 
 * @param {NextRequest} req - The incoming request object
 * @returns {Promise<NextResponse>} JSON response with generated content or error
 */
export const POST = async (req: NextRequest): Promise<NextResponse> => {
  console.log("Incoming request:", { method: req.method });

  let body: RequestBody;

  try {
    body = await req.json();
  } catch (error) {
    console.log("Error parsing request body:", error);
    return NextResponse.json({ error: "Invalid JSON in request body." }, { status: 400 });
  }

  const { youtubeLink, prompt } = body;

  if (!youtubeLink || !prompt) {
    console.log("Validation failed: Missing youtubeLink or prompt");
    return NextResponse.json(
      { error: "Both youtubeLink and prompt are required." },
      { status: 400 }
    );
  }

  try {
    // Extract YouTube video ID
    const videoId = extractYoutubeVideoId(youtubeLink);
    if (!videoId) {
      return NextResponse.json(
        { error: "Invalid YouTube URL." },
        { status: 400 }
      );
    }
    
    // Initialize embeddings
    console.log("Initializing embeddings...");
    const embeddings = new OllamaEmbeddings({ model: "nomic-embed-text" });
    const model = new ChatOllama({ model: "phi4" });
    
    // Check if video already exists in ChromaDB
    let vectorStore = await videoExistsInChromaDB(videoId, embeddings);
    
    // If video doesn't exist in ChromaDB, process it
    if (!vectorStore) {
      console.log("Video not found in ChromaDB. Processing YouTube content...");
      
      try {
        // Load documents
        console.log("Loading documents from YouTube link...");
        const loader = YoutubeLoader.createFromUrl(youtubeLink, {
          language: "en",
          addVideoInfo: true,
        });
        const rawDocuments = await loader.load();
        console.log("Documents loaded:", rawDocuments);
        console.log("Documents loaded:");

        if (!rawDocuments || rawDocuments.length === 0) {
          console.error("Failed to load documents from YouTube");
          return NextResponse.json(
            { error: "Failed to extract content from YouTube video. Please try a different video." },
            { status: 400 }
          );
        }

        const splitter = new RecursiveCharacterTextSplitter({
          chunkSize: 1500,
          chunkOverlap: 200,
        });
        const documents = await splitter.splitDocuments(rawDocuments);
        console.log("Documents split into chunks:", documents);

        // Initialize vector store with video ID as collection name
        console.log("Creating new vector store...");
        vectorStore = await Chroma.fromDocuments(
          documents,
          embeddings,
          { collectionName: `youtube_${videoId}` }
        );

        if (!vectorStore) {
          console.error("Failed to initialize vector store.");
          return NextResponse.json(
            { error: "Failed to initialize vector store." },
            { status: 500 }
          );
        }
        console.log("Embeddings and vector store initialized.");
      } catch (youtubeError) {
        console.error("Error processing YouTube content:", youtubeError);
        return NextResponse.json(
          { error: "Failed to process YouTube video. This may be due to video restrictions or changes in YouTube's interface. Please try a different video." },
          { status: 400 }
        );
      }
    } else {
      console.log("Using existing vector store for this YouTube video.");
    }

    // Run the chain
    console.log("Creating question-answering chain...");
    const questionAnsweringPrompt = ChatPromptTemplate.fromMessages([
      ["system", "Answer the user's question using only the sources below:\n\n{context}, Provide the recipe in Markdown format"],
      ["human", "{input}"],
    ]);
    const retriever = vectorStore.asRetriever();
    const ragChain = await createStuffDocumentsChain({
      prompt: questionAnsweringPrompt,
      llm: model,
    });
    console.log("Chain created successfully.");

    const context = await retriever.invoke(prompt);
    // console.log("Context retrieved:", context);
    console.log("Context retrieved:");

    const stream = await ragChain.stream({ input: prompt, context });
    console.log("Streaming response...");

    let response = "";
    for await (const chunk of stream) {
      response += chunk ?? "";
    }
    console.log("Response generated:", response);

    return NextResponse.json({ response }); // Corrected the response method
  } catch (error) {
    console.error("Error generating response:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};
