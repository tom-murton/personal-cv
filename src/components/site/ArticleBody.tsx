import type { ReactNode } from "react";
import type { ArticleBlock, ArticleMarkDefinition, ArticleSpan } from "@/content/types";

interface ArticleBodyProps {
  blocks: ArticleBlock[];
}

function renderSpan(span: ArticleSpan, markDefs: ArticleMarkDefinition[]): ReactNode {
  return (span.marks ?? []).reduce<ReactNode>((content, mark) => {
    if (mark === "strong") return <strong>{content}</strong>;
    if (mark === "em") return <em>{content}</em>;
    if (mark === "underline") return <u>{content}</u>;
    if (mark === "strike-through") return <s>{content}</s>;

    const definition = markDefs.find((item) => item._key === mark && item._type === "link");
    if (!definition) return content;

    const external = /^https?:\/\//.test(definition.href);
    return (
      <a href={definition.href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
        {content}
      </a>
    );
  }, span.text);
}

function blockContent(block: ArticleBlock) {
  return block.children.map((span) => (
    <span key={span._key}>{renderSpan(span, block.markDefs ?? [])}</span>
  ));
}

export function ArticleBody({ blocks }: ArticleBodyProps) {
  const content: ReactNode[] = [];

  for (let index = 0; index < blocks.length;) {
    const block = blocks[index];

    if (block.listItem) {
      const listType = block.listItem;
      const listBlocks: ArticleBlock[] = [];
      while (blocks[index]?.listItem === listType) {
        listBlocks.push(blocks[index]);
        index += 1;
      }
      const items = listBlocks.map((item) => <li key={item._key}>{blockContent(item)}</li>);
      content.push(listType === "number" ? <ol key={block._key}>{items}</ol> : <ul key={block._key}>{items}</ul>);
      continue;
    }

    if (block.style === "h2") content.push(<h2 key={block._key}>{blockContent(block)}</h2>);
    else if (block.style === "h3") content.push(<h3 key={block._key}>{blockContent(block)}</h3>);
    else if (block.style === "blockquote") content.push(<blockquote key={block._key}>{blockContent(block)}</blockquote>);
    else content.push(<p key={block._key}>{blockContent(block)}</p>);
    index += 1;
  }

  return <div className="pg-article-prose">{content}</div>;
}
