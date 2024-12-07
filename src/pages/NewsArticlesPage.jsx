import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '../components/Card';
import './NewsArticlesPage.css';


const NewsArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_KEY = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(
          `https://api.nytimes.com/svc/topstories/v2/world.json?api-key=${API_KEY}`
        );
        setArticles(response.data.results);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching articles: {error.message}</div>;

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