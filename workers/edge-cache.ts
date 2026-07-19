/**
 * Cloudflare Worker - Edge Cache Optimization
 * 
 * This worker provides advanced caching strategies at the edge
 * for optimal performance and reduced origin server load.
 */

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const cacheKey = new Request(url.toString(), request);
    const cache = caches.default;

    // Check if we have cached response
    let response = await cache.match(cacheKey);

    if (!response) {
      // If not cached, fetch from origin
      response = await fetch(request);

      // Clone the response so we can cache it
      response = new Response(response.body, response);

      // Apply caching rules based on content type and path
      const cacheRules = getCacheRules(url.pathname, response.headers.get('content-type'));
      
      if (cacheRules.shouldCache) {
        // Set cache headers
        response.headers.set('Cache-Control', cacheRules.cacheControl);
        response.headers.set('CDN-Cache-Control', cacheRules.cdnCacheControl);
        
        // Store in edge cache
        ctx.waitUntil(cache.put(cacheKey, response.clone()));
      }
    }

    // Add cache status header for debugging
    response.headers.set('CF-Cache-Status', response ? 'HIT' : 'MISS');
    
    return response;
  },
};

interface CacheRule {
  shouldCache: boolean;
  cacheControl: string;
  cdnCacheControl: string;
}

function getCacheRules(pathname: string, contentType: string | null): CacheRule {
  // Static assets - cache for 1 year
  if (
    pathname.startsWith('/_next/static/') ||
    pathname.startsWith('/static/') ||
    /\.(jpg|jpeg|png|gif|webp|avif|svg|ico|woff|woff2|ttf|eot|otf)$/i.test(pathname)
  ) {
    return {
      shouldCache: true,
      cacheControl: 'public, max-age=31536000, immutable',
      cdnCacheControl: 'public, max-age=31536000, immutable',
    };
  }

  // Images - cache for 1 year
  if (pathname.startsWith('/Image/') || contentType?.startsWith('image/')) {
    return {
      shouldCache: true,
      cacheControl: 'public, max-age=31536000',
      cdnCacheControl: 'public, max-age=31536000',
    };
  }

  // HTML pages - cache for 1 hour, revalidate
  if (contentType?.includes('text/html')) {
    return {
      shouldCache: true,
      cacheControl: 'public, max-age=0, must-revalidate',
      cdnCacheControl: 'public, max-age=3600, stale-while-revalidate=86400',
    };
  }

  // API routes - don't cache
  if (pathname.startsWith('/api/')) {
    return {
      shouldCache: false,
      cacheControl: 'private, no-cache, no-store, must-revalidate',
      cdnCacheControl: 'private, no-cache',
    };
  }

  // Default - cache for 5 minutes
  return {
    shouldCache: true,
    cacheControl: 'public, max-age=300',
    cdnCacheControl: 'public, max-age=300',
  };
}

interface Env {
  // Add your environment variables here
  // ASSETS: Fetcher;
}
