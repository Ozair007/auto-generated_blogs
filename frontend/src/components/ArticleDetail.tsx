import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { articlesApi, type Article } from '../api/client';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import 'highlight.js/styles/github-dark.css';

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await articlesApi.getById(parseInt(id));
        setArticle(data);
        setError(null);
      } catch (err) {
        setError('Failed to load article. Please try again later.');
        console.error('Error fetching article:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg text-gray-600">Loading article...</div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px]">
        <div className="text-red-600 mb-4">{error || 'Article not found'}</div>
        <Link to="/" className="text-blue-600 hover:underline">
          ← Back to articles
        </Link>
      </div>
    );
  }
  console.log(article.content);
  return (
    <article className="max-w-4xl mx-auto">
      <Link
        to="/"
        className="inline-block mb-6 text-blue-600 hover:text-blue-800 hover:underline"
      >
        ← Back to articles
      </Link>

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
            {article.title}
          </ReactMarkdown>
        </h1>
        <div className="text-gray-500 text-sm">
          Published on {formatDate(article.created_at)}
        </div>
      </header>

      <div className="prose prose-lg max-w-none">
        <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              h1: ({ ...props }) => (
                <h1 className="text-3xl font-bold mb-4" {...props} />
              ),
              h2: ({ ...props }) => (
                <h2 className="text-2xl font-bold mb-3" {...props} />
              ),
              h3: ({ ...props }) => (
                <h3 className="text-xl font-bold mb-2" {...props} />
              ),
            }}
          >
            {article.content}
          </ReactMarkdown>
        </div>
      </div>
    </article>
  );
}
