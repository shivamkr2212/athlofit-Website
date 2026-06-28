import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

/**
 * Renders markdown + HTML content (legal docs, blog bodies) with consistent styling.
 * Supports both markdown syntax AND raw HTML tags (bold, ul, headings, etc.).
 */
export default function Markdown({ content }) {
  return (
    <div className="prose-legal max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
        {content || ''}
      </ReactMarkdown>
    </div>
  );
}
