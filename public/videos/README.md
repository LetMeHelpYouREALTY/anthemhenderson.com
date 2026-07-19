# Video Assets Guide

## Folder Structure

```
videos/
├── tours/          # Property walkthrough videos
└── (root)          # Hero videos, testimonials
```

## Recommended Specifications

| Type | Resolution | Format | Max Size | Notes |
|------|------------|--------|----------|-------|
| Hero background | 1920x1080 | MP4 (H.264) | 5MB | Loop, no audio |
| Property tour | 1920x1080 | MP4 (H.264) | 50MB | Include audio |
| Testimonial | 1080x1920 or 1920x1080 | MP4 | 20MB | Portrait or landscape |

## Naming Conventions

- Use lowercase with hyphens
- Include address for tours: `123-main-st-tour.mp4`
- Be descriptive: `hero-las-vegas-drone.mp4`

## Video Optimization

### Using HandBrake (Free)
1. Open video in HandBrake
2. Select "Web" preset
3. Set quality: RF 23-28
4. Export as MP4

### Using FFmpeg (CLI)
```bash
# Compress for web
ffmpeg -i input.mp4 -vcodec h264 -acodec aac -crf 23 output.mp4

# Create WebM version (better compression)
ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 output.webm

# Remove audio for background videos
ffmpeg -i input.mp4 -an -vcodec h264 -crf 23 output-noaudio.mp4
```

## Usage in Code

```tsx
// Background video (hero)
<video 
  autoPlay 
  muted 
  loop 
  playsInline
  className="absolute inset-0 w-full h-full object-cover"
>
  <source src="/videos/hero-las-vegas.mp4" type="video/mp4" />
  <source src="/videos/hero-las-vegas.webm" type="video/webm" />
</video>

// Property tour (with controls)
<video controls className="w-full rounded-lg">
  <source src="/videos/tours/123-main-st.mp4" type="video/mp4" />
</video>
```

## Git LFS (For Large Videos)

If videos exceed 50MB, consider Git LFS:

```bash
# Install Git LFS
git lfs install

# Track video files
git lfs track "*.mp4"
git lfs track "*.mov"
git lfs track "*.webm"

# Commit .gitattributes
git add .gitattributes
git commit -m "Enable Git LFS for videos"
```

## Notes

- Keep hero videos under 5MB for fast loading
- Provide both MP4 and WebM for browser compatibility
- Use `poster` attribute for video thumbnails
- Consider hosting large videos on YouTube/Vimeo and embedding
