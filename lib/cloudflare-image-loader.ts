/**
 * Cloudflare Image Loader for Next.js
 * 
 * Custom image loader that optimizes images using Cloudflare Images
 * or falls back to standard optimization.
 */

export default function cloudflareImageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  // If using Cloudflare Images (requires configuration)
  const useCloudflareImages = process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGES_ENABLED === 'true';
  
  if (useCloudflareImages && process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH) {
    const accountHash = process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH;
    // Remove leading slash if present
    const imagePath = src.startsWith('/') ? src.slice(1) : src;
    
    // Build Cloudflare Images URL
    const params = new URLSearchParams({
      width: width.toString(),
      quality: (quality || 85).toString(),
      format: 'auto', // Automatically serves WebP/AVIF when supported
    });
    
    return `https://imagedelivery.net/${accountHash}/${imagePath}?${params.toString()}`;
  }
  
  // Fallback: Use query parameters for Worker-based optimization
  const params = new URLSearchParams({
    w: width.toString(),
    q: (quality || 85).toString(),
    f: 'auto',
  });
  
  return `${src}?${params.toString()}`;
}
