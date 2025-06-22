# Hello Ollama / Chef GPT

This project is inspired by and built as a learning exercise from the following resources:

- [LangChain.js Quickstart Demo](https://github.com/Azure-Samples/langchainjs-quickstart-demo/tree/main)
- [YouTube Tutorial](https://www.youtube.com/watch?v=w7Q8pfHdkQ0&list=LL&index=3&t=3212s)

This project uses the local Ollama Phi4 model for AI-powered functionalities.

## Prerequisites

Before setting up this project, ensure you have the following:

1. **Ollama Setup**
   - Follow the installation guide at [Hello Ollama](https://wtfe.dev/posts/ai/hello-ollama/)
   - Make sure you have the Phi4 model installed (`ollama pull phi`)

2. **ChromaDB**
   - Run ChromaDB using Docker:
   ```bash
   docker run -d --name chroma-db -p 8000:8000 -v ~/dev/docker-drive/chroma-data:/chroma/chroma chromadb/chroma
   ```

3. **Node.js**
   - Latest version of Node.js
   - Basic knowledge of TypeScript and Next.js

## Local Setup

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd hello-ollama
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Walkthrough

For a detailed, step-by-step walkthrough of this proof of concept, refer to [Chef GPT](https://wtfe.dev/posts/ai/chef-gpt).

## Disclaimer

This project was vibe coded with GitHub Copilot, Claude Sonnet 3.7 agent. The code structure and implementation may reflect AI-assisted development patterns.

