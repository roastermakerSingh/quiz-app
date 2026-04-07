import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import Layout         from './components/common/Layout';
import HomePage       from './pages/HomePage';
import GalleryPage    from './pages/GalleryPage';
import QuizPage       from './pages/QuizPage';
import ResultsPage    from './pages/ResultsPage';
import MembersPage    from './pages/MembersPage';
import DonationPage   from './pages/DonationPage';
import AdminPage      from './pages/AdminPage';
import LoginPage      from './pages/LoginPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import Lightbox       from './components/common/Lightbox';
import ToastContainer from './components/common/ToastContainer';

export default function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <BrowserRouter>
          <Lightbox />
          <ToastContainer />
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index            element={<HomePage />} />
              <Route path="gallery"   element={<GalleryPage />} />
              <Route path="quiz"      element={<QuizPage />} />
              <Route path="results"   element={<ResultsPage />} />
              <Route path="members"   element={<MembersPage />} />
              <Route path="donation"  element={<DonationPage />} />
              <Route path="login"     element={<LoginPage />} />
              <Route path="admin"     element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
              <Route path="*"         element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AppProvider>
  );
}
