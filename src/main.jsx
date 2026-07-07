import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from './components/ui/provider'
import { AppRouter } from './AppRouter'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider defaultTheme="dark">
      <AppRouter />
    </Provider>
  </React.StrictMode>,
)
