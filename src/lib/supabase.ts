import { createClient } from '@supabase/supabase-js';
import { logger } from './logger';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  logger.error('Missing Supabase environment variables');
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Url {
  id: string;
  long_url: string;
  short_code: string;
  created_at: string;
  expires_at: string;
  click_count: number;
}

export interface ClickLog {
  id: string;
  url_id: string;
  clicked_at: string;
  referrer: string;
  location: string;
}

export const insertUrl = async (
  longUrl: string,
  shortCode: string,
  expiresAt: Date
): Promise<boolean> => {
  try {
    const { error } = await supabase.from('urls').insert({
      long_url: longUrl,
      short_code: shortCode,
      expires_at: expiresAt.toISOString(),
      created_at: new Date().toISOString(),
      click_count: 0,
    });

    if (error) {
      logger.error('Error inserting URL:', error);
      return false;
    }

    return true;
  } catch (error) {
    logger.error('Error inserting URL:', error);
    return false;
  }
};

export const getAllUrls = async (): Promise<Url[]> => {
  const { data, error } = await supabase
    .from('urls')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching URLs:', error);
    return [];
  }

  return data || [];
};

export const logClick = async (
  urlId: string,
  referrer: string,
  location: string
): Promise<void> => {
  const { error: clickError } = await supabase.from('click_logs').insert([
    {
      url_id: urlId,
      referrer,
      location,
    },
  ]);

  if (clickError) {
    console.error('Error logging click:', clickError);
    return;
  }

  const { error: updateError } = await supabase.rpc('increment_click_count', {
    url_id: urlId,
  });

  if (updateError) {
    console.error('Error updating click count:', updateError);
  }
};

export const getUrlByShortCode = async (shortCode: string): Promise<Url | null> => {
  const { data, error } = await supabase
    .from('urls')
    .select('*')
    .eq('short_code', shortCode)
    .single();

  if (error) {
    console.error('Error fetching URL:', error);
    return null;
  }

  return data;
};

export const generateUniqueShortCode = async (): Promise<string> => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = 6;
  let shortCode: string;
  
  do {
    shortCode = '';
    for (let i = 0; i < length; i++) {
      shortCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    // Check if the code already exists
    const { data } = await supabase
      .from('urls')
      .select('short_code')
      .eq('short_code', shortCode)
      .single();
      
    if (!data) break;
  } while (true);
  
  return shortCode;
}; 