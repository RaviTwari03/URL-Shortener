import { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { supabase } from '../lib/supabase';
import { logger } from '../lib/logger';

interface UrlStats {
  short_code: string;
  long_url: string;
  click_count: number;
  created_at: string;
  expires_at: string;
}

const StatsPage = () => {
  const [stats, setStats] = useState<UrlStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('urls')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setStats(data || []);
    } catch (err) {
      logger.error('Error fetching stats:', err);
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = async (shortCode: string) => {
    const shortUrl = `${window.location.origin}/${shortCode}`;
    try {
      await navigator.clipboard.writeText(shortUrl);
      // You could add a temporary success message here
    } catch (err) {
      logger.error('Error copying URL:', err);
    }
  };

  const getExpiryStatus = (expiryDate: string) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const minutesLeft = Math.floor((expiry.getTime() - now.getTime()) / (1000 * 60));

    if (minutesLeft < 0) {
      return { label: 'Expired', color: 'error' as const };
    } else if (minutesLeft < 60) {
      return { label: `${minutesLeft}m left`, color: 'warning' as const };
    } else {
      const hoursLeft = Math.floor(minutesLeft / 60);
      return { label: `${hoursLeft}h left`, color: 'success' as const };
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          URL Statistics
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          View statistics for your shortened URLs.
        </Typography>
      </Paper>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Original URL</TableCell>
              <TableCell>Short URL</TableCell>
              <TableCell align="center">Clicks</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="right">Created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stats.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body1" color="text.secondary">
                    No shortened URLs yet. Create one from the Shorten page!
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              stats.map((url) => {
                const shortUrl = `${window.location.origin}/${url.short_code}`;
                const expiryStatus = getExpiryStatus(url.expires_at);
                return (
                  <TableRow key={url.short_code} hover>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>
                        {url.long_url}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Link
                          href={shortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          underline="hover"
                        >
                          {shortUrl}
                        </Link>
                        <Tooltip title="Copy URL">
                          <IconButton
                            size="small"
                            onClick={() => handleCopyUrl(url.short_code)}
                          >
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={url.click_count}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={expiryStatus.label}
                        size="small"
                        color={expiryStatus.color}
                      />
                    </TableCell>
                    <TableCell align="right">
                      {new Date(url.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default StatsPage; 