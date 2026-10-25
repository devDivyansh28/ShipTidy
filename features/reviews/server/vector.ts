import type { CodeChunk } from "@/features/reviews/types/review";
import { getPineconeIndex } from "@/features/pinecone/client";

const CONTEXT_RESULTS = 10;

export function buildPrNamespace(repoFullName: string, prNumber: number) {
  return `${repoFullName.replace("/", "--")}--pr-${prNumber}`;
}

export async function saveChunksToPinecone(
  namespace: string,
  chunks: CodeChunk[],
) {
  const validChunks = chunks.filter(
    (chunk) => chunk.text && chunk.text.trim().length > 0,
  );

  if (validChunks.length === 0) {
    return;
  }

  const index = getPineconeIndex();

  const documents = validChunks.map((chunk) => ({
    _id: chunk.id,
    chunk_text: chunk.text,
    filePath: chunk.filePath,
  }));

  // namespace() scopes vectors so this PR never mixes with repo-wide sync data
  await index.namespace(namespace).documents.upsert({ documents });
}

export async function searchPrContext(namespace: string, query: string) {
  if (!query || !query.trim()) {
    return [];
  }

  const index = getPineconeIndex();

  const response = await index.namespace(namespace).documents.search({
    scoreBy: [
      {
        type: "embed",
        field: "chunk_text",
        query: query.trim(),
      },
    ],
    topK: CONTEXT_RESULTS,
    includeFields: ["chunk_text", "filePath"],
  });

  const snippets: string[] = [];

  for (const match of response.matches ?? []) {
    const text = (match.chunk_text ?? match.fields?.chunk_text) as
      | string
      | undefined;
    const filePath = (match.filePath ?? match.fields?.filePath) as
      | string
      | undefined;

    if (!text) {
      continue;
    }

    snippets.push(`File: ${filePath ?? "unknown"}\n${text}`);
  }

  return snippets;
}
