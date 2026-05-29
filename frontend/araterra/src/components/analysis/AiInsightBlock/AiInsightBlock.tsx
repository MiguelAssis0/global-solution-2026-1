import type { ReactNode } from "react";

interface AiInsightBlockProps {
  insight: string | null;
  loading: boolean;
  error: string | null;
  onGenerate: () => void;
}

function parseInlineMarkdown(value: string): ReactNode[] {
  const tokens = value.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
  return tokens.map((token, index) => {
    if (token.startsWith("**") && token.endsWith("**")) {
      return <strong key={index}>{token.slice(2, -2)}</strong>;
    }
    if (token.startsWith("*") && token.endsWith("*") && token.length > 1) {
      return <em key={index}>{token.slice(1, -1)}</em>;
    }
    if (token.startsWith("`") && token.endsWith("`")) {
      return (
        <code key={index} style={{ background: "var(--color-code-bg)", padding: "2px 4px", borderRadius: 4 }}>
          {token.slice(1, -1)}
        </code>
      );
    }
    return token;
  });
}

function renderMarkdown(markdown: string): ReactNode[] {
  const lines = markdown.split(/\r?\n/);
  const output: ReactNode[] = [];
  let listType: "ul" | "ol" | null = null;
  let listItems: ReactNode[] = [];
  let codeBlock: string[] | null = null;

  const flushList = () => {
    if (!listType || !listItems.length) {
      listType = null;
      listItems = [];
      return;
    }

    output.push(
      listType === "ol" ? (
        <ol key={output.length} style={{ margin: "0 0 1rem 1.25rem", color: "var(--color-text-2)" }}>
          {listItems}
        </ol>
      ) : (
        <ul key={output.length} style={{ margin: "0 0 1rem 1.25rem", color: "var(--color-text-2)" }}>
          {listItems}
        </ul>
      ),
    );

    listType = null;
    listItems = [];
  };

  const flushCodeBlock = () => {
    if (!codeBlock) return;
    output.push(
      <pre key={output.length} style={{ margin: "0 0 1rem", padding: 14, background: "var(--color-codeblock-bg)", borderRadius: 8, overflowX: "auto" }}>
        <code>{codeBlock.join("\n")}</code>
      </pre>,
    );
    codeBlock = null;
  };

  for (const line of lines) {
    if (line.startsWith("```") ) {
      if (codeBlock) {
        flushCodeBlock();
      } else {
        flushList();
        codeBlock = [];
      }
      continue;
    }

    if (codeBlock) {
      codeBlock.push(line);
      continue;
    }

    if (!line.trim()) {
      flushList();
      continue;
    }

    const headingMatch = line.match(/^(#{1,3})\s+(.*)$/);
    if (headingMatch) {
      flushList();
      const level = headingMatch[1].length;
      const content = parseInlineMarkdown(headingMatch[2]);
      if (level === 1) {
        output.push(
          <h1 key={output.length} style={{ margin: "0 0 0.75rem", color: "var(--color-text)" }}>
            {content}
          </h1>,
        );
      } else if (level === 2) {
        output.push(
          <h2 key={output.length} style={{ margin: "0 0 0.75rem", color: "var(--color-text)" }}>
            {content}
          </h2>,
        );
      } else {
        output.push(
          <h3 key={output.length} style={{ margin: "0 0 0.75rem", color: "var(--color-text)" }}>
            {content}
          </h3>,
        );
      }
      continue;
    }

    const unorderedMatch = line.match(/^[-*]\s+(.*)$/);
    const orderedMatch = line.match(/^\d+\.\s+(.*)$/);

    if (unorderedMatch || orderedMatch) {
      const currentType = unorderedMatch ? "ul" : "ol";
      if (listType !== currentType) {
        flushList();
        listType = currentType;
      }
      listItems.push(
        <li key={listItems.length} style={{ marginBottom: 8 }}>
          {parseInlineMarkdown((unorderedMatch || orderedMatch)![1])}
        </li>,
      );
      continue;
    }

    flushList();
    output.push(
      <p key={output.length} style={{ margin: "0 0 1rem", lineHeight: 1.75, color: "var(--color-text-2)" }}>
        {parseInlineMarkdown(line)}
      </p>,
    );
  }

  flushList();
  flushCodeBlock();
  return output;
}

export function AiInsightBlock({ insight, loading, error, onGenerate }: AiInsightBlockProps) {
  return (
    <section style={{ padding: 20, borderRadius: 8, background: "var(--color-card-bg)", border: "1px solid var(--color-card-border)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div style={{ fontWeight: 700 }}>Análise com IA</div>
        <button type="button" onClick={onGenerate} disabled={loading} style={{ padding: "10px 14px", borderRadius: 8, border: "none", background: "var(--color-accent)", color: "#173760", cursor: "pointer", fontWeight: 800 }}>
          {loading ? "Gerando..." : "Gerar insight"}
        </button>
      </div>
      {error ? <p style={{ color: "var(--color-score-low)", marginBottom: 12 }}>{error}</p> : null}
      {insight ? (
        <div>{renderMarkdown(insight)}</div>
      ) : (
        <p style={{ margin: 0, color: "var(--color-text-2)" }}>Clique em gerar para ver o resumo de IA da análise.</p>
      )}
    </section>
  );
}
