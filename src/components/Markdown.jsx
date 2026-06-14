import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * Renders markdown content (legal docs, blog bodies) with consistent styling.
 */
export default function Markdown({ content }) {
  return (
    <div className="prose-legal max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content || ''}</ReactMarkdown>
    </div>
  );
}
