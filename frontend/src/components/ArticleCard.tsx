import { Link } from 'react-router-dom';
import type { Article } from '../api/client';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const excerpt = article.content.substring(0, 150) + '...';

  return (
    <Link
      to={`/article/${article.id}`}
      className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
          {article.title}
        </ReactMarkdown>
      </h2>
      <p className="text-gray-600 mb-4 line-clamp-3">
        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
          {excerpt}
        </ReactMarkdown>
      </p>
      <div className="text-sm text-gray-500">
        Published on {formatDate(article.created_at)}
      </div>
    </Link>
  );
}
