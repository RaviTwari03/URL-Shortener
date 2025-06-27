import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import { supabase } from '../lib/supabase';
import { logger } from '../lib/logger';

const RedirectPage = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const redirectToOriginalUrl = async () => {
      try {
        if (!shortCode) {
          throw new Error('No short code provided');
        }

        // Query the URL from the database
        const { data, error } = await supabase
          .from('urls')
          .select('long_url, expires_at')
          .eq('short_code', shortCode)
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error('URL not found');
        }

        // Check if URL has expired
        const expiresAt = new Date(data.expires_at);
        if (expiresAt < new Date()) {
          throw new Error('URL has expired');
        }

        // Log the click
        await supabase.rpc('increment_click_count', {
          short_code_param: shortCode
        });

        // For URLs that don't start with http:// or https://, add https://
        let targetUrl = data.long_url;
        if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
          targetUrl = 'https://' + targetUrl;
        }

        // Use window.location.href for the actual redirect
        window.location.href = targetUrl;
      } catch (err) {
        logger.error('Error during redirect:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    };

    redirectToOriginalUrl();
  }, [shortCode]);

  const handleGoBack = () => {
    navigate('/');
  };

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          p: 3,
          textAlign: 'center',
          gap: 2,
        }}
      >
        <Typography variant="h5" color="error" gutterBottom>
          {error}
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          The URL you're trying to access is either invalid, expired, or doesn't exist.
        </Typography>
        <Button variant="contained" color="primary" onClick={handleGoBack}>
          Go Back to Home
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        p: 3,
        gap: 2,
      }}
    >
      <CircularProgress size={40} />
      <Typography variant="body1">
        Redirecting...
      </Typography>
    </Box>
  );
};

export default RedirectPage; 