
import { StrictMode } from 'react'
import { Provider } from "@/components/ui/provider"
import { createRoot } from 'react-dom/client'
import './App.css'
import App from './App.tsx'


import { createBrowserRouter, BrowserRouter, RouterProvider } from "react-router-dom";
import mainScreen from /.mainScreen.tsx;
import { ReactDOM } from 'react-dom';

const router = createBrowserRouter([
  {
    path: "/",
    element: <mainScreen />,
    errorElement: <error />,
  

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <BrowserRouter>
    <RouterProvider router = {router} />
    </BrowserRouter>
  </StrictMode>,
  }
]);

