/**
 * Cloudflare Worker - Main Entry Point
 * 
 * Routes requests to appropriate workers based on path and content type.
 * Combines edge caching, security headers, image optimization, and analytics.
 */

import edgeCache from './edge-cache';
import securityHeaders from './security-headers';
import imageOptimizer from './image-optimizer';
import analytics from './analytics';

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    
    try {
      let response: Response;
      
      // Route to appropriate worker based on request type
      if (isImageRequest(url.pathname)) {
        // Image optimization worker
        response = await imageOptimizer.fetch(request, env, ctx);
      } else {
        // Edge cache worker for all other requests
        response = await edgeCache.fetch(request, env, ctx);
      }
      
      // Apply security headers to all responses
      response = await securityHeaders.fetch(
        new Request(request, { signal: request.signal }),
        env,
        ctx
      );
      
      // Send analytics (non-blocking)
      ctx.waitUntil(
        analytics.fetch(request, env, ctx).catch(err => {
          console.error('Analytics error:', err);
        })
      );
      
      return response;
    } catch (error) {
      console.error('Worker error:', error);
      
      // Return error response
      return new Response('Internal Server Error', {
        status: 500,
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    }
  },
};

function isImageRequest(pathname: string): boolean {
  return /\.(jpg|jpeg|png|gif|webp|avif|svg|ico)$/i.test(pathname) ||
         pathname.startsWith('/Image/') ||
         pathname.startsWith('/_next/image');
}

interface Env {
  // Cloudflare bindings
  ANALYTICS_DATASET?: any;
  CF_IMAGES_URL?: string;
  DEBUG?: string;
  
  // Environment variables
  OPENROUTER_API_KEY?: string;
  NEXT_PUBLIC_REALSCOUT_AGENT_ID?: string;
}
