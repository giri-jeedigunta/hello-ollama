import { NextRequest, NextResponse } from 'next/server';
import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOllama, OllamaEmbeddings } from "@langchain/ollama";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { Chroma } from '@langchain/community/vectorstores/chroma';

interface RequestBody {
  youtubeLink: string;
  prompt: string;
}

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
    // Load documents
    console.log("Loading documents from YouTube link...");
    const loader = YoutubeLoader.createFromUrl(youtubeLink, {
      language: "en",
      addVideoInfo: true,
    });
    const rawDocuments = await loader.load();
    console.log("Documents loaded:", rawDocuments);

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1500,
      chunkOverlap: 200,
    });
    const documents = await splitter.splitDocuments(rawDocuments);
    console.log("Documents split into chunks:", documents);

    // Initialize models and DB
    console.log("Initializing embeddings and vector store...");
    const embeddings = new OllamaEmbeddings({ model: "nomic-embed-text" });
    const model = new ChatOllama({ model: "phi4" });
    // const vectorStore = new FaissStore(embeddings, {});
    const vectorStore = await Chroma.fromDocuments(
      documents,
      embeddings,
      { collectionName: "default" }
    );
    if (!vectorStore) {
      console.error("Failed to initialize vector store.");
      return NextResponse.json(
        { error: "Failed to initialize vector store." },
        { status: 500 }
      );
    }
    console.log("Embeddings and vector store initialized.", vectorStore);

    await vectorStore.addDocuments(documents);
    console.log("Documents added to vector store.");

    // Run the chain
    console.log("Creating question-answering chain...");
    const questionAnsweringPrompt = ChatPromptTemplate.fromMessages([
      ["system", "Answer the user's question using only the sources below:\n\n{context}"],
      ["human", "{input}"],
    ]);
    const retriever = vectorStore.asRetriever();
    const ragChain = await createStuffDocumentsChain({
      prompt: questionAnsweringPrompt,
      llm: model,
    });
    console.log("Chain created successfully.");

    const context = await retriever.invoke(prompt);
    console.log("Context retrieved:", context);

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
