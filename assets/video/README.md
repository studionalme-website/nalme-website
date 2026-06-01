# Studio Nalmé — Video Assets

Drop the following files in this folder and the homepage will activate the video automatically. **No code changes needed.** If files are missing, the site renders the existing still-image experience.

## Files expected

```
/assets/video/
  hero-loop.webm          (6–8 sec, 1280×720, ~450KB, no audio)
  hero-loop.mp4           (6–8 sec, 1280×720, ~650KB, no audio, fallback)
  hero-poster.jpg         (single frame, 1280×720, ~50KB)
  manifesto-loop.webm     (6 sec, 960×540, ~280KB, no audio, desaturated)
  manifesto-loop.mp4      (6 sec, 960×540, ~380KB, no audio, fallback)
```

Total combined weight target: **under 1.5 MB**.

## How the loops are used

### Hero loop
Sits behind the clay-reveal still on the homepage. The warm radial-mask under the cursor reveals video instead of a static image — so video becomes the atmospheric base layer, gently animated. Heavily desaturated and dimmed in CSS, so the footage doesn't need to be perfectly graded.

**Subject ideas:**
- Slow morning light moving across an earth wall
- Hands smoothing lime plaster
- Water filling a swale, settling
- A pendant lit from behind, swaying very slightly
- Wind moving leaves on a food-forest path

The slower the motion, the smaller the file. Hold the camera still.

### Manifesto loop
Sits behind the Manifesto section (Nalmé etymology + Heart-Hands-Home credo). Heavily desaturated, opacity 0.2, mix-blend-mode overlay — so it reads as a texture, not a video. Most visitors will feel it before they see it.

**Subject ideas:**
- Hands kneading lime mortar
- Soil falling through fingers
- Cane being woven, close-up
- A potter's wheel turning, top-down
- Rain hitting a clay tile, slow-motion

## Recording

- **Camera:** any phone (iPhone, Pixel) or DSLR at 4K is fine. The footage downscales to 720p / 540p for the web.
- **Stability:** tripod or stable surface. Handheld shake increases file size by 2–3× because compression has to encode every wobble.
- **Lighting:** natural, slightly underexposed. The CSS dims the footage further; starting too bright wastes data.
- **Duration:** record 30 seconds, pick the best 6–8 seconds.
- **Audio:** doesn't matter, we strip it.

## Compressing

### Option A — FFmpeg (free, command-line, the fastest path)

```bash
# Hero MP4 — universal browser support
ffmpeg -i raw.mov -vf "scale=1280:-2" -c:v libx264 -crf 30 -preset slow -an -movflags +faststart hero-loop.mp4

# Hero WebM — smaller, modern browsers prefer
ffmpeg -i raw.mov -vf "scale=1280:-2" -c:v libvpx-vp9 -crf 33 -b:v 0 -an hero-loop.webm

# Hero poster — instant load while video downloads
ffmpeg -i raw.mov -ss 00:00:02 -vframes 1 -q:v 2 hero-poster.jpg

# Manifesto MP4 — smaller resolution, more compression
ffmpeg -i raw.mov -vf "scale=960:-2" -c:v libx264 -crf 32 -preset slow -an -movflags +faststart manifesto-loop.mp4

# Manifesto WebM
ffmpeg -i raw.mov -vf "scale=960:-2" -c:v libvpx-vp9 -crf 35 -b:v 0 -an manifesto-loop.webm
```

Install FFmpeg on macOS: `brew install ffmpeg`. On Windows: download from ffmpeg.org.

### Option B — HandBrake (free, GUI, easier)

1. Open HandBrake, drop in the raw video.
2. Format: MP4, Codec: H.264.
3. Resolution: 1280×720 (hero) or 960×540 (manifesto).
4. Quality: RF 30 (hero) or 32 (manifesto).
5. Audio: remove all tracks.
6. Web optimized: ON.
7. Export.

Then run only the WebM FFmpeg command separately for the smaller modern variant.

### Option C — Cloudconvert / online tools

If neither of the above is available: cloudconvert.com → MP4 (H.264) → set CRF 30, no audio, scale 1280 width. Slightly larger files than FFmpeg but easier.

## Verifying file size before upload

Target sizes:
- `hero-loop.mp4`: 500–800 KB
- `hero-loop.webm`: 400–600 KB
- `hero-poster.jpg`: 30–80 KB
- `manifesto-loop.mp4`: 250–400 KB
- `manifesto-loop.webm`: 200–300 KB

If your file is significantly larger:
1. Drop resolution (1280 → 960 → 720)
2. Increase CRF by 2–3 points (less quality, smaller file)
3. Shorten duration (8 sec → 6 sec)
4. Pick footage with less motion

## Adding the files

1. Compress to the sizes above.
2. Drop all five files into this folder (`/assets/video/`).
3. Refresh the live site. The hero and manifesto sections will start showing the loops automatically.
4. To disable a loop: just delete the files. The site auto-falls back to the still-image rendering.
