import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

/**
 * Sanitize content before rendering:
 * - Strips <style>...</style> blocks (from PDF copy-paste)
 * - Removes class attributes like class="p1 s1" etc.
 * - Strips inline font/margin styles that come from PDF/Word paste
 */
function sanitizeContent(raw) {
  if (!raw) return '';
  let s = raw;
  // Remove <style> blocks (including multi-line)
  s = s.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  // Remove class attributes
  s = s.replace(/\s*class="[^"]*"/gi, '');
  // Remove inline style attributes with PDF-like font/margin rules
  s = s.replace(/\s*style="[^"]*"/gi, '');
  // Remove span wrappers that are now empty of attributes
  s = s.replace(/<span\s*>([\s\S]*?)<\/span>/gi, '$1');
  return s.trim();
}

/**
 * Renders markdown + HTML content (legal docs, blog bodies) with consistent styling.
 * Supports both markdown syntax AND raw HTML tags (bold, ul, headings, etc.).
 * Automatically strips PDF/Word paste artifacts (style blocks, class names).
 */
export default function Markdown({ content }) {
  return (
    <div className="prose-legal max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
        {sanitizeContent(content)}
      </ReactMarkdown>
    </div>
  );
}
