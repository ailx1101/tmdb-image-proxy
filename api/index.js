import fetch from 'node-fetch';
import LRUCache from 'lru-cache';

const rateLimit = new LRUCache({
  max: 100, // Max 100 requests per IP
  ttl: 60 * 1000, // 1 minute
});

export default async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  if (rateLimit.has(ip)) {
    const count = rateLimit.get(ip);
    if (count >= 100) {
      return res.status(429).send('Too Many Requests');
    }
    rateLimit.set(ip, count + 1);
  } else {
    rateLimit.set(ip, 1);
  }

  const { url } = req;
  const targetUrl = `${process.env.TMDB_IMAGE_BASE_URL}${url}`;

  try {
    const response = await fetch(targetUrl);

    if (!response.ok) {
      console.error(`Proxy error: ${response.status} - ${response.statusText}`);
      return res.status(response.status).send(response.statusText);
    }

    // Set appropriate headers from the TMDB response
    response.headers.forEach((value, name) => {
      // Vercel automatically handles Cache-Control based on vercel.json, but we can add more specific ones if needed
      if (name.toLowerCase() !== 'cache-control') {
        res.setHeader(name, value);
      }
    });

    // Stream the image back to the client
    response.body.pipe(res);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).send('Proxy Error');
  }
};
