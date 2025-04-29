import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import InGamePage from './components/InGamePage';

// Create router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />
  },
  {
    path: "/play",
    element: <InGamePage />
  }
]);

// Define future flags for RouterProvider
const futureFlags = {
  v7_startTransition: true,
  v7_relativeSplatPath: true
};

const App = () => {
  // Apply future flags to opt-in to React Router v7 behavior
  return <RouterProvider router={router} future={futureFlags as any} />;
};

export default App;
