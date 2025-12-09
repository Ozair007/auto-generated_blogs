import ArticleList from '../components/ArticleList';

export default function HomePage() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Latest Articles
        </h2>
        <p className="text-gray-600">
          Explore our collection of AI-generated articles
        </p>
      </div>
      <ArticleList />
    </div>
  );
}
