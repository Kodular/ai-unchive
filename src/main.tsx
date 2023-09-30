import React from 'react'
import ReactDOM from 'react-dom/client'
import {MantineProvider, createTheme} from "@mantine/core";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import App from './App'

// core styles are required for all packages
import '@mantine/core/styles.css';

import './main.css'

const theme = createTheme({
  primaryColor: "violet"
});

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <QueryClientProvider client={queryClient}>
        <App/>
      </QueryClientProvider>
    </MantineProvider>
  </React.StrictMode>
)
