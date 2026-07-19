/**
 * Cloudflare Worker - Image Optimization
 * 
 * Automatically optimizes images at the edge using Cloudflare Images.
 * Supports WebP/AVIF conversion, resizing, and quality optimization.
 */

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    
    // Only process image requests
    if (!isImageRequest(url.pathname)) {
      return fetch(request);
    }
    
    // Parse image optimization parameters from URL
    const params = parseImageParams(url);
    
    // Check if client supports modern formats
    const acceptHeader = request.headers.get('Accept') || '';
    const supportsAVIF = acceptHeader.includes('image/avif');
    const supportsWebP = acceptHeader.includes('image/webp');
    
    // Determine optimal format
    let format = params.format || 'auto';
    if (format === 'auto') {
      if (supportsAVIF) format = 'avif';
      else if (supportsWebP) format = 'webp';
      else format = 'jpeg';
    }
    
    // Fetch original image
    const originalResponse = await fetch(request);
    
    // If using Cloudflare Images (requires paid plan)
    if (env.CF_IMAGES_URL) {
      return optimizeWithCloudflareImages(
        originalResponse,
        params,
        format,
        env.CF_IMAGES_URL
      );
    }
    
    // Otherwise, return with optimization headers
    const response = new Response(originalResponse.body, originalResponse);
    
    // Add caching headers for images
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    response.headers.set('Vary', 'Accept');
    
    // Add format hint
    if (format !== 'jpeg' && format !== 'png') {
      response.headers.set('Content-Type', `image/${format}`);
    }
    
    return response;
  },
};

interface ImageParams {
  width?: number;
  height?: number;
  quality?: number;
  format?: string;
  fit?: 'scale-down' | 'contain' | 'cover' | 'crop' | 'pad';
}

function isImageRequest(pathname: string): boolean {
  return /\.(jpg|jpeg|png|gif|webp|avif)$/i.test(pathname);
}

function parseImageParams(url: URL): ImageParams {
  return {
    width: url.searchParams.get('w') ? parseInt(url.searchParams.get('w')!) : undefined,
    height: url.searchParams.get('h') ? parseInt(url.searchParams.get('h')!) : undefined,
    quality: url.searchParams.get('q') ? parseInt(url.searchParams.get('q')!) : 85,
    format: url.searchParams.get('f') || 'auto',
    fit: (url.searchParams.get('fit') as ImageParams['fit']) || 'scale-down',
  };
}

async function optimizeWithCloudflareImages(
  originalResponse: Response,
  params: ImageParams,
  format: string,
  cfImagesUrl: string
): Promise<Response> {
  // Build Cloudflare Images URL with parameters
  const imageUrl = new URL(cfImagesUrl);
  
  if (params.width) imageUrl.searchParams.set('width', params.width.toString());
  if (params.height) imageUrl.searchParams.set('height', params.height.toString());
  if (params.quality) imageUrl.searchParams.set('quality', params.quality.toString());
  if (format !== 'auto') imageUrl.searchParams.set('format', format);
  if (params.fit) imageUrl.searchParams.set('fit', params.fit);
  
  // Fetch optimized image
  const optimizedResponse = await fetch(imageUrl.toString());
  
  // Add cache headers
  const response = new Response(optimizedResponse.body, optimizedResponse);
  response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  response.headers.set('Vary', 'Accept');
  
  return response;
}

interface Env {
  CF_IMAGES_URL?: string;
}
