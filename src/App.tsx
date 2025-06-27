import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from './theme';
import Layout from './components/Layout';
import ShortenerPage from './pages/ShortenerPage';
import StatsPage from './pages/StatsPage';
import RedirectPage from './pages/RedirectPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Redirect route for shortened URLs */}
          <Route path="/:shortCode" element={<RedirectPage />} />
          
          {/* Main application routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<ShortenerPage />} />
            <Route path="shorten" element={<ShortenerPage />} />
            <Route path="stats" element={<StatsPage />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
