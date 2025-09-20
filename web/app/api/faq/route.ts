import { NextRequest, NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import {
  GoogleGenerativeAIEmbeddings,
  ChatGoogleGenerativeAI,
} from "@langchain/google-genai";
import { PineconeStore } from "@langchain/pinecone";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter "q" is required.' },
      { status: 400 },
    );
  }

  try {
    // 1. Initialize clients
    const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
    const pineconeIndexName = process.env.PINECONE_INDEX!;
    const pineconeIndex = pinecone.Index(pineconeIndexName);
    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: "gemini-embedding-001",
      apiKey: process.env.GEMINI_API_KEY,
    });

    // 2. Perform vector search
    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex,
    });

    // Retrieve top 3 documents with scores
    const results = await vectorStore.similaritySearchWithScore(query, 3);

    const matches = results.map(([doc, score]) => ({
      text: doc.pageContent,
      score,
    }));

    // 3. Synthesize an answer using RAG
    const llm = new ChatGoogleGenerativeAI({
      model: "gemini-2.0-flash",
      temperature: 0,
      apiKey: process.env.GEMINI_API_KEY,
    });

    const prompt = PromptTemplate.fromTemplate(`
      Answer the user's question based only on the following context. If the context doesn't contain the answer, say you don't have enough information.

      Context:
      {context}

      Question:
      {question}

      Concise Answer:
    `);

    const context = matches.map((m) => m.text).join("\n\n");

    const chain = RunnableSequence.from([
      prompt,
      llm,
      new StringOutputParser(),
    ]);

    const answer = await chain.invoke({
      question: query,
      context: context,
    });

    return NextResponse.json({
      answer,
      matches,
    });
  } catch (error) {
    console.error("FAQ API Error:", error);
    return NextResponse.json(
      { error: "An internal server error occurred." },
      { status: 500 },
    );
  }
}
