import { createBrowserRouter, BrowserRouter, RouterProvider } from "react-router-dom";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import MainScreen from './mainScreen';

function ErrorPage() {
  return <div>Sorry, Something went wrong!</div>;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainScreen />,
    errorElement: <ErrorPage />
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <RouterProvider router={router} />
    </BrowserRouter>
  </StrictMode>
);

