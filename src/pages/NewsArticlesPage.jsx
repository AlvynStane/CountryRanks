import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchNews } from '../redux/slices/newsSlice';
import Card from '../components/Card';
import './NewsArticlesPage.css';

const NewsArticlesPage = () => {
  const dispatch = useDispatch();
  const { articles, status, error } = useSelector((state) => state.news);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchNews());
    }
  }, [status, dispatch]);

  if (status === 'loading') return <div className="loader">Loading...</div>;
  if (status === 'failed') {
    return (
      <div className='error-message'>
        <p>Error fetching articles: {error}</p>
        <button onClick={() => dispatch(fetchNews())}>Retry</button>
      </div>
    );
  }

  return (
    <div className="news-articles-page">
      <h1>News Articles</h1>
      <p>Here you can find the latest news articles related to World.</p>
      <div className="card-container">
        {articles.slice(0, 15).map((article, index) => (
          <Card key={index} article={article} />
        ))}
      </div>
    </div>
  );
};

export default NewsArticlesPage;