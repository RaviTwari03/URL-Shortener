import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  Snackbar,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Link,
  Divider,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { generateUniqueShortCode, insertUrl } from '../lib/supabase';
import { logger } from '../lib/logger';

interface UrlForm {
  longUrl: string;
  validityMinutes: number;
  customShortcode?: string;
}

interface ShortenedUrl {
  originalUrl: string;
  shortCode: string;
  expiresAt: Date;
}

const initialFormState: UrlForm = {
  longUrl: '',
  validityMinutes: 30,
  customShortcode: '',
};

const ShortenerPage = () => {
  const [forms, setForms] = useState<UrlForm[]>([{ ...initialFormState }]);
  const [isLoading, setIsLoading] = useState(false);
  const [shortenedUrls, setShortenedUrls] = useState<ShortenedUrl[]>([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleAddForm = () => {
    if (forms.length < 5) {
      setForms([...forms, { ...initialFormState }]);
    }
  };

  const handleRemoveForm = (index: number) => {
    setForms(forms.filter((_, i) => i !== index));
  };

  const handleFormChange = (index: number, field: keyof UrlForm, value: string | number) => {
    const newForms = [...forms];
    newForms[index] = {
      ...newForms[index],
      [field]: value,
    };
    setForms(newForms);
  };

  const handleCopyUrl = async (shortUrl: string) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setSnackbar({
        open: true,
        message: 'URL copied to clipboard!',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to copy URL',
        severity: 'error',
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Validate all forms
    const invalidForms = forms.filter(form => !validateUrl(form.longUrl));
    if (invalidForms.length > 0) {
      logger.error('Invalid URLs detected', { invalidForms });
      setSnackbar({
        open: true,
        message: 'Please enter valid URLs',
        severity: 'error',
      });
      return;
    }

    setIsLoading(true);

    try {
      const results = await Promise.all(
        forms.map(async form => {
          const shortCode = form.customShortcode || await generateUniqueShortCode();
          const expiresAt = new Date(Date.now() + form.validityMinutes * 60 * 1000);
          const success = await insertUrl(form.longUrl, shortCode, expiresAt);
          
          if (success) {
            return {
              originalUrl: form.longUrl,
              shortCode,
              expiresAt,
            };
          }
          return null;
        })
      );

      const successful = results.filter((result): result is ShortenedUrl => result !== null);
      logger.info('URLs shortened successfully', { successful });

      setShortenedUrls(prevUrls => [...successful, ...prevUrls]);

      setSnackbar({
        open: true,
        message: `Successfully shortened ${successful.length} URLs`,
        severity: 'success',
      });

      // Reset forms
      setForms([{ ...initialFormState }]);
    } catch (error) {
      logger.error('Error shortening URLs', { error });
      setSnackbar({
        open: true,
        message: 'Error shortening URLs',
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const baseUrl = window.location.origin;

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Shorten Your URL
        </Typography>
        <Typography variant="body1" gutterBottom color="text.secondary">
          Enter a long URL to create a shortened version. You can shorten up to 5 URLs at once.
        </Typography>
      </Paper>

      {forms.map((form, index) => (
        <Paper key={index} sx={{ p: 3, mb: 2, position: 'relative' }}>
          {forms.length > 1 && (
            <IconButton
              size="small"
              onClick={() => handleRemoveForm(index)}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: 'error.main',
              }}
            >
              <DeleteIcon />
            </IconButton>
          )}

          <Stack spacing={3}>
            <TextField
              required
              fullWidth
              label="Long URL"
              placeholder="https://example.com/very/long/url"
              value={form.longUrl}
              onChange={(e) => handleFormChange(index, 'longUrl', e.target.value)}
              error={form.longUrl !== '' && !validateUrl(form.longUrl)}
              helperText={
                form.longUrl !== '' && !validateUrl(form.longUrl)
                  ? 'Please enter a valid URL'
                  : ''
              }
            />

            <TextField
              required
              type="number"
              label="Validity Duration"
              value={form.validityMinutes}
              onChange={(e) => handleFormChange(index, 'validityMinutes', Number(e.target.value))}
              InputProps={{
                endAdornment: <InputAdornment position="end">minutes</InputAdornment>,
              }}
              inputProps={{ min: 1 }}
            />

            <TextField
              fullWidth
              label="Custom Shortcode (optional)"
              placeholder="custom-code"
              value={form.customShortcode}
              onChange={(e) => handleFormChange(index, 'customShortcode', e.target.value)}
              helperText="Leave empty for auto-generated code"
            />
          </Stack>
        </Paper>
      ))}

      <Stack direction="row" spacing={2} sx={{ mt: 3, mb: 4 }}>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          size="large"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {isLoading ? 'Shortening...' : 'Shorten URLs'}
        </Button>

        {forms.length < 5 && (
          <Button
            variant="outlined"
            onClick={handleAddForm}
            startIcon={<AddIcon />}
            size="large"
            disabled={isLoading}
          >
            Add Another URL
          </Button>
        )}
      </Stack>

      {shortenedUrls.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Your Shortened URLs
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={2}>
            {shortenedUrls.map((url, index) => {
              const shortUrl = `${baseUrl}/${url.shortCode}`;
              const expiresIn = new Date(url.expiresAt).getTime() - Date.now();
              const expiresInMinutes = Math.max(0, Math.floor(expiresIn / (1000 * 60)));

              return (
                <Box key={index} sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                  <Stack spacing={1}>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      Original: {url.originalUrl}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Link
                        href={shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ flex: 1 }}
                      >
                        {shortUrl}
                      </Link>
                      <Tooltip title="Copy URL">
                        <IconButton
                          size="small"
                          onClick={() => handleCopyUrl(shortUrl)}
                          sx={{ color: 'primary.main' }}
                        >
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                      Expires in: {expiresInMinutes} minutes
                    </Typography>
                  </Stack>
                </Box>
              );
            })}
          </Stack>
        </Paper>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ShortenerPage; 