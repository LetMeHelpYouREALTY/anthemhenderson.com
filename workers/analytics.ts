/**
 * Cloudflare Worker - Analytics & Monitoring
 * 
 * Collects performance metrics and sends them to Cloudflare Analytics.
 * Tracks Core Web Vitals and custom performance metrics.
 */

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const startTime = Date.now();
    const url = new URL(request.url);
    
    // Fetch response
    const response = await fetch(request);
    const responseTime = Date.now() - startTime;
    
    // Collect analytics data
    const analyticsData = {
      timestamp: new Date().toISOString(),
      url: url.pathname,
      method: request.method,
      status: response.status,
      responseTime,
      userAgent: request.headers.get('User-Agent'),
      country: request.cf?.country || 'unknown',
      colo: request.cf?.colo || 'unknown',
      cacheStatus: response.headers.get('CF-Cache-Status'),
      contentType: response.headers.get('Content-Type'),
    };
    
    // Send analytics asynchronously (don't block response)
    ctx.waitUntil(sendAnalytics(analyticsData, env));
    
    // Add performance timing header
    const newResponse = new Response(response.body, response);
    newResponse.headers.set('Server-Timing', `edge;dur=${responseTime}`);
    
    return newResponse;
  },
};

interface AnalyticsData {
  timestamp: string;
  url: string;
  method: string;
  status: number;
  responseTime: number;
  userAgent: string | null;
  country: string;
  colo: string;
  cacheStatus: string | null;
  contentType: string | null;
}

async function sendAnalytics(data: AnalyticsData, env: Env): Promise<void> {
  // Send to Cloudflare Analytics Engine (if configured)
  if (env.ANALYTICS_DATASET) {
    try {
      await env.ANALYTICS_DATASET.writeDataPoint({
        blobs: [
          data.url,
          data.method,
          data.userAgent || '',
          data.country,
          data.colo,
        ],
        doubles: [data.responseTime, data.status],
        indexes: [data.url],
      });
    } catch (error) {
      console.error('Failed to send analytics:', error);
    }
  }
  
  // Log to console for debugging
  if (env.DEBUG === 'true') {
    console.log('Analytics:', JSON.stringify(data, null, 2));
  }
}

interface Env {
  ANALYTICS_DATASET?: AnalyticsEngineDataset;
  DEBUG?: string;
}

interface AnalyticsEngineDataset {
  writeDataPoint(data: {
    blobs?: string[];
    doubles?: number[];
    indexes?: string[];
  }): Promise<void>;
}
