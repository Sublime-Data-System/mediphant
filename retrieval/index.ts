import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PineconeStore } from "@langchain/pinecone";
import { Document } from "@langchain/core/documents";
import * as fs from "fs";
import * as path from "path";
import "dotenv/config";

// Function to initialize Pinecone client
async function initPinecone() {
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  });
  return pinecone;
}

// Main indexing function
async function run() {
  console.log("Starting indexing process...");

  try {
    // 1. Initialize clients
    const pinecone = await initPinecone();
    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: "gemini-embedding-001",
      apiKey: process.env.GEMINI_API_KEY,
    });
    const pineconeIndexName = process.env.PINECONE_INDEX!;

    // 2. Check if index exists, create if not
    const existingIndexes = await pinecone.listIndexes();
    if (
      !existingIndexes.indexes?.some(
        (index) => index.name === pineconeIndexName,
      )
    ) {
      console.log(`Index "${pineconeIndexName}" does not exist. Creating...`);
      await pinecone.createIndex({
        name: pineconeIndexName,
        dimension: 3072,
        spec: {
          serverless: {
            cloud: "aws",
            region: "us-east-1",
          },
        },
      });
      console.log(
        "Index created successfully. Waiting for it to initialize...",
      );
      // Wait for index to be ready - in a real app, you'd poll the describeIndex endpoint
      await new Promise((resolve) => setTimeout(resolve, 60000));
    } else {
      console.log(`Index "${pineconeIndexName}" already exists.`);
    }

    const pineconeIndex = pinecone.Index(pineconeIndexName);

    // 3. Load and chunk the corpus
    const corpusPath = path.resolve(__dirname, "corpus.md");
    const corpus = fs.readFileSync(corpusPath, "utf8");

    // Simple chunking strategy: split by paragraph
    const chunks = corpus
      .split(/\n\s*\n/)
      .filter((chunk) => chunk.trim().length > 0);
    const documents = chunks.map(
      (chunk) => new Document({ pageContent: chunk }),
    );
    console.log(`Corpus loaded and split into ${documents.length} chunks.`);

    // 4. Embed and upsert documents into Pinecone
    console.log("Embedding documents and upserting to Pinecone...");
    await PineconeStore.fromDocuments(documents, embeddings, {
      pineconeIndex,
      maxConcurrency: 5, // Optional: limit concurrent requests
    });

    console.log("✅ Indexing complete! Your Pinecone index is ready.");
  } catch (error) {
    console.error("❌ An error occurred during indexing:", error);
    process.exit(1);
  }
}

run();
