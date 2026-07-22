import axios from 'axios';
import * as cheerio from 'cheerio';

interface ApiRequest {
  method?: string;
  query: Record<string, string | string[] | undefined>;
}

interface ApiResponse<T> {
  status: (code: number) => ApiResponse<T>;
  json: (body: T) => unknown;
  setHeader: (name: string, value: string) => void;
}

type MetadataResponse = {
  title: string;
  description: string;
  image: string;
  url: string;
}

/**
 * API endpoint to fetch Open Graph metadata from URLs 
 * This endpoint acts as a proxy to bypass CORS restrictions
 */
export default async function handler(
  req: ApiRequest,
  res: ApiResponse<MetadataResponse | { error: string }>
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    // Use axios to fetch the URL content
    // LinkedIn might restrict direct access, so we use a special user agent
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LinkedInBot/1.0; +http://www.linkedin.com)'
      }
    });

    const html = response.data;
    const $ = cheerio.load(html);
    
    // Extract Open Graph metadata
    const metadata: MetadataResponse = {
      title: $('meta[property="og:title"]').attr('content') || 
             $('meta[name="twitter:title"]').attr('content') || 
             $('title').text() || '',
      description: $('meta[property="og:description"]').attr('content') || 
                   $('meta[name="twitter:description"]').attr('content') || 
                   $('meta[name="description"]').attr('content') || '',
      image: $('meta[property="og:image"]').attr('content') || 
             $('meta[name="twitter:image"]').attr('content') || '',
      url: url
    };

    // Set cache headers
    res.setHeader('Cache-Control', 'public, s-maxage=86400'); // 24 hours
    return res.status(200).json(metadata);
    
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return res.status(500).json({ error: 'Failed to fetch metadata' });
  }
}
