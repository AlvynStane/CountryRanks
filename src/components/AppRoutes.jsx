import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import NewsArticlesPage from '../pages/NewsArticlesPage';
import ComparePage from '../pages/ComparePage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/compare" element={<ComparePage />} />
      <Route path="/compare/:firstCode/n/:secondCode" element={<ComparePage />} />
      <Route path="/news" element={<NewsArticlesPage />} />
    </Routes>
  );
};

export default AppRoutes;