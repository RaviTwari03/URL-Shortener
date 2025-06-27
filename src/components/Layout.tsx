import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Container,
  Button,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import BarChartIcon from '@mui/icons-material/BarChart';

const Layout = () => {
  const location = useLocation();
  const currentPath = location.pathname.split('/')[1] || 'shorten';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" elevation={0}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                textDecoration: 'none',
                color: 'inherit',
                flexGrow: 1,
                fontWeight: 700,
              }}
            >
              URL Shortener
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button
                component={RouterLink}
                to="/shorten"
                startIcon={<LinkIcon />}
                color="inherit"
                size="large"
                sx={{
                  borderRadius: 2,
                  px: 3,
                  backgroundColor: currentPath === 'shorten' ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                  '&:hover': {
                    backgroundColor: currentPath === 'shorten' 
                      ? 'rgba(255, 255, 255, 0.2)' 
                      : 'rgba(255, 255, 255, 0.08)',
                  },
                }}
              >
                SHORTEN
              </Button>
              <Button
                component={RouterLink}
                to="/stats"
                startIcon={<BarChartIcon />}
                color="inherit"
                size="large"
                sx={{
                  borderRadius: 2,
                  px: 3,
                  backgroundColor: currentPath === 'stats' ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                  '&:hover': {
                    backgroundColor: currentPath === 'stats' 
                      ? 'rgba(255, 255, 255, 0.2)' 
                      : 'rgba(255, 255, 255, 0.08)',
                  },
                }}
              >
                STATS
              </Button>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      <Box 
        sx={{ 
          backgroundColor: 'primary.main',
          color: 'white',
          py: 2,
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)'
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h4" component="h1" gutterBottom>
            {currentPath === 'stats' ? 'URL Statistics' : 'Shorten Your URL'}
          </Typography>
          <Typography variant="subtitle1" color="rgba(255, 255, 255, 0.7)">
            {currentPath === 'stats' 
              ? 'Track and manage your shortened URLs' 
              : 'Create short, memorable links in seconds'}
          </Typography>
        </Container>
      </Box>

      <Container component="main" sx={{ flex: 1, py: 4 }} maxWidth="lg">
        <Outlet />
      </Container>

      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[100]
              : theme.palette.grey[800],
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} URL Shortener
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout; 